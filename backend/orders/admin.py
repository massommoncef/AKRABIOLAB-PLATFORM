from django.contrib import admin
from django.utils.html import format_html
from django.urls import path, reverse
from .models import Order, OrderItem
from .utils import generate_invoice_pdf, generate_bl_pdf

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1
    fields = ('product', 'format', 'quantity', 'liters', 'price_at_sale', 'stock_applied')
    readonly_fields = ('liters', 'stock_applied')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'client', 'status', 'total_amount_ttc', 'is_paid', 'created_at', 'invoice_link', 'bl_link')
    list_filter = ('status', 'is_paid', 'created_at')
    search_fields = ('client__name',)
    inlines = [OrderItemInline]
    readonly_fields = ('total_amount_ht', 'total_amount_ttc', 'total_cost', 'pure_gain')
    
    def invoice_link(self, obj):
        if obj.id:
            return format_html('<a class="button" href="{}" target="_blank">Facture PDF</a>', 
                               reverse('admin:generate_invoice_pdf', args=[obj.id]))
        return "-"
    invoice_link.short_description = "Facture"

    def bl_link(self, obj):
        if obj.id:
            return format_html('<a class="button" href="{}" target="_blank">BL PDF</a>', 
                               reverse('admin:generate_bl_pdf', args=[obj.id]))
        return "-"
    bl_link.short_description = "Bon de Livraison"

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('<int:order_id>/invoice/', self.admin_site.admin_view(generate_invoice_pdf), name='generate_invoice_pdf'),
            path('<int:order_id>/bl/', self.admin_site.admin_view(generate_bl_pdf), name='generate_bl_pdf'),
        ]
        return custom_urls + urls
