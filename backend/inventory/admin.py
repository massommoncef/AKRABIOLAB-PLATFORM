from django.contrib import admin
from .models import RawMaterial, Packaging

@admin.register(RawMaterial)
class RawMaterialAdmin(admin.ModelAdmin):
    list_display = ('name', 'quantity', 'unit', 'unit_cost', 'updated_at')
    search_fields = ('name',)

@admin.register(Packaging)
class PackagingAdmin(admin.ModelAdmin):
    list_display = ('type', 'size', 'quantity', 'unit_cost', 'updated_at')
    list_filter = ('type', 'size')
