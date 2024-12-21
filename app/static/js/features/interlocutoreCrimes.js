//Variabile che conterrà il grafo che andremo a realizzare
let cyInterlocutor;

//Variabili che ci consentono di tener traccia del nodo o dell'arco da far tornare come prima
let cyNodeTouchedInterlocutor = "";
let cyEdgeTouchedInterlocutor = "";

//Variabile che ci consente di tener traccia dell'id dell'utente quando si anonimizza
let cyNodeDataInterlocutor  = "";

//Funzione che permette di caricare script javascript al caricamento della pagina
window.onload = function () {
  document.querySelector(".navbarText").innerHTML = "Profilo Criminale";

  //Funzione che fa partire il caricamento
  loadPage(1500);
  requestAllNodesInterlocutor();

  //Comando che fa aprire all'avvio della pagina l'accordione delle proprietà
  document.querySelector("#item-properties").click();

  //Controllo se devo anonimizzare i dati
  if(!document.cookie.includes("anonymization"))
      document.cookie = "anonymization=no";
    else
      if(getCookie("anonymization") == "yes")
        document.querySelector("#CheckAnonymization").checked = true;
};

//Funzione che effettua la richiesta al backend per caricare il grafo iniziale
function requestAllNodesInterlocutor() {
  fetch("/CrimeMiner/interlocutoreCrimes/getAllInterlocutoriAndRelations/", {
    method: "GET"
  })
  .then(response => {
    if (response.ok) {
      return response.text();
    } else {
      throw new Error('Errore nella richiesta.');
    }
  })
  .then(data => {
    data = JSON.parse(data);
    createGraphInterlocutor(data);
    fillPropertyAccordionInterlocutor(data);
  })
  .catch(error => {
    console.error(error);
    showError("Errore nel caricamento dei dati.");
  });
}

//Funzione che effettua la richiesta al backend per le metriche
function requestSizeNodesInterlocutorCrimes(){
  let metric;

  if(document.querySelector(".selectMetrics").value == "Default")
    metric = "getAllInterlocutoriAndRelations";
  else
    metric = document.querySelector(".selectMetrics").value;

  fetch("/CrimeMiner/interlocutoreCrimes/"+ metric +"/", {
    method: "GET"
  })
  .then(response => {
    if (response.ok) {
      return response.text();
    } else {
      throw new Error('Errore nella richiesta.');
    }
  })
  .then(data => {
    data = JSON.parse(data);
    changeSizeNodesInterlocutorCrimes(data);
  })
  .catch(error => {
    console.error(error);
    showError("Errore nel caricamento delle metriche.");
  });
}

//Funzione che effettua la richiesta al backend per i dettagli di un singolo nodo
function requestDetailsOfNodeInterlocutor(id){
  fetch("/CrimeMiner/interlocutoreCrimes/getNodeInfoById/" + id, {
    method: "GET"
  })
  .then(response => {
    if (response.ok) {
      return response.text();
    } else {
      throw new Error('Errore nella richiesta.');
    }
  })
  .then(data => {
    data = JSON.parse(data);
    console.log('Data ricevuta:', data);  // Aggiunto per il debug
      showDetailsOfNodeInterlocutorCrimes(data.result);
  })
  .catch(error => {
    console.error(error);
    showError("Errore nel caricamento dei dettagli del nodo.");
  });
}

//Funzione che effettua la richiesta al backend per i dettagli di un singolo arco
function requestDetailsOfEdgeInterlocutorCrimes(id){
  fetch("/CrimeMiner/interlocutoreCrimes/getEdgeInfo/" + id, {
    method: "GET"
  })
  .then(response => {
    if (response.ok) {
      return response.text();
    } else {
      throw new Error('Errore nella richiesta.');
    }
  })
  .then(data => {
    data = JSON.parse(data);
    console.log('Data ricevuta:', data);  // Aggiunto per il debug
    showDetailsOfEdgeIndividualCrimes(data.result[0].r)
  })
  .catch(error => {
    console.error(error);
    showError("Errore nel caricamento dei dettagli dell'arco.");
  });
}

function requestNodesByEmotion(emotion) {
  console.log('Richiesta nodi per emozione:', emotion); // Aggiunto log per il debug

  fetch("/CrimeMiner/interlocutoreCrimes/findInterlocutorByEmotion/" + emotion, {
    method: "GET"
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Errore nella richiesta.');
    }
  })
  .then(data => {
    console.log('Dati ricevuti:', data);
    createGraphEmotion(data.result);
  })
  .catch(error => {
    console.error(error);
    showError("Errore nel caricamento dei nodi per emozione.");
  });
}

// Funzione per gestire il filtro per emozione
function filterGraphByEmotion(event) {
  event.preventDefault(); // Previeni il comportamento di default del form
  const graphContainer = document.getElementById('graph-container');
  const noCombinationMessage = document.getElementById('no-combination-message');

  const selectedEmotionInput = document.querySelector('input[name="emotion"]:checked').value;
  console.log('Emozione selezionata:', selectedEmotionInput); // Stampa l'emozione selezionata per il debug
  requestNodesByEmotion(selectedEmotionInput);
  noCombinationMessage.style.display = 'none'; // Nasconde il messaggio di nessuna combinazione trovata
  graphContainer.style.display = 'block'; // Mostra il contenitore del grafico
}

