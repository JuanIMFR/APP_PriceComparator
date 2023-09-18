from django.urls import path

from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path(r'createProduct', views.AddProduct.as_view(), name='add-product'),
    path(r'getProducts', views.GetProducts.as_view(), name='get_products'),
    path(r'login', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path(r'token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path(r'register', views.RegisterApi.as_view(), name='register'),
    path(r'price/<int:id>', views.GetPrice.as_view(), name='get_price'),
    path(r'getLocation', views.GetLocation.as_view(), name='get_price'),
    path(r'isAdmin', views.IsAdmin.as_view(), name='is_admin'),
    path(r'follow', views.FollowProduct.as_view(), name='follow_product'),
    path(r'isFollowed', views.IsFollowed.as_view(), name='is_followed'),
]
