from rest_framework import serializers
from .models import Client, Payment

class ClientSerializer(serializers.ModelSerializer):
    balance = serializers.ReadOnlyField()
    
    class Meta:
        model = Client
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