// Aggiungi un ascoltatore di eventi al form per gestire il submit
document.addEventListener('DOMContentLoaded', function() {
  const filterForm = document.querySelector('#filter-form');
  filterForm.addEventListener('submit', function(event) {
    filterGraphByEmotion(event); // Passa l'evento del form alla funzione di filtro
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const deselectButton = document.getElementById('deselect-radio');

  deselectButton.addEventListener('click', function () {
      const radios = document.querySelectorAll('input[name="emotion"]');
      radios.forEach(radio => {
          radio.checked = false;
      });
  });
});

function requestConversationEmotionInterlocutor(nodeId) {
  console.log('Richiesta nodo:', nodeId); 

  fetch("/CrimeMiner/interlocutoreCrimes/findConversationsByEmotionAndName/" + nodeId, {
    method: "GET"
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Errore nella richiesta.');
    }
  })
  .then(data => {
    console.log('Dati ricevuti:', data);
    createGraphInterlocutor(data.result);
  })
  .catch(error => {
    console.error(error);
    showError("Errore nel caricamento delle conversazioni per emozione.");
  });
}

// creare qui nuova funzione createGraphEmotion
function createGraphEmotion(data) {

  // Verifica se i dati contengono nodi e archi
  if (!data.nodes) {
    console.error('I dati ricevuti non contengono nodi');
    return;
  }

  //Creazione del grafico con assegnazione alla variabile
  cyInterlocutor = cytoscape({
    container: document.querySelector('.cyContent'),
    elements: data, //Questi sono i dati ricevuti dal backend, preformattati come vuole la libreria
    style: [ // Stile dei nodi e degli archi
      {
        selector: 'node',
        style: {
          "width": "mapData(size, 0, 100, 20, 60)",
          "height": "mapData(size, 0, 100, 20, 60)",
          'background-color': '#b245fb',
          'label': 'data(nome)'
        }
      },
    ],
    layout: {
      name: 'circle', //dagre  //fcose
    },
    minZoom: 0.14,
    maxZoom: 2.0
  });

  //Si aspetta che il grafo sia pronto per poter inserire per ogni nodo o arco un evento sul click
  cyInterlocutor.ready(function () {

    //Funzione di click per il nodo
    cyInterlocutor.on('tap', 'node', function(evt) {
      const nodeId = evt.target.id();
      console.log('Nodo Cliccato: ', nodeId);

      //Faccio la richiesta dei dettagli per il singolo nodo
      requestDetailsOfNodeInterlocutor(nodeId);
      requestConversationEmotionInterlocutor(nodeId);
      
      //Controllo se prima di cliccare il nodo era stato cliccato un altro nodo, se l'esito è positivo riporto il nodo al suo colore iniziale
      if(cyNodeTouchedInterlocutor != "" || evt.target.classes() == undefined){
        if(cyNodeTouchedInterlocutor[1] == "I")
            cyInterlocutor.$("#"+ cyNodeTouchedInterlocutor).style('background-color', '#d7bd1e');
          else
            cyInterlocutor.$("#"+ cyNodeTouchedInterlocutor).style('background-color', '#1505e3');
      }

      //Inserisco il nodo corrente nella variabile e gli cambio il colore
      cyNodeTouchedInterlocutor = nodeId;
      evt.target.style('background-color', '#991199');
    });

    //Funzione di click sul background del grafo
    cyInterlocutor.on('tap', function(evt) {

      //Controllo che sia stato effettivamente cliccata una zona diversa da nodi e archi
      if(evt.target._private.container != undefined){

        //In caso di esito positivo controllo se ci stavano dei nodi selezionati e li riporto come in origine
        if(cyNodeTouchedInterlocutor != ""){
          if(cyNodeTouchedInterlocutor[1] == "I")
            cyInterlocutor.$("#"+ cyNodeTouchedInterlocutor).style('background-color', '#d7bd1e');
          else
            cyInterlocutor.$("#"+ cyNodeTouchedInterlocutor).style('background-color', '#1505e3');
          cyNodeTouchedInterlocutor = "";
        }
      }
    });
  });
}


function requestInterlocutorInfoByName(nome) {
  console.log('Richiesta nodo per nome:', nome); // Aggiunto log per il debug

  fetch("/CrimeMiner/interlocutoreCrimes/getNodeInfoByName/" + nome, {
    method: "GET"
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Errore nella richiesta.');
    }
  })
  .then(data => {
    console.log('Dati ricevuti:', data);
    createGraphInterlocutor(data.result);
  })
  .catch(error => {
    console.error(error);
    showError("Errore nel caricamento delle informazioni per nome.");
  });
}

// Funzione per gestire il filtro per nome
function findNodeByName(event) {
  event.preventDefault(); // Previeni il comportamento di default del form
  const graphContainer = document.getElementById('graph-container');
  const noCombinationMessage = document.getElementById('no-combination-message');

  const nameInput = document.querySelector('input[name="nome"]').value;
  console.log('Nome desiderato:', nameInput); // Stampa il nome selezionato per il debug
  requestInterlocutorInfoByName(nameInput);
  noCombinationMessage.style.display = 'none'; // Nasconde il messaggio di nessuna combinazione trovata
  graphContainer.style.display = 'block'; // Mostra il contenitore del grafico
}

