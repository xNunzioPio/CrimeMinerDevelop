from neomodel import UniqueIdProperty, db
from app.Neo4jConnection import Neo4jDriver
from app.Models.Entity.IndividuoModel import Individuo
import json
from neomodel import db as neodb


# Questa classe fornisce metodi per recuperare informazioni sugli individui.
class IndividuoRepository:

    # Trova tutti gli individui.
    # Args: none
    # Returns:
    #     List[dict]: Una lista di risultati contenenti le informazioni su tutti gli individui.
    @staticmethod
    def find_all():
        try:
            
            session = Neo4jDriver.get_session()
            cypher_query = "MATCH (n:Individuo) RETURN n"
            results = session.run(cypher_query).data()
            return results
        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []

    #Trova gli individui che hanno effettuato una chiamata in un range di 2 date
    #Args: firstDate e secondDate (Stringhe per la data del tipo: AAAA-MM-GG)
    #Returns:
    #      List[dict]: Una lista di risultati contenente l'id del nodo individuo + la sua classe
    @staticmethod
    def get_IndividualNode_by_rangeOfDates(firstDate,secondDate):
        try:
            session=Neo4jDriver.get_session()
            cypher_query = "MATCH (n:Individuo)-[r:HaChiamato where r.data>=$firstDate and r.data<=$secondDate]-(m:Individuo) RETURN DISTINCT n.nodeId AS id UNION MATCH (n:Individuo)-[r:HaChiamato where r.data>=$firstDate and r.data<=$secondDate]-(m:Individuo) RETURN DISTINCT m.nodeId AS id"
            results=session.run(cypher_query, {"firstDate": firstDate ,"secondDate": secondDate}).data()
            return results

        except Exception as e:
            print("Errore durante l'esecuzione della query Cypher: ",e)
            return []
    
    #Trova gli individui che hanno partecipato ad una chiamata, in un range di 2 date
    #Args: firstDate e secondDate (Stringhe per la date del tipo: AAAA-MM-GG)
    #Returns:
    #      List[dict]: Una lista di risultati contenente l'id nodo individuo che chiama + id nodo individuo che riceve la chiamata + id dell'arco associato alla chiamata
    @staticmethod
    def get_Edges_by_rangeOfDates(firstDate,secondDate):
        try:
            session=Neo4jDriver.get_session()
            cypher_query = "MATCH (n:Individuo)-[r:HaChiamato where r.data>=$firstDate and r.data<=$secondDate]->(m:Individuo) RETURN r.sourceNodeId AS source, r.targetNodeId AS target, r.edgeId AS id"
            results=session.run(cypher_query, {"firstDate": firstDate ,"secondDate": secondDate}).data()
            return results

        except Exception as e:
            print("Errore durante l'esecuzione della query Cypher: ",e)
            return []



    # Restituisce tutti i nodeId, cognomi e nomi degli individui.
    # Args: none
    # Returns:
    #     List[dict]: Una lista di risultati contenenti le informazioni su tutti gli individui.
    @staticmethod
    def find_all_surname_name():
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "MATCH (n:Individuo) RETURN n.nodeId AS nodeId, n.cognome AS cognome, n.nome AS nome"
            results = session.run(cypher_query).data()
            return results
        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []

        
    # Ottiene le informazioni di un nodo dato il suo node_id.
    # Args:
    #     node_id (str): L'ID del nodo dell'individuo da cercare.
    # Returns:
    #     List[dict]: Una lista di risultati contenenti le informazioni sull'individuo trovato.
    @staticmethod
    def get_node_info_by_nodeId(node_id):
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "MATCH (n:Individuo) WHERE n.nodeId = $nodeId RETURN n"
            results = session.run(cypher_query, {"nodeId": node_id}).data()
            return results
        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []
        

    @staticmethod
    def CreaIndividuo(data):
        try:
             # Crea un'istanza di IndividuoModel
            idNodo=IndividuoRepository.get_max_node_id()

            individuo_model = Individuo(
            nodeId=idNodo,
            entityType="Individuo",
            name=idNodo,
            mesiCondanna=0,
            mesiImputati=0,
            mesiTotali=0,
            lng = 0,
            lat = 0,
            community = 0,
            isIndagato = False,
            provinciaResidenza = data.get("provinciaResidenza"),
            luogoNascita = data.get("luogoNascita"),
            dataNascita = data.get("dataNascita"),
            indirizzoResidenza = data.get("indirizzoResidenza"),
            cognome = data.get("cognome"),
            nome = data.get("nome"),
            capResidenza = data.get("capResidenza"),
            cittaResidenza = data.get("cittaResidenza"),
            nazioneResidenza = data.get("nazioneResidenza"),
            )

            individuo_model.save()

            return individuo_model.nodeId
        
        except Exception as e:
            # Gestione degli altri errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante il salvataggio dell'individuo:", e)
            return []
        
    
    
    # Ottiene tutti i nodeId presenti nel database e ritorna il massimo degli id
    # Args:
    #   none
    # Returns:
    #   string: il massimo nodeId presente
    @staticmethod
    def get_max_node_id():
            max_node_id = None
            max_number = -1  # Un valore iniziale molto basso per confronto
            try:
                session = Neo4jDriver.get_session()
                result = session.run("MATCH (n:Individuo) RETURN n.nodeId AS nodeId")
                
                for record in result:
                    node_id = record["nodeId"]
                    # Estrai la parte numerica dalla stringa nodeId
                    numeric_part = int(node_id[1:])
                    
                    # Confronto con il massimo attuale
                    if numeric_part > max_number:
                        max_number = numeric_part
                        max_node_id = node_id
                
                result_numeric=max_number+1
                result_node_id=f"I{result_numeric}"

                return result_node_id
            except Exception as e:
                # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
                print("Errore durante l'esecuzione della query Cypher:", e)
                return None  # Restituisci None anziché una lista vuota in caso di errore
            

    @staticmethod
    def  EditIndividuo(data):
            try:                
                nodo= Individuo.nodes.get(nodeId=data.get("nodeId"))
                
                nodo.cognome=data.get("surname")
                nodo.nome=data.get("name")
                nodo.nazioneResidenza=data.get("nation")
                nodo.cittaResidenza=data.get("city")
                nodo.provinciaResidenza=data.get("province")
                nodo.indirizzoResidenza=data.get("address")
                nodo.capResidenza=data.get("cap")
                
                if data.get("date")!="":
                    nodo.dataNascita=data.get("date")                

                nodo.save()
                
                return nodo
            except Exception as e:
                # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
                print("Errore durante l'esecuzione della query Cypher:", e)
                return None  # Restituisci None anziché una lista vuota in caso di errore
            
    @staticmethod
    def  DeleteIndividuo(data):
            nodo= Individuo.nodes.get(nodeId=data.get("nodeId"))
            try:
                sourceNodeId = data.get("nodeId") 
                targetNodeId = data.get("nodeId")
                #prendersi tutti gli edgeId e cancellarli, poi eliminare il nodo
                session = Neo4jDriver.get_session()
                query = ("MATCH p=()-[r]->() where r.sourceNodeId=$sourceNodeId or r.targetNodeId=$targetNodeId return r.edgeId")
                results = session.run(query, {"sourceNodeId":sourceNodeId,"targetNodeId": targetNodeId}).data()
                
                for result in results:
                    edgeId = result.get("r.edgeId")
                    query_delete = (
                        "MATCH ()-[r]->() WHERE r.edgeId = $edgeId DELETE r"
                    )
                    session.run(query_delete, {"edgeId": edgeId})

                nodo.delete()
                    
                return "tutto eliminato"
            except Exception as e:
                # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
                print("Errore durante l'esecuzione della query Cypher:", e)
                return None  # Restituisci None anziché una lista vuota in caso di errore
   




