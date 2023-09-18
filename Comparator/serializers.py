from django.db.models import fields
from rest_framework import serializers
from .models import Product
from .models import Shop
from .models import Stock
from .models import Follow
from django.db import models
from django.contrib.auth.models import User
 
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ('id', 'name', 'description', 'type', 'image')


class ShopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shop
        fields = ('name', 'logo', 'products')


class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = ('product', 'shop', 'price', 'date', 'url')

# Register serializer
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','username','password', 'email', 'first_name', 'last_name')
    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'], password = validated_data['password'], email = validated_data['email'], first_name=validated_data['first_name'],  last_name=validated_data['last_name'])
        return user
# User serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follow
        fields = ('user', 'product')