// Aggiungi un ascoltatore di eventi al form per gestire il submit
document.addEventListener('DOMContentLoaded', function() {
  const nomeForm = document.querySelector('#nome-form');
  nomeForm.addEventListener('submit', function(event) {
    findNodeByName(event); // Passa l'evento del form alla funzione di filtro
  });
});

function requestRelationsByDate(start_date, end_date) {
  console.log('Richiesta arco per data iniziale:', start_date);
  console.log('Richiesta arco per data fine:', end_date);

  fetch("/CrimeMiner/interlocutoreCrimes/getRelationsByTimeInterval/" + start_date + "/" + end_date, {
    method: "GET"
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Errore nella richiesta.');
    }
  })
  .then(data => {
    console.log('Dati ricevuti:', data);
    createGraphInterlocutor(data.result);
  })
  .catch(error => {
    console.error(error);
  });
}

// Funzione per gestire il filtro per range temporale
function findRelationsByDate(event) {
  event.preventDefault(); // Previeni il comportamento di default del form

  const graphContainer = document.getElementById('graph-container');
  const noCombinationMessage = document.getElementById('no-combination-message');

  const datestartInput = document.querySelector('input[name="start-date"]').value;
  const dateendInput = document.querySelector('input[name="end-date"]').value;
  console.log('Data di inizio:', datestartInput); // Stampa la data selezionata per il debug
  console.log('Data di fine:', dateendInput); 
  requestRelationsByDate(datestartInput, dateendInput);
  noCombinationMessage.style.display = 'none'; // Nasconde il messaggio di nessuna combinazione trovata
  graphContainer.style.display = 'block'; // Mostra il contenitore del grafico
}

// Aggiungi un ascoltatore di eventi al form per gestire il submit
document.addEventListener('DOMContentLoaded', function() {
  const dateForm = document.querySelector('#date-form');
  dateForm.addEventListener('submit', function(event) {
    findRelationsByDate(event); // Passa l'evento del form alla funzione di filtro
  });
});

