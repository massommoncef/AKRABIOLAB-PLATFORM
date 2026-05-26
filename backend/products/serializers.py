from rest_framework import serializers
from .models import Product, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'image', 
            'purchase_price', 'unit_price', 'in_stock', 'quantity',
            'category', 'category_name', 'base_material', 
            'material_quantity_per_unit', 'packaging'
        ]
