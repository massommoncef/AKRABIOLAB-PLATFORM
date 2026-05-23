from django.db import models
from inventory.models import RawMaterial, Packaging

class Product(models.Model):
    name = models.CharField(max_length=100)
    base_material = models.ForeignKey(RawMaterial, on_delete=models.CASCADE)
    material_quantity_per_unit = models.FloatField(help_text="Quantity of raw material per bottle (e.g., 1.0 for 1L)")
    packaging = models.ForeignKey(Packaging, on_delete=models.CASCADE)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name

class Order(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('ACCEPTED', 'Accepted'),
        ('CANCELLED', 'Cancelled'),
    ]
    client_name = models.CharField(max_length=200)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    pure_gain = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    def __str__(self):
        return f"Order {self.id} - {self.client_name}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price_at_sale = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"
