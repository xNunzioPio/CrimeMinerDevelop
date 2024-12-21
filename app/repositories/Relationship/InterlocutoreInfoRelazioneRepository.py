import datetime
from app.Models.Relationship.HaConversatoModel import HaConversatoModel
from app.Models.Entity.InterlocutoreModel import InterlocutoreModel
from app.repositories.Entity.InterlocutoreRepository import InterlocutoreRepository
from app.Neo4jConnection import Neo4jDriver


class InterlocutoreInfoRelazioneRepository:
    
    @staticmethod
    def get_edge_info(edgeId):
        """
        Recupera le informazioni dell'arco identificato con edgeId.
        :param edgeId: l'ID dell'arco
        :return: dizionario contenente le informazioni dell'arco
        """
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "MATCH ()-[r:HaConversato]->() WHERE r.edgeId = $edgeId RETURN DISTINCT properties(r) AS r"
            result = session.run(cypher_query, {"edgeId": edgeId}).data()
            return result
        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return None
        
    @staticmethod
    def get_all_interlocutori_and_relations():
        """
        Recupera tutti i nodi Interlocutore e gli archi HaConversato in un formato compatibile con Cytoscape.
        :return: dizionario con nodi e archi compatibili con Cytoscape
        """
        try:
            session = Neo4jDriver.get_session()
            #Query per ottenere i nodi
            nodes_query = "MATCH (i:Interlocutore) WHERE (i)-[:HaConversato]->() OR (i)<-[:HaConversato]-() RETURN DISTINCT i.nome AS nome, i.nodeId AS id"
            nodes = session.run(nodes_query).data()

            #Query per ottenere gli archi
            edges_query = "MATCH (i:Interlocutore)-[r:HaConversato]->(i1:Interlocutore) RETURN r.startNodeElementId AS source, r.endNodeElementId AS target, r.edgeId as id"
            edges = session.run(edges_query).data()

            #Creazione della struttura dati JSON compatibile con Cytoscape
            cytoscape_data = {
                "nodes": [{"data": {"id": node["id"], "nome": node["nome"], "size": 1}} for node in nodes],
                "edges": [{"data": edge} for edge in edges]
            }
            return cytoscape_data
        except Exception as e:
             # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
                print("Errore durante l'esecuzione della query Cypher:", e)
                return []  # o solleva un'eccezione   

    @staticmethod
    def get_relations_by_time_interval(start_date, end_date):
        """
        Recupera le relazioni HaConversato filtrate per un intervallo di tempo.
        :param start_date: data di inizio del filtro
        :param end_date: data di fine del filtro
        :return: lista di dizionari contenenti le informazioni delle relazioni HaConversato trovate
        """
        try: 
            session = Neo4jDriver.get_session()
            query = """
                MATCH (i:Interlocutore)-[r:HaConversato]->(i1:Interlocutore)
                WHERE date(r.data_conversazione) >= date($start_date) AND date(r.data_conversazione) <= date($end_date)
                RETURN DISTINCT r.edgeId AS id, i.nodeId AS source, i1.nodeId AS target
            """
            edges = session.run(query, {"start_date": start_date, "end_date": end_date}).data()

            if not edges:
                print("Nessun arco trovato per l'intervallo di date specificato.")
                return {"nodes": [], "edges": []}

            # Estrai gli id dei nodi dagli archi
            nodeId = set()
            for edge in edges:
                nodeId.add(edge['source'])
                nodeId.add(edge['target'])

            # Query per ottenere le informazioni sui nodi basati sugli id
            nodes_query = """
                MATCH (i:Interlocutore)
                WHERE i.nodeId IN $nodeId
                RETURN i.nodeId AS id, i.nome AS nome
            """
            nodes = session.run(nodes_query, {"nodeId": list(nodeId)}).data()

            if not nodes:
                print("Nessun nodo trovato per gli id specificati.")
                return {"nodes": [], "edges": []}

            # Creazione della struttura dati JSON compatibile con Cytoscape
            cytoscape_data = {
                "nodes": [{"data": {"id": node["id"], "nome": node["nome"], "size": 1}} for node in nodes],
                "edges": [{"data": edge} for edge in edges]
            }
            return cytoscape_data
        except Exception as e:
            print("Errore durante l'esecuzione della query Cypher:", e)
            return {"error": str(e)}

        
