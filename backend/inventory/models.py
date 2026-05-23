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
        ('BOTTLE', 'Bottle'),
        ('CAP', 'Cap'),
        ('LABEL', 'Label'),
        ('CARTON', 'Carton'),
    ]
    SIZE_CHOICES = [
        ('1L', '1 Liter'),
        ('500ML', '500 ml'),
        ('250ML', '250 ml'),
        ('5L', '5 Liters'),
        ('OTHER', 'Other'),
    ]
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    size = models.CharField(max_length=10, choices=SIZE_CHOICES)
    quantity = models.IntegerField(default=0)
    unit_cost = models.DecimalField(max_digits=10, decimal_places=2)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('type', 'size')

    def __str__(self):
        return f"{self.type} - {self.size} ({self.quantity} units)"
