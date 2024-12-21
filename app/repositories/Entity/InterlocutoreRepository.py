import datetime 
import csv
from collections import Counter
from app.Neo4jConnection import Neo4jDriver
from app.Models.Entity import InterlocutoreModel

class InterlocutoreRepository:
    """Verranno indicate tutte le funzioni/query per il grafo Interlocutore e il grafo Frase"""

    @staticmethod
    def full_graph():
        """
        Recupera tutte le informazioni di ogni singolo nodo Interlocutore.
        :return: lista di dizionari contenenti le informazioni di ogni nodo Interlocutore
        """
        try: 
            session = Neo4jDriver.get_session()
            cypher_query = "MATCH (i:Interlocutore) RETURN i"
            results = session.run(cypher_query).data()
            return results
        except Exception as e:
            #Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []
    
    @staticmethod
    def get_node_info_by_name(nome):
        """
        Recupera le informazioni di uno o più nodi Interlocutore attraverso il nome dell'interlocutore.
        :param nome: nome dell'interlocutore
        :return: lista di dizionari contenenti le informazioni dei nodi Interlocutore trovati, o lista vuota se non trovati
        """
        try:
            session = Neo4jDriver.get_session()
            nodes_query = "MATCH (i:Interlocutore) WHERE i.nome = $nome RETURN DISTINCT i.nodeId AS id, i.nome AS nome"
            nodes = session.run(nodes_query, {"nome": nome}).data()

        
            # Query per ottenere gli archi e i nodi collegati con il dato interlocutore
            relations_query = """
                MATCH (i1:Interlocutore)-[r:HaConversato]-(i2:Interlocutore)
                WHERE i1.nome = $nome 
                RETURN DISTINCT r.edgeId AS id, r.startNodeElementId AS source, r.endNodeElementId AS target, 
                                i2.nodeId AS connectedNodeId, i2.nome AS connectedNodeName
            """
            edges = session.run(relations_query, {"nome": nome}).data()

            # Creazione della struttura dati JSON compatibile con Cytoscape
            cytoscape_data = {
                "nodes": [{"data": {"id": node["id"], "nome": node["nome"], "size": 1}} for node in nodes],
                "edges": [{"data": {"id": edge["id"], "source": edge["source"], "target": edge["target"]}} for edge in edges]
            }

            # Aggiungere i nodi collegati (target nodes)
            connected_nodes = [{"data": {"id": edge["connectedNodeId"], "nome": edge["connectedNodeName"], "size": 1}} for edge in edges]
            
            # Evitare duplicati
            existing_node_ids = {node["data"]["id"] for node in cytoscape_data["nodes"]}
            for connected_node in connected_nodes:
                if connected_node["data"]["id"] not in existing_node_ids:
                    cytoscape_data["nodes"].append(connected_node)

            return cytoscape_data
        except Exception as e:
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []
        
    @staticmethod
    def get_node_info_by_id(nodeId):
        """
        Recupera le informazioni di uno o più nodi Interlocutore attraverso il nodeId dell'interlocutore.
        :param nodeId: nodeId dell'interlocutore
        :return: lista di dizionari contenenti le informazioni dei nodi Interlocutore trovati, o lista vuota se non trovati
        """
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "MATCH (i:Interlocutore) WHERE i.nodeId = $nodeId RETURN properties(i) AS i"
            results = session.run(cypher_query, {"nodeId": nodeId}).data()
            return results[0]['i']
        except Exception as e:
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []

    @staticmethod
    def find_by_emotion(emotion):
        """
        Recupera i nodi degli interlocutori filtrati per emozione_predominante.
        :param emotion: emozione predominante da filtrare
        :return: lista di dizionari contenenti le informazioni dei nodi Interlocutore trovati
        """
        try:
            session = Neo4jDriver.get_session()
            
             # Query per ottenere i nodi degli interlocutori con la data emozione
            nodes_query = """
                MATCH (i:Interlocutore)
                WHERE i.emozione_predominante = $emotion
                RETURN DISTINCT i.nodeId AS id, i.nome AS nome
            """
            nodes = session.run(nodes_query, {"emotion": emotion}).data()

            # Creazione della struttura dati JSON compatibile con Cytoscape
            cytoscape_data = {
                "nodes": [{"data": {"id": node["id"], "nome": node["nome"], "size": 1}} for node in nodes],
                #"edges": [{"data": edge} for edge in edges]
            }
            return cytoscape_data
        except Exception as e:
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []
        
    @staticmethod
    def find_conversations_by_emotion_and_name(nodeId):
        """
        Recupera le conversazioni in cui l'interlocutore specificato (tramite nodeId) ha provato una determinata emozione.
        Include informazioni dettagliate sui nodi Interlocutore e sugli archi HaConversato.
        :param nodeId: nodeId dell'interlocutore di cui si vogliono recuperare le conversazioni
        :return: dizionario contenente le proprietà degli archi e dei nodi Interlocutore collegati
        """
        try:
            session = Neo4jDriver.get_session()

            # Query per ottenere il nome e l'emozione predominante dell'interlocutore tramite nodeId
            interlocutore_query = """
            MATCH (i:Interlocutore)
            WHERE i.nodeId = $nodeId
            RETURN i.nome AS nome, i.emozione_predominante AS emozione
            """
            interlocutore_result = session.run(interlocutore_query, {"nodeId": nodeId}).single()

            if not interlocutore_result:
                print(f"Nessun interlocutore trovato con nodeId {nodeId}")
                return {"nodes": [], "edges": []}

            nome_interlocutore = interlocutore_result["nome"]
            emozione_interlocutore = interlocutore_result["emozione"]

            print(f"Informazioni trovate per nodeId {nodeId}: nome='{nome_interlocutore}', emozione='{emozione_interlocutore}'")

            # Query per trovare le frasi dove l'interlocutore ha provato l'emozione desiderata
            # Impostare la query per le frasi in base all'emozione predominante
            if emozione_interlocutore == 'neutrale':
                frasi_query = """
                MATCH (f:Frasi)
                WHERE f.nome_interlocutore = $nome AND f.sentimento = 'NEUTRAL'
                RETURN DISTINCT f.ID AS fraseID
                """
            else:
                frasi_query = """
                MATCH (f:Frasi)
                WHERE f.nome_interlocutore = $nome AND f.emozione = $emozione
                RETURN DISTINCT f.ID AS fraseID
                """
            frasi_results = session.run(frasi_query, nome=nome_interlocutore, emozione=emozione_interlocutore).data()
            frase_ids = [str(record["fraseID"]) for record in frasi_results]  # Converte gli ID in stringa

            print(f"Frasi trovate per {nome_interlocutore} con emozione {emozione_interlocutore}: {frase_ids}")
            
            if not frase_ids:
                print("Nessuna frase trovata che corrisponda ai criteri.")
                return {"nodes": [], "edges": []}

            # Query per ottenere gli archi (conversazioni) associate alle frasi trovate
            conversations_query = """
            MATCH (i1:Interlocutore)-[r:HaConversato]-(i2:Interlocutore)
            WHERE toString(r.ID) IN $frase_ids
            RETURN DISTINCT r.edgeId AS edgeId, r.startNodeElementId AS source, r.endNodeElementId AS target,
                            i2.nodeId AS connectedNodeId, i2.nome AS connectedNodeName
            """
            conversations = session.run(conversations_query, frase_ids=frase_ids).data()

            # Creazione della struttura dati JSON compatibile con Cytoscape
            cytoscape_data = {
                "nodes": [{"data": {"id": nodeId, "nome": nome_interlocutore, "size": 1}}],
                "edges": [{"data": {"id": str(edge["edgeId"]), "source": str(edge["source"]), "target": str(edge["target"])}} for edge in conversations]
            }

            # Aggiungere i nodi collegati (connected nodes)
            connected_nodes = [{"data": {"id": edge["connectedNodeId"], "nome": edge["connectedNodeName"], "size": 1}} for edge in conversations]

            # Evitare duplicati
            existing_node_ids = {node["data"]["id"] for node in cytoscape_data["nodes"]}
            for connected_node in connected_nodes:
                if connected_node["data"]["id"] not in existing_node_ids:
                    cytoscape_data["nodes"].append(connected_node)

            print(f"Risultato finale per nodeId {nodeId}: {cytoscape_data}")

            return cytoscape_data

        except Exception as e:
            print(f"Errore durante l'esecuzione della query Cypher per nodeId {nodeId}: {e}")
            return {"nodes": [], "edges": []}