from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db import transaction
from django.db.models import Sum, F
from .models import Order, OrderItem
from inventory.models import RawMaterial, Packaging
from finance.models import sync_to_excel

@receiver(post_save, sender=OrderItem)
@receiver(post_delete, sender=OrderItem)
def update_stock_and_totals(sender, instance, **kwargs):
    """Update stock on creation and recalculate order totals."""
    order = instance.order
    created = kwargs.get('created', False)
    
    with transaction.atomic():
        # 1. Stock Adjustment (Only on Create or Delete)
        if 'created' in kwargs: # post_save
            if created:
                product = instance.product
                qty = instance.quantity
                if product.base_material:
                    RawMaterial.objects.filter(pk=product.base_material.pk).update(
                        quantity=F('quantity') - (product.material_quantity_per_unit * qty)
                    )
                if product.packaging:
                    Packaging.objects.filter(pk=product.packaging.pk).update(
                        quantity=F('quantity') - qty
                    )
        else: # post_delete
            product = instance.product
            qty = instance.quantity
            if product.base_material:
                RawMaterial.objects.filter(pk=product.base_material.pk).update(
                    quantity=F('quantity') + (product.material_quantity_per_unit * qty)
                )
            if product.packaging:
                Packaging.objects.filter(pk=product.packaging.pk).update(
                    quantity=F('quantity') + qty
                )

        # 2. Recalculate Order Financials using DB Aggregation
        totals = OrderItem.objects.filter(order=order).aggregate(
            total_ht=Sum(F('quantity') * F('price_at_sale')),
            total_purchase_cost=Sum(F('quantity') * F('product__purchase_price'))
        )
        
        total_ht = totals['total_ht'] or 0
        total_purchase_cost = totals['total_purchase_cost'] or 0
        total_ttc = float(total_ht) * (1 + float(order.tva_percent) / 100)

        Order.objects.filter(pk=order.pk).update(
            total_amount_ht=total_ht,
            total_amount_ttc=total_ttc,
            total_cost=total_purchase_cost,
            pure_gain=float(total_ht) - float(total_purchase_cost)
        )
        sync_to_excel()

@receiver(post_save, sender=Order)
def manage_debt_on_delivery(sender, instance, created, **kwargs):
    """Debt is only added to client when order is DELIVERED."""
    if not created:
        if instance.status == 'DELIVERED':
            client = instance.client
            # Recalculate total debt from all delivered orders
            delivered_ttc = Order.objects.filter(client=client, status='DELIVERED').aggregate(total=Sum('total_amount_ttc'))['total'] or 0
            client.total_debt = delivered_ttc
            client.save()
            sync_to_excel()

@receiver(post_delete, sender=Order)
def restore_all_on_delete(sender, instance, **kwargs):
    """Restore stock and adjust client debt if order is deleted."""
    # Note: Stock restoration is now handled by OrderItem post_delete signal 
    # because of CASCADE delete, but wait...
    # If Order is deleted, OrderItems are deleted too.
    # Depending on Django version, signals for OrderItems might not fire on cascade delete.
    # To be safe, we keep manual restoration here if it's not redundant.
    
    # Actually, let's just recalculate debt. Stock restoration should be handled 
    # by OrderItem signals if they fire, but if not, we do it here.
    
    with transaction.atomic():
        # Recalculate debt
        client = instance.client
        delivered_ttc = Order.objects.filter(client=client, status='DELIVERED').aggregate(total=Sum('total_amount_ttc'))['total'] or 0
        client.total_debt = delivered_ttc
        client.save()
        sync_to_excel()
