from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet
from .utils import generate_invoice_pdf, generate_bl_pdf

router = DefaultRouter()
router.register(r'list', OrderViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('download-invoice/<int:order_id>/', generate_invoice_pdf, name='download_invoice'),
    path('download-bl/<int:order_id>/', generate_bl_pdf, name='download_bl'),
]