// gestione per combinare i risultati dei tre filtri considerati
async function combineFiltersAndGenerateGraph(nome, start_date, end_date, emotion) {
  const results = {
    nameData: [],
    dateData: { nodes: [], edges: [] },
    emotionData: [],
  };

  const graphContainer = document.getElementById('graph-container');
  const noCombinationMessage = document.getElementById('no-combination-message');

  console.log(`[combineFiltersAndGenerateGraph] Avviata la combinazione dei filtri. Nome: ${nome}, Data inizio: ${start_date}, Data fine: ${end_date}, Emozione: ${emotion}`);

  try {
    // Esegui le richieste asincrone in parallelo
    const [nameResponse, dateResponse, emotionResponse] = await Promise.all([
      nome ? fetch(`/CrimeMiner/interlocutoreCrimes/getNodeInfoByName/${nome}`).then(res => res.ok ? res.json() : Promise.reject('Errore nella richiesta per nome.')) : Promise.resolve(null),
      (start_date && end_date) ? fetch(`/CrimeMiner/interlocutoreCrimes/getRelationsByTimeInterval/${start_date}/${end_date}`).then(res => res.ok ? res.json() : Promise.reject('Errore nella richiesta per data.')) : Promise.resolve(null),
      emotion ? fetch(`/CrimeMiner/interlocutoreCrimes/findInterlocutorByEmotion/${emotion}`).then(res => res.ok ? res.json() : Promise.reject('Errore nella richiesta per emozione.')) : Promise.resolve(null),
    ]);

    console.log('[combineFiltersAndGenerateGraph] Richieste asincrone completate con successo.');

    // Log della struttura dei dati ricevuti
    console.log('[combineFiltersAndGenerateGraph] Struttura dei dati ricevuti per nome:', nameResponse);
    console.log('[combineFiltersAndGenerateGraph] Struttura dei dati ricevuti per data:', dateResponse);
    console.log('[combineFiltersAndGenerateGraph] Struttura dei dati ricevuti per emozione:', emotionResponse);

    if (nameResponse && nameResponse.result) {
      results.nameData = nameResponse.result.nodes || [];
      console.log('[combineFiltersAndGenerateGraph] Dati del filtro per nome:', results.nameData);
    }
    if (dateResponse && dateResponse.result) {
      results.dateData.nodes = dateResponse.result.nodes || [];
      results.dateData.edges = dateResponse.result.edges || [];
      console.log('[combineFiltersAndGenerateGraph] Dati del filtro per data:', results.dateData);
    }
    if (emotionResponse && emotionResponse.result) {
      results.emotionData = emotionResponse.result.nodes || [];
      console.log('[combineFiltersAndGenerateGraph] Dati del filtro per emozione:', results.emotionData);
    }

    // Combina i risultati dei filtri
    let combinedResults = results.nameData.length > 0 ? results.nameData : results.dateData.nodes;

    console.log('[combineFiltersAndGenerateGraph] Combinazione iniziale (per nome o data):', combinedResults);

    if (results.dateData.nodes.length > 0) {
      combinedResults = combinedResults.filter(node =>
        results.dateData.nodes.some(dateNode => dateNode.data.id === node.data.id)
      );
      console.log('[combineFiltersAndGenerateGraph] Dopo combinazione con data:', combinedResults);
    }

    if (results.emotionData.length > 0) {
      combinedResults = combinedResults.filter(node =>
        results.emotionData.some(emotionNode => emotionNode.data.id === node.data.id)
      );
      console.log('[combineFiltersAndGenerateGraph] Dopo combinazione con emozione:', combinedResults);
    }

    console.log(`[combineFiltersAndGenerateGraph] Risultati combinati finali:`, combinedResults);

    // Filtra gli archi per includere solo quelli collegati ai nodi combinati
    const combinedEdges = results.dateData.edges.filter(edge =>
      combinedResults.some(node => node.data.id === edge.data.source) &&
      combinedResults.some(node => node.data.id === edge.data.target)
    );

    console.log(`[combineFiltersAndGenerateGraph] Archi combinati finali:`, combinedEdges);

    // Aggiorna i nodi per includere solo quelli collegati dagli archi filtrati
    const connectedNodeIds = new Set();
    combinedEdges.forEach(edge => {
      connectedNodeIds.add(edge.data.source);
      connectedNodeIds.add(edge.data.target);
    });

    combinedResults = combinedResults.filter(node => connectedNodeIds.has(node.data.id));

    console.log(`[combineFiltersAndGenerateGraph] Nodi finali connessi:`, combinedResults);

    // Verifica se ci sono risultati combinati
    if (combinedResults.length > 0) {
      if (combinedEdges.length > 0) {
        createGraphInterlocutor({ nodes: combinedResults, edges: combinedEdges });
        console.log('[combineFiltersAndGenerateGraph] Grafico creato con successo con nodi e archi.');
      } else {
        createGraphEmotion({ nodes: combinedResults });
        console.log('[combineFiltersAndGenerateGraph] Grafico creato con successo con solo nodi.');
      }
      noCombinationMessage.style.display = 'none'; // Nasconde il messaggio di nessuna combinazione trovata
      graphContainer.style.display = 'block'; // Mostra il contenitore del grafico
    } else {
      console.log('[combineFiltersAndGenerateGraph] Nessuna combinazione trovata.');
      noCombinationMessage.style.display = 'block'; // Mostra il messaggio di nessuna combinazione trovata
      graphContainer.style.display = 'none'; // Nasconde il contenitore del grafico
    }
  } catch (error) {
    console.error('[combineFiltersAndGenerateGraph] Si è verificato un errore:', error);
    noCombinationMessage.style.display = 'block'; // Mostra il messaggio di nessuna combinazione trovata in caso di errore
    graphContainer.style.display = 'none'; // Nasconde il contenitore del grafico in caso di errore
  }
}

// Gestisce il click del bottone "Combina Filtri"
document.addEventListener('DOMContentLoaded', function () {
  const combineFilterButton = document.getElementById('combine-filter-button');

  combineFilterButton.addEventListener('click', function (event) {
    event.preventDefault();

    const nameInput = document.querySelector('input[name="nome"]').value;
    const datestartInput = document.querySelector('input[name="start-date"]').value;
    const dateendInput = document.querySelector('input[name="end-date"]').value;
    const selectedEmotionInput = document.querySelector('input[name="emotion"]:checked');
    const selectedEmotionValue = selectedEmotionInput ? selectedEmotionInput.value : null;

    combineFiltersAndGenerateGraph(nameInput, datestartInput, dateendInput, selectedEmotionValue);
  });
});


