from rest_framework import serializers
from rest_framework import status
from .serializers import RegisterSerializer, UserSerializer, ProductSerializer, ShopSerializer, StockSerializer, FollowSerializer
from rest_framework.decorators import api_view
from .models import Product, Shop, Stock, Follow
from rest_framework.response import Response
from rest_framework import generics, permissions, mixins
from django.contrib.auth.models import User
from rest_framework.permissions import  IsAdminUser, IsAuthenticated
from rest_framework.views import APIView
from serpapi import GoogleSearch
import requests
import json


from bs4 import BeautifulSoup
from urllib.request import Request, urlopen
import json

 
class AddProduct(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        item = ProductSerializer(data=request.data)
        
        # validating for already existing data
        if Product.objects.filter(**request.data).exists():
            raise serializers.ValidationError('This data already exists')
    
        if item.is_valid():
            item.save()
            return Response('Product saved correctly')
        else:
            return Response('An error ocurred while saving the product', status=status.HTTP_404_NOT_FOUND)
    
class GetProducts(generics.GenericAPIView):
    def get(self, request):
        # checking for the parameters from the URL
        q = request.GET.get('q')
        filter = request.GET.get('type')

        items = Product.objects.all()

        if(q):
            items = items.filter(name__contains=q)
        if(filter):
            if filter == 'mobile':
                items = items.filter(type=1)
            elif filter == 'computer':
                items = items.filter(type=2)
            elif filter == 'tablet':
                items = items.filter(type=3)

        serializer = ProductSerializer(items, many=True)

        # if there is something in items else raise error
        if items:
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
    

#Register API
class RegisterApi(APIView):
    def post(self, request, *args,  **kwargs):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.is_active = True
        serializer.save()
        return Response({
            "message": "User Created Successfully.  Now perform Login to get your token",
        })
    


#Return prices
class GetPrice(generics.GenericAPIView):
    def get(self, request, id):
        def price(id):
            try:
                numShops = Stock.objects.filter(product_id = id).distinct("shop_id").order_by("shop_id", "-date")
                num = len(numShops)
                query = '{}'
                for x in range(num):
                    shop = Shop.objects.get(id = numShops[x].shop_id)
                    product = Stock.objects.filter(product_id = id, shop_id = shop.id).order_by("-date")
                    data = {shop.name:str(product[0].price)}
                    result = json.loads(query)
                    result.update(data)
                    query = json.dumps(result)

                return json.loads(query)
            except Exception as e:
                print(e)
                return "Error"
        def shopURL(id):
            try:
                numShops = Stock.objects.filter(product_id = id).distinct("shop_id").order_by("shop_id", "-date")
                num = len(numShops)
                query = '{}'
                for x in range(num):
                    shop = Shop.objects.get(id = numShops[x].shop_id)
                    product = Stock.objects.filter(product_id = id, shop_id = shop.id).order_by("date")
                    data = {shop.name:str(product[0].url)}
                    result = json.loads(query)
                    result.update(data)
                    query = json.dumps(result)

                return json.loads(query)
            except Exception as e:
                print(e)
                return "Error"
        def getData(id):
            try:
                productData = Product.objects.get(id = id)
                productId = productData.id
                productName = productData.name
                productImg = productData.image
                productDesc = productData.description
                data = { "id":productId,
                         "nombre":productName,
                         "foto":productImg,
                         "precio":price(id),
                         "descripcion":productDesc,
                          "urls":shopURL(id) }
                data = json.dumps(data)
                return json.loads(data)

            except Exception as e:
                print(e)
                return "Error"
        return Response({
            "data" : getData(id)
        })
    
class GetLocation(generics.GenericAPIView):
    def post(self, request):
        latitude = request.data['latitude']
        longitude = request.data['longitude']
        coords = {'latitude' : latitude, 'longitude': longitude }
        ll = f"@{coords['latitude']},{coords['longitude']},15.1z"
        params = {
            "engine": "google_maps",
            "q": request.data['shop'],
            "ll": ll,
            "type": "search",
            "api_key": "a0de1980e19a843ab64e7d5337bd68c12859a89a3590659a2d8d699ceda80726"
        }

        search = GoogleSearch(params)
        results = search.get_dict()

        data_id = results['local_results'][0]['data_id']
        place_id = results['local_results'][0]['place_id']
        latitude = results['local_results'][0]['gps_coordinates']['latitude']
        longitude = results['local_results'][0]['gps_coordinates']['longitude']

        data = f'!4m5!3m4!1s{data_id}!8m2!3d{latitude}!4d{longitude}'

        params = {
            "engine": "google_maps",
            "type": "place",
            "data": data,
            "place_id" : place_id,
            "api_key": "a0de1980e19a843ab64e7d5337bd68c12859a89a3590659a2d8d699ceda80726"
        }

        search = GoogleSearch(params)
        results = search.get_dict()
        return Response(results['search_metadata']['google_maps_url'])
    
class IsAdmin(generics.GenericAPIView):
    def get(self, request):
        current_user = request.user
        if(current_user.is_superuser):
            return Response('ok')
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
class FollowProduct(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        current_user = request.user
        item = FollowSerializer(data={'user' : current_user.id ,'product' : request.data['product']})
        
        # validating for already existing data
        if Follow.objects.filter(**{'user' : current_user.id ,'product' : request.data['product']}).exists():
            Follow.objects.filter(**{'user' : current_user.id ,'product' : request.data['product']}).delete()
            return Response({'follow': False})
    
        if item.is_valid():
            item.save()
            return Response({'follow': True})
        else:
            return Response('An error ocurred while following the product', status=status.HTTP_404_NOT_FOUND)
        
class IsFollowed(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        current_user = request.user
        
        # validating for already existing data
        if Follow.objects.filter(**{'user' : current_user.id ,'product' : request.data['product']}).exists():
            return Response({'follow': True})
        else:
            return Response({'follow': False})