#Metrics
#Prima creare il grafo in questo modo CALL gds.graph.project('ProfiloCriminale', 'Interlocutore', 'HaConversato')
#e poi 
#Closeness query
#CALL gds.closeness.stream('ProfiloCriminale')
#YIELD nodeId, score
#WITH gds.util.asNode(nodeId) AS node, score
#RETURN node.nodeId AS id, score AS score
#ORDER BY score DESC;
#Inserire nel file conf di neo4j dbms.security.procedures.unrestricted=apoc.*, gds.*


    #Calcola la closeness dei vari nodi attraverso l'utilizzo del plugin graph data science di neo4j
    @staticmethod
    def Closeness():
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "CALL gds.closeness.stream('ProfiloCriminale') YIELD nodeId, score WITH gds.util.asNode(nodeId) AS node, score WHERE (node)-[:HaConversato]->() OR (node)<-[:HaConversato]-() RETURN DISTINCT node.nodeId AS id, score AS size"
            results = session.run(cypher_query).data()
            return results

        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []  # o solleva un'eccezione
        
    #Calcola la Betweenness dei vari nodi attraverso l'utilizzo del plugin graph data science di neo4j
    @staticmethod
    def Betweenness():
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "CALL gds.betweenness.stream('ProfiloCriminale') YIELD nodeId, score WITH gds.util.asNode(nodeId) AS node, score WHERE (node)-[:HaConversato]->() OR (node)<-[:HaConversato]-() RETURN node.nodeId AS id, score AS size"
            results = session.run(cypher_query).data()
            return results

        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []  # o solleva un'eccezione
    
    #Calcola il Page Rank dei vari nodi attraverso l'utilizzo del plugin graph data science di neo4j
    @staticmethod
    def PageRank():
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "CALL gds.pageRank.stream('ProfiloCriminale', { maxIterations: 10, relationshipTypes: ['HaConversato'] }) YIELD nodeId, score WITH gds.util.asNode(nodeId) AS node, score WHERE (node)-[:HaConversato]->() OR (node)<-[:HaConversato]-() RETURN node.nodeId AS id, score AS size"
            results = session.run(cypher_query).data()
            return results

        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []  # o solleva un'eccezione
        
    #Calcola il Weighted Page Rank dei vari nodi attraverso l'utilizzo del plugin graph data science di neo4j
    @staticmethod
    def WeightedPageRank():
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "CALL gds.pageRank.stream('ProfiloCriminale', {maxIterations: 10, dampingFactor: 0.85, relationshipWeightProperty: 'mesiTotali'}) YIELD nodeId, score WITH gds.util.asNode(nodeId) AS node, score WHERE (node)-[:HaConversato]->() OR (node)<-[:HaConversato]-() RETURN node.nodeId AS id, score AS size"
            results = session.run(cypher_query).data()
            return results

        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []  # o solleva un'eccezione
        
    #Calcola il Degree dei vari nodi attraverso l'utilizzo del plugin graph data science di neo4j
    @staticmethod
    def Degree():
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "CALL gds.degree.stream('ProfiloCriminale', {orientation: 'UNDIRECTED'}) YIELD nodeId, score WITH gds.util.asNode(nodeId) AS node, score WHERE (node)-[:HaConversato]->() OR (node)<-[:HaConversato]-() RETURN node.nodeId AS id, score AS size"
            results = session.run(cypher_query).data()
            return results

        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []  # o solleva un'eccezione
        
    #Calcola In Degree dei vari nodi attraverso l'utilizzo del plugin graph data science di neo4j
    @staticmethod
    def InDegree():
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "CALL gds.degree.stream('ProfiloCriminale', {orientation: 'REVERSE'}) YIELD nodeId, score WITH gds.util.asNode(nodeId) AS node, score WHERE (node)-[:HaConversato]->() OR (node)<-[:HaConversato]-() RETURN node.nodeId AS id, score AS size"
            results = session.run(cypher_query).data()
            return results

        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []  # o solleva un'eccezione
    
    #Calcola In Degree dei vari nodi attraverso l'utilizzo del plugin graph data science di neo4j
    @staticmethod
    def OutDegree():
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "CALL gds.degree.stream('ProfiloCriminale', {orientation: 'NATURAL'}) YIELD nodeId, score WITH gds.util.asNode(nodeId) AS node, score WHERE (node)-[:HaConversato]->() OR (node)<-[:HaConversato]-() RETURN node.nodeId AS id, score AS size"
            results = session.run(cypher_query).data()
            return results

        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []  # o solleva un'eccezione
        
