from django.db import models

# Create your models here.
# Dans models.py de votre application Django

from django.db import models


class Depense(models.Model):
    title = models.CharField(max_length=100)
    value = models.DecimalField(max_digits=10, decimal_places=2)
