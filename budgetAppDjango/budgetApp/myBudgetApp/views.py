from django.shortcuts import redirect
from django.shortcuts import render
from django.http import HttpResponse
from .models import Depense
from datetime import datetime

# Fx pr obtenir le mois e year
def getDate():
    today = datetime.now()
    return today.strftime("%B %Y")


# fx pr avoir budget total duliste envoye
def availableBudget(depenses):
    total = sum(depense.value for depense in depenses)
    return float(total)


# fx pr retourner liste de pos depenses ou nega depenses
def typeOfDepenses(isPositive):
    if isPositive:
        return Depense.objects.filter(value__gt=0)
    else:
        return Depense.objects.filter(value__lte=0)


# fx pr retourner somme de depenses en matiere de liste
def sumOfDepenses(isPositive):
    if isPositive:
        positive_depenses = Depense.objects.filter(value__gt=0)
        return availableBudget(positive_depenses)
    else:
        negative_depenses = Depense.objects.filter(value__lte=0)
        return availableBudget(negative_depenses)


def expensesPercentage():
    sum_of_all_incomes = sumOfDepenses(True)
    if sum_of_all_incomes > 0:
        sum_of_all_expenses = sumOfDepenses(False) * -1
        return (sum_of_all_expenses * 100) / sum_of_all_incomes
    return 0

def index(request):
    allDepenses = Depense.objects.all()

    #if there is at least one depense and last depense is negative then the select is set to keep on negative
    choice = True
    if len(allDepenses) > 1 and allDepenses.last().value < 0:
        choice = False

    
    for e in typeOfDepenses(False):
        print(e)
    context = {
        'date': getDate(),
        'availableBudget': availableBudget(allDepenses),
        'income': sumOfDepenses(True),
        'expenses': sumOfDepenses(False),
        'percentage': float(expensesPercentage()),
        'listOfIncomes': typeOfDepenses(True),
        'listOfExpenses': typeOfDepenses(False),
        'choice': choice
    }

    return render(request, 'myBudgetApp/index.html', context)


def add_depense(request):
    newTitle = request.POST.get('title')
    newValue = float(request.POST.get('value'))
    type = request.POST.get('choice')

    if type == "expenses":
        newValue *= -1

    newDepense = Depense(title=newTitle, value=newValue)
    newDepense.save()

    return redirect('index')


def delete_depense(request):
    depenseId = int(request.POST.get('depense'))
    depenseToDelete = Depense.objects.get(id=depenseId)

    if depenseToDelete:
        depenseToDelete.delete()
    else:
        print("Not found")

    return redirect('index')
