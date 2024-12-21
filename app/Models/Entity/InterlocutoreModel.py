from neomodel import RelationshipFrom,StructuredNode, RelationshipTo, StringProperty, IntegerProperty, DateProperty
from django.db import models
from app.Models.Relationship.HaConversatoModel import HaConversatoModel


class InterlocutoreModel(StructuredNode):
    idInterlocutore = IntegerProperty(primary_key=True, generated_value=True)
    
    nodeId = IntegerProperty(primary_key=True, json_property="nodeId")
    capResidenza = StringProperty()
    cittaResidenza = StringProperty()
    community = StringProperty()
    dataNascita = StringProperty()
    indirizzoResidenza = StringProperty()
    lat = StringProperty()
    lng = StringProperty()
    luogoNascita = StringProperty()
    mesiCondanna = StringProperty()
    mesiImputati = StringProperty()
    mesiTotali = StringProperty()
    nazioneResidenza = StringProperty()
    nome = StringProperty(primary_key=True, json_property="nome")
    provinciaResidenza = StringProperty()
    frasiDette = StringProperty()
    emozione_predominante = StringProperty()
    nomeReato = StringProperty()
    normeDiRiferimento = StringProperty()
  
    # Sezione di definizione delle relazioni
    haConversato = RelationshipTo('Interlocutore', 'HaConversato', model=HaConversatoModel)
    

