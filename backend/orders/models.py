from django.db import models
from products.models import Product
from finance.models import Client

class Order(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'En attente'),
        ('ACCEPTED', 'Acceptée'),
        ('CANCELLED', 'Annulée'),
        ('DELIVERED', 'Livrée'),
    ]
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    expected_delivery = models.DateField(null=True, blank=True)
    
    # Financial tracking
    total_amount_ht = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    tva_percent = models.DecimalField(max_digits=5, decimal_places=2, default=19.0)
    total_amount_ttc = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    # Internal benefit tracking
    total_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    pure_gain = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    is_paid = models.BooleanField(default=False)

    def __str__(self):
        return f"Order #{self.id} - {self.client.name}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price_at_sale = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"
