from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import User

class Product(models.Model):
    class Type(models.IntegerChoices):
        DEFAULT = 0, _('Undefined')
        MOBILE = 1, _('Mobile')
        COMPUTER = 2, _('Computer')
        TABLET = 3, _('Tablet')

    name = models.CharField(max_length=128,  blank=False)
    description = models.TextField( blank=False)
    type = models.IntegerField(default=Type.DEFAULT, choices=Type.choices)
    image = models.TextField(max_length=1000000, default=None)
    users = models.ManyToManyField(User, through='Follow')

class Shop(models.Model):
    name = models.CharField(max_length=128, blank=False)
    logo = models.ImageField(upload_to='assets/img/', default=None, blank=False)
    products = models.ManyToManyField(Product, through='Stock')


class Stock(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE,)
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE,)
    price= models.DecimalField(max_digits=10, decimal_places=2, blank=False)
    date = models.DateTimeField()
    url = models.TextField(blank=False)

class Follow(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,)
    product = models.ForeignKey(Product, on_delete=models.CASCADE,)