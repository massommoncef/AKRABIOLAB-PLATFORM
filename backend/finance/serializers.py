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
        
        # Calculer la balance réelle (sans le max(0) de la property par sécurité ici)
        actual_balance = client.total_debt - client.total_paid
        
        if actual_balance <= 0:
            raise serializers.ValidationError({"detail": "Impossible : Ce client n'a aucune dette."})
            
        if amount > actual_balance:
            raise serializers.ValidationError({"detail": f"Impossible : L'encaissement ({amount} DA) est plus grand que la dette ({actual_balance} DA)."})
            
        return data
