from django.contrib import admin
from .models import Product, Shop, Stock, Follow

# Register your models here.
admin.site.register(Product)

admin.site.register(Shop)

admin.site.register(Stock)

admin.site.register(Follow)