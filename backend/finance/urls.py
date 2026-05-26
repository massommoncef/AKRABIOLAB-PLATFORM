from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClientViewSet, PaymentViewSet

router = DefaultRouter()
router.register(r'clients', ClientViewSet)
router.register(r'payments', PaymentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
