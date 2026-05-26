from django.contrib import admin
from .models import Client, Payment

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('name', 'domain', 'phone', 'total_debt', 'total_paid', 'balance')
    list_filter = ('domain',)
    search_fields = ('name', 'phone')
    readonly_fields = ('total_debt', 'total_paid')

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('client', 'amount', 'date')
    list_filter = ('date', 'client')
    search_fields = ('client__name',)
