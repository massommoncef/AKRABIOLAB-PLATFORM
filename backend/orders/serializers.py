from rest_framework import serializers
from .models import Order, OrderItem
from .formats import liters_for
from products.models import Product
from finance.models import Client


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    line_total = serializers.ReadOnlyField()

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'format',
                  'liters', 'price_at_sale', 'line_total', 'stock_applied']
        # liters is computed server-side from format x quantity.
        read_only_fields = ['liters', 'stock_applied']


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
        request = self.context.get('request')
        ignore_stock = request.data.get('ignore_stock', False) if request else False

        if not ignore_stock:
            errors = []
            for item_data in items_data:
                product = item_data.get('product')
                fmt = item_data.get('format', 'VRAC')
                qty = item_data.get('quantity', 0)
                needed = liters_for(fmt, qty)
                if product and needed > (product.stock_liters or 0):
                    errors.append(
                        f"'{product.name}' : liquide insuffisant "
                        f"(stock {product.stock_liters} L, besoin {needed} L). "
                        f"La commande mettra le stock à {round((product.stock_liters or 0) - needed, 2)} L."
                    )
            if errors:
                raise serializers.ValidationError({"items": errors, "type": "STOCK_LOW"})
        return data

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        for item_data in items_data:
            fmt = item_data.get('format', 'VRAC')
            qty = item_data.get('quantity', 0)
            item_data['liters'] = liters_for(fmt, qty)
            OrderItem.objects.create(order=order, **item_data)
        return order
