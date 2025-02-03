# Dans urls.py de votre application Django

from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('add/', views.add_depense, name='add_depense'),
    path('delete/', views.delete_depense, name='delete_depense'),
]
