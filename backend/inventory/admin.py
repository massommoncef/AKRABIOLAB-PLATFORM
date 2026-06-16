from django.contrib import admin
from .models import RawMaterial, Packaging

@admin.register(RawMaterial)
class RawMaterialAdmin(admin.ModelAdmin):
    list_display = ('name', 'quantity', 'unit', 'unit_cost', 'updated_at')
    search_fields = ('name',)

@admin.register(Packaging)
class PackagingAdmin(admin.ModelAdmin):
    list_display = ('type', 'size', 'alcohol_degree', 'quantity', 'low_stock_threshold', 'is_low_stock', 'unit_cost', 'updated_at')
    list_filter = ('type', 'size')
    list_editable = ('quantity', 'low_stock_threshold')
