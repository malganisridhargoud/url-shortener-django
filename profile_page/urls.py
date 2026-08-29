from django.urls import path
from . import views

urlpatterns = [
    path("",views.urlshort,name="home"),
    path("<str:slugs>/",views.urlRedirect,name="redirect")
]
