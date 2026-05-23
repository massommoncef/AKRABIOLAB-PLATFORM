from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import transaction
from .models import Order

@receiver(post_save, sender=Order)
def process_order_stock(sender, instance, created, **kwargs):
    # Only subtract stock when order status is changed to 'ACCEPTED'
    if instance.status == 'ACCEPTED':
        with transaction.atomic():
            total_cost = 0
            total_revenue = 0
            
            for item in instance.items.all():
                product = item.product
                qty = item.quantity
                
                # 1. Subtract Raw Material (e.g., Ethanol)
                raw_material = product.base_material
                usage = product.material_quantity_per_unit * qty
                raw_material.quantity -= usage
                raw_material.save()
                
                # Calculate Material Cost
                total_cost += float(raw_material.unit_cost) * usage
                
                # 2. Subtract Packaging (Bottle/Label/Cap/Carton logic simplified here)
                packaging = product.packaging
                packaging.quantity -= qty
                packaging.save()
                
                # Calculate Packaging Cost
                total_cost += float(packaging.unit_cost) * qty
                
                # Calculate Revenue
                total_revenue += float(item.price_at_sale) * qty

            # Update Order Finance Details (avoid recursion by using update)
            Order.objects.filter(pk=instance.pk).update(
                total_amount=total_revenue,
                total_cost=total_cost,
                pure_gain=total_revenue - total_cost
            )
