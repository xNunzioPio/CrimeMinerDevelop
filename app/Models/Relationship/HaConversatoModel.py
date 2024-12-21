from neomodel import StructuredRel,Relationship, RelationshipTo, RelationshipFrom, StringProperty, IntegerProperty, DateProperty
from django.db import models

class HaConversatoModel(StructuredRel):

    idHaConversato = IntegerProperty(primary_key=True, generated_value=True)
    edgeId = IntegerProperty(primary_key=True, json_property="edgeId")
    ID = IntegerProperty(json_property="id_conv")
    conversazione = StringProperty(json_property="conversazione")
    data_conversazione = StringProperty(json_property="data_conv")
    interlocutori = StringProperty(json_property="interlocutori")

    luogo = StringProperty(json_property="luogo")
    numero = IntegerProperty(json_property="numero_conv")
    orario_conversazione = StringProperty(json_property="orario_conv")
    tipologia = StringProperty(json_property="tipologia")

    startNodeElementId = IntegerProperty(json_property="startNodeElementId")
    endNodeElementId = IntegerProperty(json_property="endNodeElementId")