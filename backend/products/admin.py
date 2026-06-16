from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'alcohol_degree', 'price_per_liter', 'cost_per_liter', 'stock_liters', 'in_stock')
    list_editable = ('alcohol_degree', 'price_per_liter', 'cost_per_liter', 'stock_liters')
    search_fields = ('name',)
