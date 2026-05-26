from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RawMaterialViewSet, PackagingViewSet

router = DefaultRouter()
router.register(r'materials', RawMaterialViewSet)
router.register(r'packaging', PackagingViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
