from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db import transaction
from django.db.models import Sum, F
from .models import Order, OrderItem
from .formats import consumption_for, liters_for
from products.models import Product
from inventory.models import Packaging
from finance.models import sync_to_excel

# Statuses for which stock should be deducted ("reserved"). CANCELLED releases it.
ACTIVE_STATUSES = ('PENDING', 'ACCEPTED', 'DELIVERED')


def _move_item_stock(item, sign):
    """
    Apply (sign=-1) or release (sign=+1) the full bill of materials for an
    order line: degree-specific labels, bottles, caps, cartons, bidons, and the
    liquid itself. Uses F() updates so it is concurrency-safe and never fires
    nested signals.
    """
    # Liquid (in liters)
    liters = item.liters or liters_for(item.format, item.quantity)
    if liters:
        Product.objects.filter(pk=item.product_id).update(
            stock_liters=F('stock_liters') + sign * liters
        )
    # Packaging (bottles / caps / cartons / bidons / labels)
    degree = getattr(item.product, 'alcohol_degree', 0) or 0
    for part in consumption_for(item.format, item.quantity, degree):
        pkg, _ = Packaging.objects.get_or_create(
            type=part['type'],
            size=part['size'],
            alcohol_degree=part['alcohol_degree'],
            defaults={'unit_cost': 0},
        )
        Packaging.objects.filter(pk=pkg.pk).update(
            quantity=F('quantity') + sign * part['count']
        )


def reserve_item(item):
    """Deduct stock for an item once (idempotent via stock_applied flag)."""
    if item.stock_applied:
        return
    _move_item_stock(item, -1)
    OrderItem.objects.filter(pk=item.pk).update(stock_applied=True)


def restore_item(item):
    """Give stock back for an item once (idempotent via stock_applied flag)."""
    if not item.stock_applied:
        return
    _move_item_stock(item, +1)
    OrderItem.objects.filter(pk=item.pk).update(stock_applied=False)


def _recalculate_order_financials(order):
    """Recompute order totals from its items (price is per liter)."""
    total_ht = 0.0
    total_cost = 0.0
    for it in OrderItem.objects.filter(order=order).select_related('product'):
        liters = it.liters or 0
        if liters:
            total_ht += liters * float(it.price_at_sale)
            total_cost += liters * float(it.product.cost_per_liter or 0)
        else:
            # Legacy line (no liters): fall back to unit-based pricing.
            total_ht += it.quantity * float(it.price_at_sale)
            total_cost += it.quantity * float(it.product.purchase_price or 0)

    total_ttc = total_ht * (1 + float(order.tva_percent) / 100)
    Order.objects.filter(pk=order.pk).update(
        total_amount_ht=total_ht,
        total_amount_ttc=total_ttc,
        total_cost=total_cost,
        pure_gain=total_ht - total_cost,
    )


@receiver(post_save, sender=OrderItem)
def on_orderitem_saved(sender, instance, created, **kwargs):
    with transaction.atomic():
        if created and instance.order.status in ACTIVE_STATUSES:
            instance.refresh_from_db()  # ensure liters/format are loaded
            reserve_item(instance)
        _recalculate_order_financials(instance.order)
    sync_to_excel()


@receiver(post_delete, sender=OrderItem)
def on_orderitem_deleted(sender, instance, **kwargs):
    with transaction.atomic():
        restore_item(instance)
        # Order may be gone (cascade); guard the recalculation.
        if Order.objects.filter(pk=instance.order_id).exists():
            _recalculate_order_financials(instance.order)
    sync_to_excel()


@receiver(post_save, sender=Order)
def on_order_saved(sender, instance, created, **kwargs):
    """React to status changes: release stock on cancel, re-reserve otherwise."""
    if created:
        return
    with transaction.atomic():
        items = list(OrderItem.objects.filter(order=instance).select_related('product'))
        if instance.status == 'CANCELLED':
            for it in items:
                restore_item(it)
        else:  # active again
            for it in items:
                reserve_item(it)

        # Debt is only counted from DELIVERED orders.
        if instance.status in ('DELIVERED', 'CANCELLED'):
            client = instance.client
            delivered_ttc = Order.objects.filter(
                client=client, status='DELIVERED'
            ).aggregate(total=Sum('total_amount_ttc'))['total'] or 0
            client.total_debt = delivered_ttc
            client.save()
    sync_to_excel()


@receiver(post_delete, sender=Order)
def on_order_deleted(sender, instance, **kwargs):
    """Recompute client debt after an order is removed (stock handled per-item)."""
    with transaction.atomic():
        client = instance.client
        delivered_ttc = Order.objects.filter(
            client=client, status='DELIVERED'
        ).aggregate(total=Sum('total_amount_ttc'))['total'] or 0
        client.total_debt = delivered_ttc
        client.save()
    sync_to_excel()
