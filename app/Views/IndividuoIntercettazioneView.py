from django.http import JsonResponse
from django.views import View
from app.repositories.Relationship.IndividuoIntercettazioneRepository import IndividuoIntercettazioneRepository
from app.repositories.Entity.IndividuoRepository import IndividuoRepository
from django_request_mapping import request_mapping
import json


@request_mapping("/individuoIntercettazione")    
class IndividuoIntercettazioneView(View): 

    #Funzione di init in cui vengono specificati alcuni parametri che vengono configurati all'inizio dell'app
    def __init__(self):     
        super().__init__()
        self.IndividuoIntercettazione_repository: IndividuoIntercettazioneRepository = IndividuoIntercettazioneRepository()


    #Fa riferimento alla getAll_nodes_and_edge() della repository IndividuoIntercettazioneRepository e 
    # restituisce tutti i nodi e gli archi del grafo, inclusi i nodi Individuo e gli archi HaChiamato
    #Args in input: none 
    #Restituisce result, che è una lista i nodi e gli archi in relazione
    @request_mapping("/findallnodes/", method="get")
    def find_all(self, request) -> JsonResponse:
        node_list = self.IndividuoIntercettazione_repository.getAll_nodes_and_edge()
        return JsonResponse(node_list)
    

    #Fa riferimento alla getGraph_IndividuiIntercettazioneTel_by_Dates(firstDate,secondDate) della repository IndividuoIntercettazioneRepository
    #Args in input:
    #       firstDate(str)-> data da cui parte l'intervallo
    #       secondDate(str)-> data che chiude l'intervallo
    #Restituisce result, che è una lista contenente l'id degli individui coinvolti nelle intercettazioni telefoniche
    @request_mapping("/getGraph_IndividuiIntercettazioneTel_by_Dates/<str:firstDate>,<str:secondDate>", method="get")
    def graph_IndividuiIntercettazioneTel_by_Dates(self, request,firstDate,secondDate) -> JsonResponse: 
        graph_list = self.IndividuoIntercettazione_repository.getGraph_IndividuiIntercettazioneTel_by_Dates(firstDate,secondDate)
        return JsonResponse({"result": graph_list})    



    #Fa riferimento alla getEdge_Info(edge_id) della repository IndividuoIntercettazioneRepository e 
    #restituisce l'arco del grafo con id "edge_id" della relazione HaChiamato
    #Args in input: edge_id che è l'id dell'arco
    #Restituisce result, che è una lista contenete le informazioni dell'arco con quel edge_id
    @request_mapping("/getinfobyedgeid/<str:edge_id>", method="get")
    def get_info_by_edge_id(self, request,edge_id) -> JsonResponse:
        edge = self.IndividuoIntercettazione_repository.getEdge_Info(edge_id)
        if edge:
            return JsonResponse({"result": edge})
        else:
            return JsonResponse({"error": "Nodes not found"}, status=404)
    
    #Fa riferimento alla Closeness() della repository IndividuoIntercettazioneRepository 
    #Restituisce una lista contenete l'insieme dei nodi e lo score di ciascuno calcolato attraverso l'algoritmo di Closeness dei grafi 
    @request_mapping("/Closeness/", method="get")
    def Closeness(self, request) -> JsonResponse:
        node_list = self.IndividuoIntercettazione_repository.Closeness()
        return JsonResponse({"result":node_list})
    
    #Fa riferimento alla Betweenness() della repository IndividuoIntercettazioneRepository 
    #Restituisce una lista contenete l'insieme dei nodi e lo score di ciascuno calcolato attraverso l'algoritmo di Betweenness dei grafi 
    @request_mapping("/Betweenness/", method="get")
    def Betweenness(self, request) -> JsonResponse:
        node_list = self.IndividuoIntercettazione_repository.Betweenness()
        return JsonResponse({"result":node_list})
    
    #Fa riferimento al PageRank() della repository IndividuoIntercettazioneRepository 
    #Restituisce una lista contenete l'insieme dei nodi e lo score di ciascuno calcolato attraverso l'algoritmo di PageRank dei grafi 
    @request_mapping("/PageRank/", method="get")
    def PageRank(self, request) -> JsonResponse:
        node_list = self.IndividuoIntercettazione_repository.PageRank()
        return JsonResponse({"result":node_list})
    
    #Fa riferimento al WeightedPageRank() della repository IndividuoIntercettazioneRepository 
    #Restituisce una lista contenete l'insieme dei nodi e lo score di ciascuno calcolato attraverso l'algoritmo di WeightedPageRank(sul parametro mesiTotali) dei grafi 
    @request_mapping("/WeightedPageRank/", method="get")
    def WeightedPageRank(self, request) -> JsonResponse:
        node_list = self.IndividuoIntercettazione_repository.WeightedPageRank()
        return JsonResponse({"result":node_list})
    
    #Fa riferimento al Degree() della repository IndividuoIntercettazioneRepository 
    #Restituisce una lista contenete l'insieme dei nodi e lo score di ciascuno calcolato attraverso l'algoritmo di Degree dei grafi 
    @request_mapping("/Degree/", method="get")
    def Degree(self, request) -> JsonResponse:
        node_list = self.IndividuoIntercettazione_repository.Degree()
        return JsonResponse({"result":node_list})
    
    #Fa riferimento all' InDegree() della repository IndividuoIntercettazioneRepository 
    #Restituisce una lista contenete l'insieme dei nodi e lo score di ciascuno calcolato attraverso l'algoritmo di InDegree dei grafi 
    @request_mapping("/InDegree/", method="get")
    def InDegree(self, request) -> JsonResponse:
        node_list = self.IndividuoIntercettazione_repository.InDegree()
        return JsonResponse({"result":node_list})
    
    #Fa riferimento all' OutDegree() della repository IndividuoIntercettazioneRepository 
    #Restituisce una lista contenete l'insieme dei nodi e lo score di ciascuno calcolato attraverso l'algoritmo di OutDegree dei grafi 
    @request_mapping("/OutDegree/", method="get")
    def OutDegree(self, request) -> JsonResponse:
        node_list = self.IndividuoIntercettazione_repository.OutDegree()
        return JsonResponse({"result":node_list})
    

    @request_mapping("/creaIntercettazione/", method="post")
    def create_EdgeIntercettazione(self,request) -> JsonResponse:  

        try:
            #il primo json.load lo converte da Unicode a Stringa e il secondo json.load converte la Stringa in un oggetto Json
            data =json.loads(json.loads(request.body))

            id1_individuo=None
            id2_individuo=None

            # Esegui la tua query e ottieni il risultato
            
            if  not "nodeId" in data["source"]:
                individuo_repository = IndividuoRepository()
                id1_individuo = individuo_repository.CreaIndividuo(data["source"])
            else:
                id1_individuo=data["source"].get("nodeId")


            if  not "nodeId" in data["target"]:
                individuo_repository = IndividuoRepository()
                id2_individuo = individuo_repository.CreaIndividuo(data["target"])
            else:
                id2_individuo=data["target"].get("nodeId")

            intercettazione_result = self.IndividuoIntercettazione_repository.CreaIntercettazione(data["call"],id1_individuo,id2_individuo)

            # Restituisci il risultato con status 100 se la query è andata bene
            return JsonResponse({"status": 100, "result": intercettazione_result})
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            # Se si verifica un errore, restituisci status 500 e il messaggio di errore
            return JsonResponse({"error_message": str(e)}, status=500)
        

    @request_mapping("/modificaIntInd/", method="post")
    def edit_Edge_HaChiamato(self,request) -> JsonResponse:  
        try:            
            
            data = json.loads(json.loads(request.body))
            print(data)

            if  not "nodeId" in data["source"]:
                individuo_repository = IndividuoRepository()
                id1_individuo = individuo_repository.CreaIndividuo(data["source"])
            else:
                id1_individuo=data["source"].get("nodeId")


            if  not "nodeId" in data["target"]:
                individuo_repository = IndividuoRepository()
                id2_individuo = individuo_repository.CreaIndividuo(data["target"])
            else:
                id2_individuo=data["target"].get("nodeId")
            
            intercettazione_result = self.IndividuoIntercettazione_repository.EditEdgeIndividuoIntercettazione(data["call"],id1_individuo,id2_individuo)
            
            return JsonResponse({"status": 100, "result": "tutto ok"})
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            # Se si verifica un errore, restituisci status 500 e il messaggio di errore
            return JsonResponse({"error_message": str(e)}, status=500)
        
    @request_mapping("/eliminaIntInd/",method="post")
    def delete_Edge(self,request) -> JsonResponse:
        try:
            data = json.loads(json.loads(request.body))
            print(data)
            
            self.IndividuoIntercettazione_repository.elemina_ArcoIndIntercettazione(data)
            
            return JsonResponse({"status": 100, "result": "Tutto apposto"})
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            # Se si verifica un errore, restituisci status 500 e il messaggio di errore
            return JsonResponse({"error_message": str(e)}, status=500)


        