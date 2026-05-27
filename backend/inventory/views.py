from rest_framework import viewsets, permissions
from .models import RawMaterial, Packaging
from rest_framework import serializers

class RawMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = RawMaterial
        fields = '__all__'

class PackagingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Packaging
        fields = '__all__'

class RawMaterialViewSet(viewsets.ModelViewSet):
    queryset = RawMaterial.objects.all()
    serializer_class = RawMaterialSerializer
    permission_classes = [permissions.IsAdminUser]

class PackagingViewSet(viewsets.ModelViewSet):
    queryset = Packaging.objects.all()
    serializer_class = PackagingSerializer
    permission_classes = [permissions.IsAdminUser]
