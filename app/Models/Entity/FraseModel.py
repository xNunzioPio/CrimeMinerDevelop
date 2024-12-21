from neomodel import RelationshipFrom,StructuredNode, RelationshipTo, StringProperty, IntegerProperty, DateProperty
from django.db import models

class FraseModel(StructuredNode):
    idFrase = IntegerProperty(primary_key=True, generated_value=True)
    
    ID = IntegerProperty(json_property="ID_conv")
    data_conversazione = StringProperty(json_property="data_conv")
    emozione = StringProperty(json_property="emozione")
    frase = StringProperty(json_property="frase")
    lista_interlocutori = StringProperty(json_property="lista_interlocutori")
    luogo = StringProperty(json_property="luogo")
    nome_interlocutore = StringProperty(json_property="nome")
    numero = IntegerProperty(json_property="numero")
    orario_conversazione = StringProperty(json_property="orario_conv")
    sentimento = StringProperty(json_property="sentimento")
    tipologia = StringProperty(json_property="type")