//Funzione che crea il grafo con le sue opportune proprietà
function createGraphInterlocutor(data) {

  // Verifica se i dati contengono nodi e archi
  if (!data.nodes || !data.edges) {
    console.error('I dati ricevuti non contengono nodi o archi.');
    return;
  }

  //Creazione del grafico con assegnazione alla variabile
  cyInterlocutor = cytoscape({
    container: document.querySelector('.cyContent'),
    elements: data, //Questi sono i dati ricevuti dal backend, preformattati come vuole la libreria
    style: [ // Stile dei nodi e degli archi
      {
        selector: 'node',
        style: {
          "width": "mapData(size, 0, 100, 20, 60)",
          "height": "mapData(size, 0, 100, 20, 60)",
          'background-color': '#b245fb',
          'label': 'data(nome)'
        }
      },
      {
        selector: 'edge',
        style: {
          'width': 2,
          'line-color': '#dfdfdf',
          "curve-style": "bezier"
        }
      },
    ],
    layout: {
      name: 'circle', //dagre  //fcose //cose
    },
    minZoom: 0.14,
    maxZoom: 2.0
  });

  //Si aspetta che il grafo sia pronto per poter inserire per ogni nodo o arco un evento sul click
  cyInterlocutor.ready(function () {

    //Funzione di click per il nodo
    cyInterlocutor.on('tap', 'node', function(evt) {
      const nodeId = evt.target.id();
      console.log('Nodo Cliccato: ', nodeId);

      //Faccio la richiesta dei dettagli per il singolo nodo
      requestDetailsOfNodeInterlocutor(nodeId);

      //Controllo se prima di cliccare il nodo era stato cliccato un arco, se l'esito è positivo riporto l'arco al suo colore iniziale
      if(cyEdgeTouchedInterlocutor != "")
        cyInterlocutor.edges("#"+ cyEdgeTouchedInterlocutor).style('line-color', '#dfdfdf');

      //Controllo se prima di cliccare il nodo era stato cliccato un altro nodo, se l'esito è positivo riporto il nodo al suo colore iniziale
      if(cyNodeTouchedInterlocutor != "" || evt.target.classes() == undefined){
        if(cyNodeTouchedInterlocutor[1] == "I")
            cyInterlocutor.$("#"+ cyNodeTouchedInterlocutor).style('background-color', '#d7bd1e');
          else
            cyInterlocutor.$("#"+ cyNodeTouchedInterlocutor).style('background-color', '#1505e3');
      }

      //Inserisco il nodo corrente nella variabile e gli cambio il colore
      cyNodeTouchedInterlocutor = nodeId;
      evt.target.style('background-color', '#991199');
    });

    //Funzione di click per l'arco
    cyInterlocutor.on('tap', 'edge', function(evt) {

      //Faccio la richiesta dei dettagli per il singolo arco
      requestDetailsOfEdgeInterlocutorCrimes(evt.target.id())

      //Controllo se prima di cliccare l'arco era stato cliccato un nodo, se l'esito è positivo riporto il nodo al suo colore iniziale
      if(cyNodeTouchedInterlocutor != "" || evt.target.classes() == undefined){
        if(cyNodeTouchedInterlocutor[1] == "I")
            cyInterlocutor.$("#"+ cyNodeTouchedInterlocutor).style('background-color', '#d7bd1e');
          else
            cyInterlocutor.$("#"+ cyNodeTouchedInterlocutor).style('background-color', '#1505e3');
      }

      //Controllo se prima di cliccare l'arco era stato cliccato un altro arco, se l'esito è positivo riporto l'arco al suo colore iniziale
      if(cyEdgeTouchedInterlocutor != "" || evt.target.classes()[0] == "Interlocutore")
        cyInterlocutor.edges("#"+ cyEdgeTouchedInterlocutor).style('line-color', '#dfdfdf');

      //Inserisco l'arco corrente nella variabile e gli cambio il colore
      cyEdgeTouchedInterlocutor = evt.target.id();
      evt.target.style('line-color', '#991199');
    });

    //Funzione di click sul background del grafo
    cyInterlocutor.on('tap', function(evt) {

      //Controllo che sia stato effettivamente cliccata una zona diversa da nodi e archi
      if(evt.target._private.container != undefined){

        //In caso di esito positivo controllo se ci stavano dei nodi o degli archi selezionati e li riporto come in origine
        if(cyEdgeTouchedInterlocutor != ""){
          cyInterlocutor.$("#"+ cyEdgeTouchedInterlocutor).style('line-color', '#dfdfdf');
          cyEdgeTouchedInterlocutor = "";
        }
        if(cyNodeTouchedInterlocutor != ""){
          if(cyNodeTouchedInterlocutor[1] == "I")
            cyInterlocutor.$("#"+ cyNodeTouchedInterlocutor).style('background-color', '#d7bd1e');
          else
            cyInterlocutor.$("#"+ cyNodeTouchedInterlocutor).style('background-color', '#1505e3');
          cyNodeTouchedInterlocutor = "";
        }
      }
    });

    //Con questa funzione, quando passo sull'arco, cambia colore
    cyInterlocutor.on('mouseover', 'edge', function (event) {
      if(event.target.id() != cyEdgeTouchedInterlocutor)
        event.target.style('line-color', '#828282'); // Cambia il colore dell'arco al passaggio del mouse
    });
    
    //Con questa funzione, quando non sto più col mouse sull'arco, torna al colore iniziale
    cyInterlocutor.on('mouseout', 'edge', function (event) {
      if(event.target.id() != cyEdgeTouchedInterlocutor)
        event.target.style('line-color', '#dfdfdf'); // Ripristina il colore dell'arco quando il mouse esce
    });
  });
}

//Con questa funzione in base alla metrica decido di quanto moltiplicare il valore dei nodi per renderla visibile sul grafo
function changeSizeNodesInterlocutorCrimes(data){
  let selectMetrics = document.querySelector(".selectMetrics").value;

  if(selectMetrics == "Default"){
    data = data.nodes;
    for(let i = 0; i < data.length; i++)
      cyInterlocutor.$('#'+ data[i].data.id).data("size",data[i].data.size);
  }
  else{
    data = data.result;
    if(selectMetrics == "PageRank" || selectMetrics == "WeightedPageRank"|| selectMetrics == "Closeness")
    for(let i = 0; i < data.length; i++){
      cyInterlocutor.$('#'+ data[i].id).data("size",data[i].size*200);
    }

    if(selectMetrics == "Betweenness")
    for(let i = 0; i < data.length; i++){
      cyInterlocutor.$('#'+ data[i].id).data("size",data[i].size/10);
    }

    if(selectMetrics == "Degree" || selectMetrics == "InDegree" || selectMetrics == "OutDegree")
    for(let i = 0; i < data.length; i++){
      cyInterlocutor.$('#'+ data[i].id).data("size",data[i].size*3);
    }
  }
}

