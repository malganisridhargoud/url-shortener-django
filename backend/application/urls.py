# this file was created after the urls.py was modified to include this file
from django.urls import path
from .views import redirect_to_original

urlpatterns = [
    path('<str:short_code>/', redirect_to_original, name='redirect_to_original'),
]
