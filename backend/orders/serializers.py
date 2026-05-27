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

    def validate(self, data):
        items_data = data.get('items', [])
        ignore_stock = self.context.get('request').data.get('ignore_stock', False) if self.context.get('request') else False
        
        if not ignore_stock:
            errors = []
            for item_data in items_data:
                product = item_data.get('product')
                quantity = item_data.get('quantity')
                if product and quantity > product.quantity:
                    errors.append(
                        f"Le produit '{product.name}' n'a pas cette quantité en stock (Stock: {product.quantity}, Demandé: {quantity}). "
                        f"Si tu fais cette commande, la quantité va être avec moins ({product.quantity - quantity})"
                    )
            if errors:
                raise serializers.ValidationError({"items": errors, "type": "STOCK_LOW"})
        return data

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        # Note: The 'ACCEPTED' status logic in signals.py will trigger if status is set to 'ACCEPTED'
        return order