//Con questa funzione cambio la visualizzazione del Layout del grafo tra circle, dagre e fcose
function changeLayoutInterlocutorCrimes() {

  if(document.querySelector(".selectLayout").value == 'circle'){
    loadPage(2500);

    cyInterlocutor.layout({
      name: 'circle',
      animate: true
    }).run();
  }

  if(document.querySelector(".selectLayout").value == 'dagre'){
    loadPage(2500);
    
    cyInterlocutor.layout({
      name: 'dagre',
      rankDir: 'TB',
      ranker: 'longest-path',
      spacingFactor: 0.2,
      nodeSep: 120,
      edgeSep: 2,
      rankSep: 550,
      animate: true
    }).run();
  }

  if(document.querySelector(".selectLayout").value == 'fcose'){
    loadPage(2500);
    
    cyInterlocutor.layout({
      name: 'fcose',
      spacingFactor: 3,
      animate: true
    }).run();
  }

}

//Funzione che richiama la request delle metriche
function changeMetricInterlocutorCrimes(){
    requestSizeNodesInterlocutorCrimes();
}

//Funzione che anonimizza i dati dell'Interlocutore
function anonymizationNodeDetailsInterlocutorCrimes(flag){

  if(flag == "yes"){

    document.querySelector(".infoInterlocutorCrimesNodeInterlocutorNameContent").innerHTML = "*********";
    document.querySelector(".infoInterlocutorCrimesNodeInterlocutorBirthContent").innerHTML = "*********";
    document.querySelector(".infoInterlocutorCrimesNodeInterlocutorNationContent").innerHTML = "*********";
    document.querySelector(".infoInterlocutorCrimesNodeInterlocutorProvinceContent").innerHTML = "*********";
    document.querySelector(".infoInterlocutorCrimesNodeInterlocutorResidenceContent").innerHTML = "*********";
    document.querySelector(".infoInterlocutorCrimesNodeInterlocutorCapContent").innerHTML = "*********";
    document.querySelector(".infoInterlocutorCrimesNodeInterlocutorAddressContent").innerHTML = "*********";
    document.querySelector(".infoInterlocutorCrimesNodeInterlocutorEmotionContent").innerHTML = "*********";
    document.querySelector(".infoInterlocutorCrimesNodeInterlocutorLuogoContent").innerHTML = "*********";
    document.querySelector(".infoInterlocutorCrimesNodeInterlocutorCondannaContent").innerHTML = "*********";
    document.querySelector(".infoInterlocutorCrimesNodeInterlocutorImputatiContent").innerHTML = "*********";
    document.querySelector(".infoInterlocutorCrimesNodeInterlocutorTotalContent").innerHTML = "*********";
    document.querySelector(".infoInterlocutorCrimesNodeInterlocutorFrasiContent").innerHTML = "*********";
    document.querySelector(".infoInterlocutorCrimesNodeInterlocutorReatoContent").innerHTML = "*********";
    document.querySelector(".infoInterlocutorCrimesNodeInterlocutorNormeContent").innerHTML = "*********";
 
  }
  else{
    if(cyNodeDataInterlocutor != ""){
      document.querySelector(".infoInterlocutorCrimesNodeInterlocutorNameContent").innerHTML = cyNodeDataInterlocutor.nome;
      document.querySelector(".infoInterlocutorCrimesNodeInterlocutorBirthContent").innerHTML = cyNodeDataInterlocutor.dataNascita;
      document.querySelector(".infoInterlocutorCrimesNodeInterlocutorNationContent").innerHTML = cyNodeDataInterlocutor.nazioneResidenza;
      document.querySelector(".infoInterlocutorCrimesNodeInterlocutorProvinceContent").innerHTML = cyNodeDataInterlocutor.provinciaResidenza;
      document.querySelector(".infoInterlocutorCrimesNodeInterlocutorResidenceContent").innerHTML = cyNodeDataInterlocutor.cittaResidenza;
      document.querySelector(".infoInterlocutorCrimesNodeInterlocutorCapContent").innerHTML = cyNodeDataInterlocutor.capResidenza;
      document.querySelector(".infoInterlocutorCrimesNodeInterlocutorAddressContent").innerHTML = cyNodeDataInterlocutor.indirizzoResidenza;
      document.querySelector(".infoInterlocutorCrimesNodeInterlocutorEmotionContent").innerHTML = cyNodeDataInterlocutor.emozione_predominante;
      document.querySelector(".infoInterlocutorCrimesNodeInterlocutorLuogoContent").innerHTML = cyNodeDataInterlocutor.luogoNascita;
      document.querySelector(".infoInterlocutorCrimesNodeInterlocutorCondannaContent").innerHTML = cyNodeDataInterlocutor.mesiCondanna;
      document.querySelector(".infoInterlocutorCrimesNodeInterlocutorImputatiContent").innerHTML = cyNodeDataInterlocutor.mesiImputati;
      document.querySelector(".infoInterlocutorCrimesNodeInterlocutorTotalContent").innerHTML = cyNodeDataInterlocutor.mesiTotali;
      document.querySelector(".infoInterlocutorCrimesNodeInterlocutorFrasiContent").innerHTML = cyNodeDataInterlocutor.frasiDette;
      document.querySelector(".infoInterlocutorCrimesNodeInterlocutorReatoContent").innerHTML = cyNodeDataInterlocutor.nomeReato;
      document.querySelector(".infoInterlocutorCrimesNodeInterlocutorNormeContent").innerHTML = cyNodeDataInterlocutor.normeDiRiferimento;
    }
  }
}

