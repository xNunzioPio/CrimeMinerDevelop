import csv
from neo4j import GraphDatabase

class Neo4jManager:

    def __init__(self, uri, user, password):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        self.driver.close()

    def create_relationship(self, nodeId1, nodeId2, relationship_attributes):
        with self.driver.session() as session:
            session.execute_write(
                self._create_and_return_relationship, 
                nodeId1, 
                nodeId2, 
                relationship_attributes
            )

    @staticmethod
    def _create_and_return_relationship(tx, nodeId1, nodeId2, relationship_attributes):
        query = (
            "MATCH (a:Individuo {nodeId: $nodeId1}), (b:Individuo {nodeId: $nodeId2}) "
            "CREATE (a)-[r:HaConversato2 {"
            "tipologia: $tipologia, "
            "numero: $numero, "
            "luogo: $luogo, "
            "data_conversazione: $data_conversazione, "
            "orario_conversazione: $orario_conversazione, "
            "Lista_ID: $Lista_ID, "
            "interlocutori: $interlocutori, "
            "alias_interlocutori: $alias_interlocutori, "
            "conversazione: $conversazione, "
            "pagina_documento: $pagina_documento"
            "}]->(b) "
            "RETURN type(r)"
        )
        result = tx.run(query, nodeId1=nodeId1, nodeId2=nodeId2, **relationship_attributes)
        
        # Check if the result is None or has a valid type(r)
        record = result.single()
        if record:
            return record[0]
        else:
            print(f"Errore: non è stata trovata una corrispondenza per i nodi {nodeId1} e {nodeId2}, oppure la relazione non è stata creata.")
            return None

# Funzione per convertire una stringa di parole separate da virgole in una lista
def string_to_list(stringa):
    # Usa il metodo split per dividere la stringa sulla base della virgola
    lista_parole = stringa.split(',')
    return lista_parole


def read_csv_and_create_relationships(file_path, neo4j_manager):
    with open(file_path, mode='r', encoding='utf-8') as file:
        csv_reader = csv.reader(file,  delimiter=';', quotechar='"', quoting=csv.QUOTE_ALL, skipinitialspace=True)
        # RICORDARSI DI provare ad inserire >>> newline='' <<<  in csv.reader se non funziona
        count=0
        for row in csv_reader:
            if(count==0):
                count=count+1
                continue
            #if len(row) == 10:
            ids=row[5]
            listaID=string_to_list(ids)
            #print("il valore di len(ListaID) è: "+str(len(listaID)))
            #print("Tipologia: "+str(row[0]))
            #print("Numero: "+str(row[1]))
            #print("Luogo: "+str(row[2]))
            #print("data: "+str(row[3]))
            #print("orario: "+str(row[4]))
            #print("IDs: "+str(row[5]))
            #print("interlocutori: "+str(row[6]))
            #print("alias: "+str(row[7]))
            #print("conversazione: "+str(row[8]))
            #print("documento: "+str(row[9]))
            i=0
            j=0
            for i in range(len(listaID)):
                for j in range(len(listaID)):
                    nodeId1 = listaID[i]
                    if(nodeId1=="tba" or nodeId1=="tba1" or nodeId1=="tba2" or nodeId1=="tba3" or nodeId1=="tba4"):
                        continue
                    #print()
                    #print("Il valore di i è : "+str(i))
                    #print("Il valore di j è : "+str(j))

                    if(i==(len(listaID)-1) and j==(len(listaID)-1)):
                        #print("Il valore di i è: "+str(i)+"   Il valore di j è: "+str(j))
                        break
                        
                    if(i==j):
                        #print("i==j")
                        #print("Il valore di i è: "+str(i)+"   Il valore di j è: "+str(j))
                        continue
                    else:
                        #print("i != j")
                        #print("Il valore di i è: "+str(i)+"   Il valore di j è: "+str(j))
                        nodeId2 = listaID[j]

                    

                    relationship_attributes = {
                        "tipologia": row[0],
                        "numero": row[1],
                        "luogo": row[2],
                        "data_conversazione": row[3],
                        "orario_conversazione": row[4],
                        "Lista_ID": row[5],
                        "interlocutori": row[6],
                        "alias_interlocutori": row[7],
                        "conversazione": row[8],
                        "pagina_documento": row[9]
                    }
                    result = neo4j_manager.create_relationship(nodeId1, nodeId2, relationship_attributes)


# Esempio di utilizzo
if __name__ == "__main__":
    # Sostituisci questi valori con le tue credenziali e l'URI del tuo database
    uri = "bolt://localhost:7687"
    user = "neo4j"
    password = "neo44%*j"

    neo4j_manager = Neo4jManager(uri, user, password)

    # Specifica il percorso del file CSV
    # file_path = r"C:\Program Files\neo4j-community-5.12.0\import\file_csv_nuovo.csv"
    file_path = r"C:\Users\franc\OneDrive\Desktop\università\tirocinio interno\mycrime-main\file_csv_nuovo.csv"
    
    # Leggi il file CSV e crea le relazioni nel database Neo4j
    read_csv_and_create_relationships(file_path, neo4j_manager)

    neo4j_manager.close()
