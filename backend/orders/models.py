from django.db import models
from products.models import Product
from finance.models import Client
from .formats import FORMAT_CHOICES, DEFAULT_FORMAT, liters_for

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
    # Number of format-units ordered (cartons / bidons / IBC). For VRAC, this is liters.
    quantity = models.IntegerField()
    format = models.CharField(max_length=20, choices=FORMAT_CHOICES, default=DEFAULT_FORMAT)
    # Total liters of liquid for this line (computed from format x quantity).
    liters = models.FloatField(default=0)
    # price_at_sale is the price PER LITER at the moment of sale.
    price_at_sale = models.DecimalField(max_digits=10, decimal_places=2)
    # Whether this line's stock (liquid + packaging) is currently deducted.
    stock_applied = models.BooleanField(default=False)

    @property
    def line_total(self):
        return float(self.liters) * float(self.price_at_sale)

    def save(self, *args, **kwargs):
        # Always keep liters in sync with format x quantity, whatever the
        # creation path (API, Django admin, shell).
        self.liters = liters_for(self.format, self.quantity)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.quantity} x {self.product.name} ({self.format})"