//Funzione che si occupa di mostrare o meno gli identificativi dei nodi e degli archi sul grafo
function checkedNodesAndEdgesInterlocutorCrimes(){
  //Controlla se la checkbox dei nodi è checkata, se si mostra l'id del nodo, in caso contrario no
  if(document.querySelector("#CheckNodes").checked){
    cyInterlocutor.style()
    .resetToDefault()
    .selector('node')
      .style({
        "width": "mapData(size, 0, 100, 20, 60)",
        "height": "mapData(size, 0, 100, 20, 60)",
        'background-color': '#c79cfd',
        'label': 'data(nome)'
      })
    .update();
  }
  else{
    cyInterlocutor.style()
    .resetToDefault()
    .selector('node')
      .style({
        "width": "mapData(size, 0, 100, 20, 60)",
        "height": "mapData(size, 0, 100, 20, 60)",
        'background-color': '#c79cfd'
      })
    .update();
  }

  //Fa lo stesso con gli archi
  if(document.querySelector("#CheckEdges").checked){
    cyInterlocutor.style()
    .selector('edge')
        .style({
          'width': 2,
          'line-color': '#dfdfdf',
          "curve-style": "bezier",
          'label': 'data(id)'
        })
    .update();
  }
  else{
    cyInterlocutor.style()
    .selector('edge')
        .style({
          'width': 2,
          'line-color': '#dfdfdf',
          "curve-style": "bezier"
        })
    .update();
  }
}

//Funzione che inserisce nei cookie il valore dell'anonimizzazione e chiama un'altra funzione per la modifica nel layout
function checkedAnonymizationInterlocutorCrimes(){
  if(document.querySelector("#CheckAnonymization").checked == true){

    if(!document.cookie.includes("anonymization"))
      document.cookie = "anonymization=yes";
    else
      setCookie("anonymization","yes");
    
      anonymizationNodeDetailsInterlocutorCrimes("yes");
  }
  else{
    if(!document.cookie.includes("anonymization"))
      document.cookie = "anonymization=no";
    else
      setCookie("anonymization","no");
    
      anonymizationNodeDetailsInterlocutorCrimes("no");
  }
}

//Funzione che mostra i dettagli dei nodi della tipologia Interlocutore
function showDetailsOfNodeInterlocutorCrimes(data){
  console.log('Dettagli nodo: ', data);
  document.querySelector(".infoInterlocutorCrimesEdge").style.display = "none";
  document.querySelector(".infoInterlocutorCrimesNot").style.display = "none";
  document.querySelector(".infoInterlocutorCrimesNodeInterlocutor").style.display = "flex";

  document.querySelector(".accordionButtonTwo").innerHTML = "Dettagli Interlocutore";

  document.querySelector(".infoInterlocutorCrimesNodeInterlocutorIdContent").innerHTML = data.nodeId;
  

  if(getCookie("anonymization") == "yes"){

    document.querySelector(".infoInterlocutorCrimesNodeInterlocutorNameContent").innerHTML = "*********";
    document.querySelector(".infoInterlocutorCrimesNodeInterlocutorBirthContent").innerHTML = "*********";
    document.querySelector(".infoInterlocutorCrimesNodeInterlocutorNationContent").innerHTML = "*********";
    document.querySelector(".infoInterlocutorCrimesNodeInterlocutorProvinceContent").innerHTML = "*********";
    document.querySelector(".infoInterlocutorCrimesNodeInterlocutorResidenceContent").innerHTML = "*********";
    document.querySelector(".infoInterlocutorCrimesNodeInterlocutorCapContent").innerHTML = "*********";
    document.querySelector(".infoInterlocutorCrimesNodeInterlocutorAddressContent").innerHTML = "*********";
    document.querySelector(".infoInterlocutorCrimesNodeInterlocutorEmotionContent").innerHTML = "*********";
    document.querySelector(".infoInterlocutorCrimesNodeInterlocutorLuogoContent").innerHTML = "*********";
    document.querySelector(".infoInterlocutorCrimesNodeInterlocutorCondannaContent").innerHTML = "*********";
    document.querySelector(".infoInterlocutorCrimesNodeInterlocutorImputatiContent").innerHTML = "*********";
    document.querySelector(".infoInterlocutorCrimesNodeInterlocutorTotalContent").innerHTML = "*********";
    document.querySelector(".infoInterlocutorCrimesNodeInterlocutorFrasiContent").innerHTML = "*********";
    document.querySelector(".infoInterlocutorCrimesNodeInterlocutorReatoContent").innerHTML = "*********";
    document.querySelector(".infoInterlocutorCrimesNodeInterlocutorNormeContent").innerHTML = "*********";
  }
  else{
    document.querySelector(".infoInterlocutorCrimesNodeInterlocutorNameContent").innerHTML = data.nome;
    document.querySelector(".infoInterlocutorCrimesNodeInterlocutorBirthContent").innerHTML = data.dataNascita;
    document.querySelector(".infoInterlocutorCrimesNodeInterlocutorNationContent").innerHTML = data.nazioneResidenza;
    document.querySelector(".infoInterlocutorCrimesNodeInterlocutorProvinceContent").innerHTML = data.provinciaResidenza;
    document.querySelector(".infoInterlocutorCrimesNodeInterlocutorResidenceContent").innerHTML = data.cittaResidenza;
    document.querySelector(".infoInterlocutorCrimesNodeInterlocutorCapContent").innerHTML = data.capResidenza;
    document.querySelector(".infoInterlocutorCrimesNodeInterlocutorAddressContent").innerHTML = data.indirizzoResidenza;
    document.querySelector(".infoInterlocutorCrimesNodeInterlocutorEmotionContent").innerHTML = data.emozione_predominante;
    document.querySelector(".infoInterlocutorCrimesNodeInterlocutorLuogoContent").innerHTML = data.luogoNascita;
    document.querySelector(".infoInterlocutorCrimesNodeInterlocutorCondannaContent").innerHTML = data.mesiCondanna;
    document.querySelector(".infoInterlocutorCrimesNodeInterlocutorImputatiContent").innerHTML = data.mesiImputati;
    document.querySelector(".infoInterlocutorCrimesNodeInterlocutorTotalContent").innerHTML = data.mesiTotali;
    document.querySelector(".infoInterlocutorCrimesNodeInterlocutorFrasiContent").innerHTML = data.frasiDette;
    document.querySelector(".infoInterlocutorCrimesNodeInterlocutorReatoContent").innerHTML = data.nomeReato;
    document.querySelector(".infoInterlocutorCrimesNodeInterlocutorNormeContent").innerHTML = data.normeDiRiferimento;
  } 

  if(document.querySelector("#item-details").checked == false)
    document.querySelector("#item-details").click();
}