#################################################### NON UTILIZZATE (POSSIBILMENTE UTILI IN FUTURO) ##############################################################

"""

    # Trova un individuo dato il suo node_id.
    # Args:
    #     node_id (str): L'ID del nodo dell'individuo da cercare.
    # Returns:
    #     IndividuoModel: Il modello dell'individuo trovato.
    @staticmethod
    def find_by_node_id(node_id):
        return IndividuoModel.nodes.get(nodeId=node_id)


    # Ottiene le informazioni di un nodo dato il suo node_id.
    # Args:
    #     node_id (str): L'ID del nodo dell'individuo da cercare.
    # Returns:
    #     List[dict]: Una lista di risultati contenenti le informazioni sull'individuo trovato.
    @staticmethod
    def get_node_info(node_id):
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "MATCH (n) WHERE id(n) = $Id RETURN n"
            results = session.run(cypher_query, {"Id": node_id}).data()
            return results
        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []

    # Trova un individuo dato il suo nome.
    # Args:
    #     nome (str): Il nome dell'individuo da cercare.
    # Returns:
    #     List[dict]: Una lista di risultati contenenti le informazioni sull'individuo trovato.
    @staticmethod
    def find_by_nome(nome):
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "MATCH (n:Individuo{nome:'" + nome + "'}) RETURN n"
            results = session.run(cypher_query).data()
            return results
        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []

    # Ottiene l'ID di un individuo dato il nome e il cognome.
    # Args:
    #     nome (str): Il nome dell'individuo.
    #     cognome (str): Il cognome dell'individuo.
    # Returns:
    #     List[dict]: Una lista di risultati contenenti l'ID dell'individuo.
    @staticmethod
    def get_id_by_nome_cognome(nome, cognome):
        session = Neo4jDriver.get_session()
        cypher_query = (
            "MATCH (n:Individuo) "
            "WHERE n.nome = $nome AND n.cognome = $cognome "
            "RETURN DISTINCT substring(n.nodeId, 1) AS id"
        )
        #result, _ = db.cypher_query(cypher_query, {"nome": nome, "cognome": cognome})  #realizzazione diversa dalle altre query, da errori di autenticazione
        result=session.run(cypher_query,{"nome": nome, "cognome": cognome}).data()
        #return [row[0] for row in result]  ##realizzazione diversa dalle altre query, da errori di autenticazione
        return result

#FUNZIONI NON TESTATE/UTILIZZATE AL MOMENTO
##############################################################################################################################
    # Trova gli individui con un dato cognome.
    # Args:
    #     cognome (str): Il cognome degli individui da cercare.
    # Returns:
    #     list: Una lista di modelli di individui che corrispondono al cognome fornito.
    @staticmethod
    def find_by_cognome(cognome):
        return IndividuoModel.nodes.filter(cognome=cognome)

    # Trova gli individui con un dato nome e cognome.
    # Args:
    #     nome (str): Il nome degli individui da cercare.
    #     cognome (str): Il cognome degli individui da cercare.
    # Returns:
    #     list: Una lista di modelli di individui che corrispondono al nome e cognome forniti.
    @staticmethod
    def find_by_nome_and_cognome(nome, cognome):
        return IndividuoModel.nodes.filter(name=nome, cognome=cognome)

    # Trova tutti gli individui di un certo tipo di entità.
    # Args:
    #     entity_type (str): Il tipo di entità degli individui da cercare.
    # Returns:
    #     list: Una lista di modelli di individui che corrispondono al tipo di entità fornito.
    @staticmethod
    def find_all_by_entity_type(entity_type):
        return IndividuoModel.nodes.filter(entityType=entity_type)

    # Ottiene un individuo dato il suo nome.
    # Args:
    #     nome (str): Il nome dell'individuo da cercare.
    # Returns:
    #     IndividuoModel: Il modello dell'individuo trovato.
    @staticmethod
    def get_individuo_by_name(nome):
        return IndividuoModel.nodes.get(name=nome)

    # Ottiene l'ID e il nome di tutti gli individui.
    # Returns:
    #     list: Una lista di dizionari contenenti l'ID e il nome di tutti gli individui.
    @staticmethod
    def get_id_and_nomi():
        cypher_query = (
            "MATCH (n:Individuo) "
            "RETURN n.nodeId AS id, n.nome + ' ' + n.cognome AS nome"
        )
        result, _ = db.cypher_query(cypher_query)
        return [{"id": row[0], "nome": row[1]} for row in result]

    # Ottiene il nome degli individui il cui nome o cognome inizia con un dato prefisso.
    # Args:
    #     name (str): Il prefisso del nome o cognome con cui inizia la ricerca.
    # Returns:
    #     list: Una lista di dizionari contenenti il nome e il cognome degli individui che soddisfano il criterio.
    @staticmethod
    def get_nome_individuo_start_with(name):
        cypher_query = (
            "MATCH (n:Individuo)-[:HaChiamato]->(m:Individuo) "
            "WHERE n.nome =~ $name OR n.cognome =~ $name "
            "RETURN DISTINCT n.nome AS nome, n.cognome AS cogn"
        )
        result, _ = db.cypher_query(cypher_query, {"name": f"{name}.*"})
        return [{"nome": row[0], "cognome": row[1]} for row in result]

    # Ottiene il nome degli individui il cui nome o cognome contiene una data stringa.
    # Args:
    #     name (str): La stringa con cui cercare il nome o cognome degli individui.
    # Returns:
    #     list: Una lista di dizionari contenenti il nome e il cognome degli individui che soddisfano il criterio.
    @staticmethod
    def get_all_nomi_individuo(name):
        cypher_query = (
            "MATCH (n:Individuo) "
            "WHERE n.nome =~ $name OR n.cognome =~ $name "
            "RETURN DISTINCT n.nome AS nome, n.cognome AS cogn"
        )
        result, _ = db.cypher_query(cypher_query, {"name": f"{name}.*"})
        return [{"nome": row[0], "cognome": row[1]} for row in result]

    # Ottiene il nome degli individui intercettati.
    # Returns:
    #     list: Una lista di nomi degli individui intercettati.
    @staticmethod
    def get_nomi_individui_intercettati():
        cypher_query = (
            "MATCH (n:Individuo)-[:HaChiamato]->(m:Individuo) "
            "RETURN DISTINCT n.nome + ' ' + n.cognome AS nome"
        )
        result, _ = db.cypher_query(cypher_query)
        return [row[0] for row in result]

    # Ottiene la misura di centralità di vicinanza degli individui.
    # Returns:
    #     list: Una lista di dizionari contenenti il nome, la data di nascita e il punteggio di centralità di vicinanza degli individui.
    @staticmethod
    def get_closeness():
        cypher_query = (
            "MATCH (n:Individuo) "
            "WITH collect(n) AS nodes "
            "CALL apoc.algo.closeness(['HaChiamato'], nodes, 'INCOMING') YIELD node, score "
            "RETURN node.name AS Name, node.born AS Born, score AS score "
            "ORDER BY score DESC"
        )
        result, _ = db.cypher_query(cypher_query)
        return [dict(zip(row.columns, row)) for row in result]

    # Ottiene il diametro del grafo degli individui.
    # Returns:
    #     int: Il diametro del grafo.
    @staticmethod
    def get_diameter():
        cypher_query = (
            "MATCH (n:Individuo), (m:Individuo) "
            "WHERE n <> m "
            "WITH n, m "
            "MATCH p = shortestPath((n)-[*]->(m)) "
            "RETURN length(p) AS diameter "
            "ORDER BY diameter DESC "
            "LIMIT 1"
        )
        result, _ = db.cypher_query(cypher_query)
        return result[0][0]

    # Ottiene un nodo dato il suo ID.
    # Args:
    #     id (int): L'ID del nodo da cercare.
    # Returns:
    #     list: Una lista di dizionari contenenti il nodo trovato.
    @staticmethod
    def get_node(id):
        cypher_query = (
            "MATCH (s) "
            "WHERE ID(s) = $id "
            "RETURN s"
        )
        result, _ = db.cypher_query(cypher_query, {"id": id})
        return [{"s": row[0]} for row in result]

    # Esegue una proiezione personalizzata tra due tipi di entità.
    # Args:
    #     t1 (str): Il nome del primo tipo di entità.
    #     t2 (str): Il nome del secondo tipo di entità.
    # Returns:
    #     list: Una lista di risultati della proiezione personalizzata.
    @staticmethod
    def get_custom_proj(t1, t2):
        cypher_query = (
            "WITH $t1 AS label1, $t2 AS label2 "
            "CALL apoc.cypher.run("
            "\"MATCH (p1:\" + label1 + \")-[:ACTED_IN]->(m:\" + label2 + \")<-[:ACTED_IN]-(p2:\" + label1 + \") "
            "RETURN p1, p2\", null) YIELD value "
            "RETURN value"
        )
        result, _ = db.cypher_query(cypher_query, {"t1": t1, "t2": t2})
        return [dict(zip(row.columns, row)) for row in result]

        
"""