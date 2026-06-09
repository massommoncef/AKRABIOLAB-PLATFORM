from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'image', 
            'purchase_price', 'unit_price', 'in_stock', 'quantity',
            'base_material', 'material_quantity_per_unit', 'packaging'
        ]
