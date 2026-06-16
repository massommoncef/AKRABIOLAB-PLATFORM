from django.db import models

class RawMaterial(models.Model):
    UNIT_CHOICES = [
        ('L', 'Liters'),
        ('KG', 'Kilograms'),
        ('UNIT', 'Units'),
    ]
    name = models.CharField(max_length=100, unique=True)
    quantity = models.FloatField(default=0.0)
    unit = models.CharField(max_length=10, choices=UNIT_CHOICES)
    unit_cost = models.DecimalField(max_digits=10, decimal_places=2)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.quantity} {self.unit})"

class Packaging(models.Model):
    TYPE_CHOICES = [
        ('BOTTLE', 'Flacon'),
        ('CAP', 'Bouchon'),
        ('LABEL', 'Étiquette'),
        ('CARTON', 'Carton'),
        ('BIDON', 'Bidon'),
    ]
    SIZE_CHOICES = [
        ('250ML', '250 ml'),
        ('500ML', '500 ml'),
        ('1L', '1 Litre'),
        ('5L', '5 Litres'),
        ('PETIT', 'Petit carton'),
        ('GRAND', 'Grand carton'),
        ('NA', 'N/A'),
        ('OTHER', 'Other'),
    ]
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    size = models.CharField(max_length=10, choices=SIZE_CHOICES, default='NA')
    # For labels: the alcohol degree printed on it (70, 96...). 0 = not applicable.
    alcohol_degree = models.IntegerField(default=0, help_text="Degré d'alcool (étiquettes). 0 = non applicable")
    quantity = models.IntegerField(default=0)
    unit_cost = models.DecimalField(max_digits=10, decimal_places=2)
    # When quantity drops to/below this, the stock is flagged as "bientôt terminé".
    low_stock_threshold = models.IntegerField(default=0, help_text="Seuil d'alerte stock bas")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('type', 'size', 'alcohol_degree')

    @property
    def is_low_stock(self):
        return self.low_stock_threshold > 0 and self.quantity <= self.low_stock_threshold

    def __str__(self):
        label = f"{self.get_type_display()} {self.get_size_display()}"
        if self.type == 'LABEL' and self.alcohol_degree:
            label += f" {self.alcohol_degree}°"
        return f"{label} ({self.quantity})"
