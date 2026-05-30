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

    def validate(self, data):
        client = data.get('client')
        amount = data.get('amount')
        
        if client.balance <= 0:
            raise serializers.ValidationError({"detail": "Ce client n'a aucune dette en cours."})
            
        if amount > client.balance:
            raise serializers.ValidationError({"detail": f"Le montant du paiement ({amount} DA) dépasse la dette actuelle ({client.balance} DA)."})
            
        return data
