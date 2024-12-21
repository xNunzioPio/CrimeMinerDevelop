import datetime
import traceback
from django.http import JsonResponse
from django.views import View
from django_request_mapping import request_mapping
from app.repositories.Entity.InterlocutoreRepository import InterlocutoreRepository  
from app.repositories.Relationship.InterlocutoreInfoRelazioneRepository import InterlocutoreInfoRelazioneRepository

@request_mapping("/interlocutoreCrimes")
class InterlocutoreCrimesView(View):

    def __init__(self):
        super().__init__()
        self.interlocutore_repository = InterlocutoreRepository()
        self.interlocutore_info_relazione_repository = InterlocutoreInfoRelazioneRepository()

    @request_mapping("/getFullGraph/", method="get")
    def get_full_graph(self, request) -> JsonResponse:
        try:
            graph_data = self.interlocutore_repository.full_graph()
            return JsonResponse({"result": graph_data})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
        
    @request_mapping("/getNodeInfoByName/<str:nome>", method="get")
    def get_node_info_by_name(self, request, nome) -> JsonResponse:
        try:
            nome_info = self.interlocutore_repository.get_node_info_by_name(nome)
            if nome_info:
                return JsonResponse({"result": nome_info})
            else:
                return JsonResponse({"error": "Name not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
        
    @request_mapping("/getNodeInfoById/<int:nodeId>", method="get")
    def get_node_info_by_id(self, request, nodeId) -> JsonResponse:
        try:
            id_info = self.interlocutore_repository.get_node_info_by_id(nodeId)
            if id_info:
                return JsonResponse({"result": id_info})
            else:
                return JsonResponse({"error": "ID not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    @request_mapping("/findInterlocutorByEmotion/<str:emotion>", method="get")
    def get_predominant_emotion(self, request, emotion) -> JsonResponse:
        try:
            predominant_emotion = self.interlocutore_repository.find_by_emotion(emotion)
            return JsonResponse({"result": predominant_emotion})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    @request_mapping("/findConversationsByEmotionAndName/<int:nodeId>", method="get")
    def find_conversations_by_emotion_and_name(self, request, nodeId) -> JsonResponse:
        try:
            emotion_name = self.interlocutore_repository.find_conversations_by_emotion_and_name(nodeId)
            return JsonResponse({"result": emotion_name})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
        
    @request_mapping("/getEdgeInfo/<int:edgeId>", method="get")
    def get_edge_info(self, request, edgeId) -> JsonResponse:
        try:
            edge_info = self.interlocutore_info_relazione_repository.get_edge_info(edgeId)
            if edge_info:
                return JsonResponse({"result": edge_info})
            else:
                return JsonResponse({"error": "ID not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    
    @request_mapping("/getAllInterlocutoriAndRelations/", method="get")
    def get_all_interlocutori_and_relations(self, request) -> JsonResponse:
        try:
            data = self.interlocutore_info_relazione_repository.get_all_interlocutori_and_relations()
            return JsonResponse(data, safe=False)
        except Exception as e:
            return JsonResponse({"message": str(e)}, status=500)
    
    @request_mapping("/getRelationsByTimeInterval/<str:start_date>/<str:end_date>", method="get")
    def get_relations_by_time_interval(self, request, **kwargs) -> JsonResponse:
        try:
            start_date = kwargs.get('start_date')
            end_date = kwargs.get('end_date')

            if not start_date or not end_date:
                raise ValueError("Le date di inizio e fine non possono essere vuote")

            results = self.interlocutore_info_relazione_repository.get_relations_by_time_interval(start_date, end_date)
            return JsonResponse({"result": results})
        except Exception as e:
            print(f"Errore durante l'elaborazione della richiesta: {e}")
            traceback.print_exc()  # Aggiungi questa riga per stampare lo stack trace completo
            return JsonResponse({"message": str(e)}, status=500)
    
    @request_mapping("/Closeness/", method="get")
    def Closeness(self, request) -> JsonResponse:
        try:
            results = self.interlocutore_info_relazione_repository.Closeness()
            return JsonResponse({"result": results})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    @request_mapping("/Betweenness/", method="get")
    def Betweenness(self, request) -> JsonResponse:
        try:
            results = self.interlocutore_info_relazione_repository.Betweenness()
            return JsonResponse({"result": results})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    @request_mapping("/PageRank/", method="get")
    def PageRank(self, request) -> JsonResponse:
        try:
            results = self.interlocutore_info_relazione_repository.PageRank()
            return JsonResponse({"result": results})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    @request_mapping("/WeightedPageRank/", method="get")
    def WeightedPageRank(self, request) -> JsonResponse:
        try:
            results = self.interlocutore_info_relazione_repository.WeightedPageRank()
            return JsonResponse({"result": results})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    @request_mapping("/Degree/", method="get")
    def Degree(self, request) -> JsonResponse:
        try:
            results = self.interlocutore_info_relazione_repository.Degree()
            return JsonResponse({"result": results})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    @request_mapping("/InDegree/", method="get")
    def InDegree(self, request) -> JsonResponse:
        try:
            results = self.interlocutore_info_relazione_repository.InDegree()
            return JsonResponse({"result": results})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    @request_mapping("/OutDegree/", method="get")
    def OutDegree(self, request) -> JsonResponse:
        try:
            results = self.interlocutore_info_relazione_repository.OutDegree()
            return JsonResponse({"result": results})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

