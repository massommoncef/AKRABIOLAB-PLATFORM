from rest_framework import serializers
from .models import Order, OrderItem
from products.models import Product
from finance.models import Client

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price_at_sale']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    client_name = serializers.ReadOnlyField(source='client.name')
    
    class Meta:
        model = Order
        fields = [
            'id', 'client', 'client_name', 'status', 'created_at', 
            'expected_delivery', 'total_amount_ht', 'tva_percent', 
            'total_amount_ttc', 'is_paid', 'items'
        ]

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        # Note: The 'ACCEPTED' status logic in signals.py will trigger if status is set to 'ACCEPTED'
        return order
