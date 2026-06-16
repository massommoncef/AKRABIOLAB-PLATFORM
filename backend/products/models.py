from django.db import models
from inventory.models import RawMaterial, Packaging

class Product(models.Model):
    UNIT_CHOICES = [
        ('L', 'Liters'),
        ('KG', 'Kilograms'),
        ('UNIT', 'Units'),
    ]
    
    name = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='products/', null=True, blank=True)

    # The product is a liquid identified by its alcohol degree (70, 96...).
    alcohol_degree = models.IntegerField(default=0, help_text="Degré d'alcool (70, 96...)")

    # Financials (per liter — the canonical pricing model)
    price_per_liter = models.DecimalField(max_digits=12, decimal_places=2, default=0, help_text="Prix de vente au litre")
    cost_per_liter = models.DecimalField(max_digits=12, decimal_places=2, default=0, help_text="Coût de revient au litre")
    # Finished liquid available for orders (in liters)
    stock_liters = models.FloatField(default=0, help_text="Stock de liquide fini (litres)")

    # --- Legacy fields (kept for backward compatibility, superseded by *_per_liter) ---
    purchase_price = models.DecimalField(max_digits=12, decimal_places=2, default=0, help_text="Prix d'achat ou coût de revient")
    unit_price = models.DecimalField(max_digits=12, decimal_places=2, default=0, help_text="Prix de vente")

    # Inventory Link
    base_material = models.ForeignKey(RawMaterial, on_delete=models.SET_NULL, null=True, blank=True)
    material_quantity_per_unit = models.FloatField(default=0.0)
    packaging = models.ForeignKey(Packaging, on_delete=models.SET_NULL, null=True, blank=True)
    
    quantity = models.FloatField(default=0, help_text="Stock de produits finis")
    unit = models.CharField(max_length=10, choices=UNIT_CHOICES, default='UNIT')
    in_stock = models.BooleanField(default=True)

    def __str__(self):
        return self.name