//Funzione che mostra i dettagli degli archi
function showDetailsOfEdgeIndividualCrimes(data){
  document.querySelector(".infoInterlocutorCrimesNot").style.display = "none";
  document.querySelector(".infoInterlocutorCrimesNodeInterlocutor").style.display = "none";
  document.querySelector(".infoInterlocutorCrimesEdge").style.display = "flex";

  document.querySelector(".accordionButtonTwo").innerHTML = "Dettagli Conversazione";

  document.querySelector(".infoInterlocutorCrimesEdgeIdContent").innerHTML = data.edgeId;
  document.querySelector(".infoInterlocutorCrimesEdgeInterlocutorContent").innerHTML = data.startNodeElementId;
  document.querySelector(".infoInterlocutorCrimesEdgeTargetContent").innerHTML = data.endNodeElementId;
  document.querySelector(".infoInterlocutorCrimesEdgeIdConvContent").innerHTML = data.ID;
  document.querySelector(".infoInterlocutorCrimesEdgeConversationContent").innerHTML = data.conversazione;
  document.querySelector(".infoInterlocutorCrimesEdgeDateContent").innerHTML = data.data_conversazione;
  document.querySelector(".infoInterlocutorCrimesEdgeInterlocutorListContent").innerHTML = data.interlocutori;
  document.querySelector(".infoInterlocutorCrimesEdgeLuogoContent").innerHTML = data.luogo;
  document.querySelector(".infoInterlocutorCrimesEdgeNumberConvContent").innerHTML = data.numero;
  document.querySelector(".infoInterlocutorCrimesEdgeHourConvContent").innerHTML = data.orario_conversazione;
  document.querySelector(".infoInterlocutorCrimesEdgeTypeContent").innerHTML = data.tipologia;

  if(document.querySelector("#item-details").checked == false)
    document.querySelector("#item-details").click();
}

//Funzione che mostra il numero di nodi e archi presenti nel grafo
function fillPropertyAccordionInterlocutor(data){

  document.querySelector(".accordionNumberNodesEdgesInterlocutorContent").innerHTML = data.nodes.length;
  document.querySelector(".accordionNumberNodesEdgesRelationContent").innerHTML = data.edges.length;

  document.querySelector(".accordionNumberNodesEdgesNodesContent").innerHTML = data.nodes.length;
  document.querySelector(".accordionNumberNodesEdgesEdgesContent").innerHTML = data.edges.length;
}

// Funzione per mostrare un messaggio di errore
function showError(message) {
  const errorContainer = document.getElementById('error-container');
    if (errorContainer) {
      errorContainer.textContent = message;
      errorContainer.style.display = 'block';
    }
  }
  
  // Funzione per nascondere il messaggio di errore
  function hideError() {
    const errorContainer = document.getElementById('error-container');
    if (errorContainer) {
      errorContainer.style.display = 'none';
    }
  }