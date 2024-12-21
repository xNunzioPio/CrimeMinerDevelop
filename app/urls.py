from django.urls import path, include
from . import views
from app.Views.IndividuoView import IndividuoView
from app.Views.IndividuoIntercettazioneView import IndividuoIntercettazioneView
from app.Views.IndividuoReatoIntercettazioneAmbView import IndividuoReatoIntercettazioneAmbView
from app.Views.IndividuoIntercettazioneAmbView import IndividuoIntercettazioneAmbView
from app.Views.IndividuoReatoView import IndividuoReatoView
from app.Views.IntercettazioneAmbView import IntercettazioneAmbView
from app.Views.interlocutoreCrimesView import InterlocutoreCrimesView



from django_request_mapping import UrlPattern


urlpattern = UrlPattern()
#Registrazione delle view del backend
urlpattern.register(IndividuoView)
urlpattern.register(IndividuoIntercettazioneView)
urlpattern.register(IndividuoReatoIntercettazioneAmbView)
urlpattern.register(IndividuoIntercettazioneAmbView)
urlpattern.register(IndividuoReatoView)
urlpattern.register(IntercettazioneAmbView)
urlpattern.register(InterlocutoreCrimesView)



urlpatterns = [
    path('', views.welcome, name="welcomePage"),
    path('dashboard', views.app, name="dashboard"),
    path('dashboard_uno', views.dashboard_uno, name="dashboard_uno"),
    path('navbar', views.navbar, name="navbar"),
    path('selezioneProcesso', views.selezioneProcesso, name="selezioneProcesso"),
    path('team', views.Team, name="team"),
    path('chiamate_individui', views.individualWiretaps, name='individualWiretaps'),
    path('crimini_individui', views.individualCrimes, name='individualCrimes'),
    path('intercettazioni_ambientali_individui', views.individualEnviromentalTapping, name='individualEnviromentalTapping'),
    path('intercettazioni_ambientali_crimini_individui', views.individualCrimesEnviromentalTapping, name='individualCrimesEnviromentalTapping'),
    path('interlocutoreCrimes', views.interlocutoreCrimes, name='interlocutoreCrimes'),
    path('getRelationsByTimeInterval/<str:start_date>/<str:end_date>/', views.interlocutoreCrimes, name='get_relations_by_time_interval'),
    #Path per la registrazione di tutte le View del Backend funzionante con request mapping. Si crea una classe view, si definiscono le request mapping in questa classe creata
    #e si registra la view creata in urlpattern
    path('', include(urlpattern)) 
    
]









