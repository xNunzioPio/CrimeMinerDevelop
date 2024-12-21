from django.shortcuts import render

# Create your views here.
def welcome(request):
    return render(request, 'welcomePage.html')

def selezioneProcesso(request):
    return render(request, 'selezioneProcesso.html')

def app(request):
    return render(request, 'dashboard.html')

def dashboard_uno(request):
    return render(request, 'dashboard_uno.html')

def navbar(reqeust):
    return render(reqeust, 'navbar.html')

def individualWiretaps(request):
    return render(request, 'features/individualWiretaps.html')

def individualCrimes(request):
    return render(request, 'features/individualCrimes.html')

def individualEnviromentalTapping(request):
    return render(request, 'features/individualEnviromentalTapping.html')

def individualCrimesEnviromentalTapping(request):
    return render(request, 'features/individualCrimesEnviromentalTapping.html')

def interlocutoreCrimes(request):
    return render(request, 'features/interlocutoreCrimes.html')

def Team(reqeust):
    return render(reqeust, 'Team.html')