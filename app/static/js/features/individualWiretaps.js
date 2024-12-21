//Variabile che conterrà il grafo che andremo a realizzare
//let cyIndividualWiretaps;

//Variabili che ci consentono di tener traccia del nodo o dell'arco da far tornare come prima
let cyNodeTouchedIndividualWiretaps  = "";
let cyEdgeTouchedIndividualWiretaps  = "";

//Variabile che ci consente di tener traccia dell'id dell'utente quando si anonimizza
let cyNodeDataIndividualWiretaps  = "";

let editorModalTextAreaIndividualWiretaps = "";

let timeline;
let startDateDisplay;
let endDateDisplay;
let months;
let leftSelector;
let rightSelector;
let totalMonths;


//Funzione che permette di caricare script javascript al caricamento della pagina
window.onload = function () {


  //Inizializzazione
  leftSelector = document.querySelector('.left-selector');
  rightSelector = document.querySelector('.right-selector');
  startDateDisplay = document.getElementById('start-date');
  endDateDisplay = document.getElementById('end-date');
  months = generateMonths('2003-08-01', '2006-09-31');
  totalMonths = months.length;
  timeline = document.querySelector('.timeline');
  
  // Posiziona i selector inizialmente
  leftSelector.style.left = calculatePosition(0) + '%';
  rightSelector.style.left = calculatePosition(totalMonths - 1) + '%';
  
  //CREAZIONE SLIDER TEMPORALE  
  

  // Rendi i cursori trascinabili
  makeDraggable(leftSelector, true);
  makeDraggable(rightSelector, false);

  // Imposta le date iniziali
  updateDates();

  // Crea le etichette delle date
  createDateLabels();

  // Aggiungi le linee verticali
  addVerticalLines();


  //Funzione che fa partire il caricamento
  loadPage(2500);
  requestAllNodesIndividualWiretaps();
  checkedSourceAndTargetModalIndividualWiretaps();

  //Comando che fa aprire all'avvio della pagina l'accordione delle proprietà
  document.querySelector("#item-properties").click();

  //Controllo se devo anonimizzare i dati
  if(!document.cookie.includes("anonymization"))
      document.cookie = "anonymization=no";
    else
      if(getCookie("anonymization") == "yes")
        document.querySelector("#CheckAnonymization").checked = true;

  //elemento che rimpiazza la Textarea con un text editor tipo word
  CKEDITOR.replace("textarea-content", {
    wordcount: {'showWordCount': false,
                'showParagraphs': false,
                'showCharCount': true
            },
            removeButtons: 'Source,PasteFromWord,Scayt,PasteText,RemoveFormat,Cut,Copy,Paste,Undo,Redo,Anchor,Underline,Strike,Subscript,Superscript,Image,Link,Unlink,Table,HorizontalRule,SpecialChar,Maximize,About,Styles,Format,Font,FontSize,Blockquote,Indent,Outdent,NumberedList,BulletedList,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock,BidiLtr,BidiRtl,Language,Smiley,Iframe',
            resize_enabled: false,
            on: {
              instanceReady: function (ev) {
                  editorModalTextAreaIndividualWiretaps = ev.editor;
                  ev.editor.container.$.getElementsByClassName('cke_bottom')[0].style.display = 'none';
              }
            }
  });
};

//Funzione che effettua la richiesta al backend per caricare il grafo iniziale
function requestAllNodesIndividualWiretaps() {

  fetch("/CrimeMiner/individuoIntercettazione/findallnodes/", {
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
    createGraphIndividualWiretaps(data);
    fillPropertyAccordionIndividualWiretaps(data);
    requestAllNodesModalIndividualWiretaps();
  })
  .catch(error => {
    console.error(error);
  });
}

//Funzione che effettua la richiesta al backend per caricare i nomi del mittente e del ricevente nella modale
function requestAllNodesModalIndividualWiretaps() {

  fetch("/CrimeMiner/individuo/findAllSurnameName/", {
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
    fillSourceAndTargetModalNewCallIndividualWiretaps(data.result)
  })
  .catch(error => {
    console.error(error);
  });
}

//Funzione che effettua la richiesta al backend per le metriche
function requestSizeNodesIndividualWiretaps(){
  let metric;

  if(document.querySelector(".selectMetrics").value == "Default")
    metric = "findallnodes";
  else
    metric = document.querySelector(".selectMetrics").value;

  fetch("/CrimeMiner/individuoIntercettazione/"+ metric +"/", {
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
    changeSizeNodesIndividualWiretaps(data);
  })
  .catch(error => {
    console.error(error);
  });
  window.onclick = function () {
    if(metric=="findallnodes")
      document.querySelector(".navbarText").innerHTML = "Individui - Intercettazioni Telefoniche";
    else
    document.querySelector(".navbarText").innerHTML = "Individui - Intercettazioni Telefoniche "+"<span style='color: #32CD32;'>"+": "+metric+"</span>";
  }
}
//Funzione che effettua la richiesta al backend per i dettagli di un singolo nodo
function requestDetailsOfNodeIndividualWiretaps(id){
  fetch("/CrimeMiner/individuo/getinfobynodeid/" + id, {
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
    showDetailsOfNodeIndividualWiretaps(data.result[0].n)
  })
  .catch(error => {
    console.error(error);
  });
}

//Funzione che effettua la richiesta al backend per i dettagli di un singolo arco
function requestDetailsOfEdgeIndividualWiretaps(id){
  fetch("/CrimeMiner/individuoIntercettazione/getinfobyedgeid/" + id, {
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
    showDetailsOfEdgeIndividualWiretaps(data.result[0].r)
  })
  .catch(error => {
    console.error(error);
  });
}

//Funzione che crea il grafo con le sue opportune proprietà
function createGraphIndividualWiretaps(data) {

  //Creazione del grafico con assegnazione alla variabile
  cyIndividualWiretaps = cytoscape({
    container: document.querySelector('.cyContent'),
    elements: data, //Questi sono i dati ricevuti dal backend, preformattati come vuole la libreria
    style: [ // Stile dei nodi e degli archi
      {
        selector: 'node',
        style: {
          "width": "mapData(size, 0, 100, 20, 60)",
          "height": "mapData(size, 0, 100, 20, 60)",
          'background-color': '#03a74f',
          'label': 'data(id)'
        }
      },
      {
        selector: 'edge',
        style: {
          'width': 2,
          'line-color': '#dfdfdf',
          "curve-style": "bezier"
        }
      }
    ],
    layout: {
      //name: 'circle', //dagre  //fcose
      name: 'fcose',
      spacingFactor: 3,
      animate: true,
    },
    minZoom: 0.18,
    maxZoom: 2.0
  });

  //Si aspetta che il grafo sia pronto per poter inserire un evento
  cyIndividualWiretaps.ready(function () {

    //Funzione di click per il nodo
    cyIndividualWiretaps.on('tap', 'node', function(evt) {

      //Faccio la richiesta dei dettagli per il singolo nodo
      requestDetailsOfNodeIndividualWiretaps(evt.target.id())

      //Controllo se prima di cliccare il nodo era stato cliccato un arco, se l'esito è positivo riporto l'arco al suo colore iniziale
      if(cyEdgeTouchedIndividualWiretaps != "")
        cyIndividualWiretaps.edges("#"+ cyEdgeTouchedIndividualWiretaps).style('line-color', '#dfdfdf');

      //Controllo se prima di cliccare il nodo era stato cliccato un altro nodo, se l'esito è positivo riporto il nodo al suo colore iniziale
      if(cyNodeTouchedIndividualWiretaps != "" || evt.target.classes() == undefined)
        cyIndividualWiretaps.nodes("#"+ cyNodeTouchedIndividualWiretaps).style('background-color', '#03a74f');

      //Inserisco il nodo corrente nella variabile e gli cambio il colore
      cyNodeTouchedIndividualWiretaps = evt.target.id();
      evt.target.style('background-color', '#991199');
    });

    //Funzione di click per l'arco
    cyIndividualWiretaps.on('tap', 'edge', function(evt) {

      //Faccio la richiesta dei dettagli per il singolo arco
      requestDetailsOfEdgeIndividualWiretaps(evt.target.id())
  
      //Controllo se prima di cliccare l'arco era stato cliccato un nodo, se l'esito è positivo riporto il nodo al suo colore iniziale
      if(cyNodeTouchedIndividualWiretaps != "")
        cyIndividualWiretaps.nodes("#"+ cyNodeTouchedIndividualWiretaps).style('background-color', '#03a74f');
      
      //Controllo se prima di cliccare l'arco era stato cliccato un altro arco, se l'esito è positivo riporto l'arco al suo colore iniziale
      if(cyEdgeTouchedIndividualWiretaps != "" || evt.target.classes()[0] == "Individuo")
        cyIndividualWiretaps.edges("#"+ cyEdgeTouchedIndividualWiretaps).style('line-color', '#dfdfdf');

      //Inserisco l'arco corrente nella variabile e gli cambio il colore
      cyEdgeTouchedIndividualWiretaps = evt.target.id();
      evt.target.style('line-color', '#991199');
    });

    //Funzione di click sul background del grafo
    cyIndividualWiretaps.on('tap', function(evt) {

      //Controllo che sia stato effettivamente cliccata una zona diversa da nodi e archi
      if(evt.target._private.container != undefined){

        //In caso di esito positivo controllo se ci stavano dei nodi o degli archi selezionati e li riporto come in origine
        if(cyEdgeTouchedIndividualWiretaps != ""){
          cyIndividualWiretaps.$("#"+ cyEdgeTouchedIndividualWiretaps).style('line-color', '#dfdfdf');
          cyEdgeTouchedIndividualWiretaps = "";
        }
        if(cyNodeTouchedIndividualWiretaps != ""){
          cyIndividualWiretaps.$("#"+ cyNodeTouchedIndividualWiretaps).style('background-color', '#03a74f');
          cyNodeTouchedIndividualWiretaps = "";
        }
      }
    });

    //Con questa funzione, quando passo sull'arco, cambia colore
    cyIndividualWiretaps.on('mouseover', 'edge', function (event) {
      if(event.target.id() != cyEdgeTouchedIndividualWiretaps)
        event.target.style('line-color', '#828282'); // Cambia il colore dell'arco al passaggio del mouse
    });
    
    //Con questa funzione, quando non sto più col mouse sull'arco, torna al colore iniziale
    cyIndividualWiretaps.on('mouseout', 'edge', function (event) {
      if(event.target.id() != cyEdgeTouchedIndividualWiretaps)
        event.target.style('line-color', '#dfdfdf'); // Ripristina il colore dell'arco quando il mouse esce
    });
  });
}

//Con questa funzione in base alla metrica decido di quanto moltiplicare il valore dei nodi per renderla visibile sul grafo
function changeSizeNodesIndividualWiretaps(data){
  let selectMetrics = document.querySelector(".selectMetrics").value;

  if(selectMetrics == "Default"){
    data = data.nodes;
    for(let i = 0; i < data.length; i++)
      cyIndividualWiretaps.$('#'+ data[i].data.id).data("size",data[i].data.size);
  }
  else{
    data = data.result;
    if(selectMetrics == "PageRank" || selectMetrics == "Closeness")
    for(let i = 0; i < data.length; i++){
      cyIndividualWiretaps.$('#'+ data[i].id).data("size",data[i].size*200);
    }

    if(selectMetrics == "Betweenness")
    for(let i = 0; i < data.length; i++){
      cyIndividualWiretaps.$('#'+ data[i].id).data("size",data[i].size/10);
    }

    if(selectMetrics == "Degree" || selectMetrics == "InDegree" || selectMetrics == "OutDegree")
    for(let i = 0; i < data.length; i++){
      cyIndividualWiretaps.$('#'+ data[i].id).data("size",data[i].size*3);
    }
  }
}

//Con questa funzione cambio la visualizzazione del Layout del grafo tra circle, dagre e fcose
function changeLayoutIndividualWiretaps() {

  if(document.querySelector(".selectLayout").value == 'circle'){
    loadPage(2500);
    
    cyIndividualWiretaps.layout({
      name: 'circle',
      animate: true,
      animationDuration: 2000
    }).run();
  }

  if(document.querySelector(".selectLayout").value == 'dagre'){
    loadPage(7500);
    
    cyIndividualWiretaps.layout({
      name: 'dagre',
      rankDir: 'TB',
      ranker: 'longest-path',
      spacingFactor: 0.2,
      nodeSep: 120,
      edgeSep: 2,
      rankSep: 550,
      animate: true,
      animationDuration: 7000
    }).run();
  }

  if(document.querySelector(".selectLayout").value == 'fcose'){
    loadPage(3000);

    cyIndividualWiretaps.layout({
      name: 'fcose',
      spacingFactor: 3,
      animate: true,
      animationDuration: 2000
    }).run();
  }

}

//Funzione che richiama la request delle metriche
function changeMetricIndividualWiretaps(){
  requestSizeNodesIndividualWiretaps();
}

//Funzione che anonimizza i dati dell'Individuo
function anonymizationNodeDetailsIndividualWiretaps(flag){

  if(flag == "yes"){

    document.querySelector(".infoIndividualWiretapsNodeSurnameContent").innerHTML = "*********";
    document.querySelector(".infoIndividualWiretapsNodeNameContent").innerHTML = "*********";
    document.querySelector(".infoIndividualWiretapsNodeBirthContent").innerHTML = "*********";
    document.querySelector(".infoIndividualWiretapsNodeNationContent").innerHTML = "*********";
    document.querySelector(".infoIndividualWiretapsNodeProvinceContent").innerHTML = "*********";
    document.querySelector(".infoIndividualWiretapsNodeResidenceContent").innerHTML = "*********";
    document.querySelector(".infoIndividualWiretapsNodeCapContent").innerHTML = "*********";
    document.querySelector(".infoIndividualWiretapsNodeAddressContent").innerHTML = "*********";
  }
  else{
    if(cyNodeDataIndividualWiretaps != "")
      document.querySelector(".infoIndividualWiretapsNodeSurnameContent").innerHTML = cyNodeDataIndividualWiretaps.surname;
      document.querySelector(".infoIndividualWiretapsNodeNameContent").innerHTML = cyNodeDataIndividualWiretaps.name;
      document.querySelector(".infoIndividualWiretapsNodeBirthContent").innerHTML = cyNodeDataIndividualWiretaps.date;
      document.querySelector(".infoIndividualWiretapsNodeNationContent").innerHTML = cyNodeDataIndividualWiretaps.nation;
      document.querySelector(".infoIndividualWiretapsNodeProvinceContent").innerHTML = cyNodeDataIndividualWiretaps.province;
      document.querySelector(".infoIndividualWiretapsNodeResidenceContent").innerHTML = cyNodeDataIndividualWiretaps.city;
      document.querySelector(".infoIndividualWiretapsNodeCapContent").innerHTML = cyNodeDataIndividualWiretaps.cap;
      document.querySelector(".infoIndividualWiretapsNodeAddressContent").innerHTML = cyNodeDataIndividualWiretaps.address;
  }
}

//Funzione che si occupa di mostrare o meno gli identificativi dei nodi e degli archi sul grafo
function checkedNodesAndEdgesIndividualWiretaps(){
  //Controlla se la checkbox dei nodi è checkata, se si mostra l'id del nodo, in caso contrario no
  if(document.querySelector("#CheckNodes").checked){
    cyIndividualWiretaps.style()
    .resetToDefault()
    .selector('node')
      .style({
        "width": "mapData(size, 0, 100, 20, 60)",
        "height": "mapData(size, 0, 100, 20, 60)",
        'background-color': '#03a74f',
        'label': 'data(id)'
      })
    .update();
  }
  else{
    cyIndividualWiretaps.style()
    .resetToDefault()
    .selector('node')
      .style({
        "width": "mapData(size, 0, 100, 20, 60)",
        "height": "mapData(size, 0, 100, 20, 60)",
        'background-color': '#03a74f'
      })
    .update();
  }

  //Fa lo stesso con gli archi
  if(document.querySelector("#CheckEdges").checked){
    cyIndividualWiretaps.style()
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
    cyIndividualWiretaps.style()
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
function checkedAnonymizationIndividualWiretaps(){
  if(document.querySelector("#CheckAnonymization").checked == true){

    if(!document.cookie.includes("anonymization"))
      document.cookie = "anonymization=yes";
    else
      setCookie("anonymization","yes");
    
      anonymizationNodeDetailsIndividualWiretaps("yes");
  }
  else{
    if(!document.cookie.includes("anonymization"))
      document.cookie = "anonymization=no";
    else
      setCookie("anonymization","no");
    
      anonymizationNodeDetailsIndividualWiretaps("no");
  }
}

//Funzione che controlla dalle checkbox della modale se il mittente o il destinatario sono già registrati
function checkedSourceAndTargetModalIndividualWiretaps(){

  if(document.querySelector("#CheckSourceExisting").checked){
    document.querySelector(".accordionSource").style.display = "none";
    document.querySelector(".modalIndividualWiretapsSource").disabled = false;
  }
  else{
    document.querySelector(".accordionSource").style.display = "block";
    document.querySelector(".modalIndividualWiretapsSource").disabled = true;
  }

  if(document.querySelector("#CheckTargetExisting").checked){
    document.querySelector(".accordionTarget").style.display = "none";
    document.querySelector(".modalIndividualWiretapsTarget").disabled = false;
  }
  else{
    document.querySelector(".accordionTarget").style.display = "block";
    document.querySelector(".modalIndividualWiretapsTarget").disabled = true;
  }

}

//Funzione che mostra i dettagli dei nodi
function showDetailsOfNodeIndividualWiretaps(data){
  document.querySelector(".infoIndividualWiretapsEdge").style.display = "none";
  document.querySelector(".infoIndividualWiretapsNot").style.display = "none";
  document.querySelector(".infoIndividualWiretapsNode").style.display = "flex";

  document.querySelector(".accordionButtonTwo").innerHTML = "Informazioni Individuo";

  document.querySelector(".infoIndividualWiretapsNodeIdContent").innerHTML = data.nodeId;

  cyNodeDataIndividualWiretaps = JSON.parse(`{
                                                "nodeId": "${data.nodeId}",
                                                "surname": "${data.cognome}",
                                                "name": "${data.nome}",
                                                "date": "${data.dataNascita}",
                                                "nation": "${data.nazioneResidenza}",
                                                "province": "${data.provinciaResidenza}",
                                                "city": "${data.cittaResidenza}",
                                                "cap": "${data.capResidenza}",
                                                "address": "${data.indirizzoResidenza}"
                                              }`);

  if(getCookie("anonymization") == "yes"){

    document.querySelector(".infoIndividualWiretapsNodeSurnameContent").innerHTML = "*********";
    document.querySelector(".infoIndividualWiretapsNodeNameContent").innerHTML = "*********";
    document.querySelector(".infoIndividualWiretapsNodeBirthContent").innerHTML = "*********";
    document.querySelector(".infoIndividualWiretapsNodeNationContent").innerHTML = "*********";
    document.querySelector(".infoIndividualWiretapsNodeProvinceContent").innerHTML = "*********";
    document.querySelector(".infoIndividualWiretapsNodeResidenceContent").innerHTML = "*********";
    document.querySelector(".infoIndividualWiretapsNodeCapContent").innerHTML = "*********";
    document.querySelector(".infoIndividualWiretapsNodeAddressContent").innerHTML = "*********";
  }
  else{
    document.querySelector(".infoIndividualWiretapsNodeSurnameContent").innerHTML = data.cognome;
    document.querySelector(".infoIndividualWiretapsNodeNameContent").innerHTML = data.nome;
    document.querySelector(".infoIndividualWiretapsNodeBirthContent").innerHTML = data.dataNascita;
    document.querySelector(".infoIndividualWiretapsNodeNationContent").innerHTML = data.nazioneResidenza;
    document.querySelector(".infoIndividualWiretapsNodeProvinceContent").innerHTML = data.provinciaResidenza;
    document.querySelector(".infoIndividualWiretapsNodeResidenceContent").innerHTML = data.cittaResidenza;
    document.querySelector(".infoIndividualWiretapsNodeCapContent").innerHTML = data.capResidenza;
    document.querySelector(".infoIndividualWiretapsNodeAddressContent").innerHTML = data.indirizzoResidenza;
  }

  if(document.querySelector("#item-details").checked == false)
    document.querySelector("#item-details").click();
}

//Funzione che mostra i dettagli degli archi
function showDetailsOfEdgeIndividualWiretaps(data){
  document.querySelector(".infoIndividualWiretapsNode").style.display = "none";
  document.querySelector(".infoIndividualWiretapsNot").style.display = "none";
  document.querySelector(".infoIndividualWiretapsEdge").style.display = "flex";

  document.querySelector(".accordionButtonTwo").innerHTML = "Informazioni Chiamata";

  document.querySelector(".infoIndividualWiretapsEdgeIdContent").innerHTML = data.edgeId;
  document.querySelector(".infoIndividualWiretapsEdgeDateContent").innerHTML = data.data;
  document.querySelector(".infoIndividualWiretapsEdgeDurationContent").innerHTML = data.durata;
  document.querySelector(".infoIndividualWiretapsEdgeTimeContent").innerHTML = data.ora;
  document.querySelector(".infoIndividualWiretapsEdgeSourceContent").innerHTML = data.sourceNodeId;
  document.querySelector(".infoIndividualWiretapsEdgeTargetContent").innerHTML = data.targetNodeId;


  document.getElementById("showContentPopup").onclick = function() {
    document.getElementById("callContent").innerText = data.contenuto; // Inserisci il contenuto della chiamata nel modal
    var contentModal = new bootstrap.Modal(document.getElementById('contentModal'), {});
    contentModal.show();
  };

  
  if(document.querySelector("#item-details").checked == false)
    document.querySelector("#item-details").click();
}

//Funzione che mostra il numero di nodi e archi presenti nel grafo
function fillPropertyAccordionIndividualWiretaps(data){
  document.querySelector(".accordionNumberNodesEdgesIndividualContent").innerHTML = data.nodes.length;
  document.querySelector(".accordionNumberNodesEdgesCallContent").innerHTML = data.edges.length;

  document.querySelector(".accordionNumberNodesEdgesNodesContent").innerHTML = data.nodes.length;
  document.querySelector(".accordionNumberNodesEdgesEdgesContent").innerHTML = data.edges.length;
}

//Funzione che inserisce nelle select della modale gli individui da scegliere se già registrati
function fillSourceAndTargetModalNewCallIndividualWiretaps(nodes){
  let selectSource = document.querySelector(".modalIndividualWiretapsSource");
  let selectTarget = document.querySelector(".modalIndividualWiretapsTarget");

  for (let i = 1; i < selectSource.length; i++){
    selectSource.remove(i);
    selectTarget.remove(i);
  }

  for (let j = 0; j < nodes.length; j++) {
    let opt = nodes[j].nodeId;
    let text = nodes[j].cognome + " " + nodes[j].nome;
    let el1;
    let el2;
    if(text == "null null"){
      el1 = new Option(opt, opt);
      el2 = new Option(opt, opt);
    }
    else{
      el1 = new Option(opt+" "+text, opt);
      el2 = new Option(opt+" "+text, opt);
    }
    selectSource.appendChild(el1);
    selectTarget.appendChild(el2);
  }
}

//Funzione che cancella i valori degli input nella modale
function fillAddModalIndividualWiretaps(){
  
  //Checkbox
  document.querySelector("#CheckSourceExisting").checked = false;
  document.querySelector("#CheckTargetExisting").checked = false;

  //Mittente
  document.querySelector(".accordionSource").style.display = "block";
  document.querySelector(".modalIndividualWiretapsSourceSurname").value = "";
  document.querySelector(".modalIndividualWiretapsSourceName").value = "";
  document.querySelector(".modalIndividualWiretapsSourceDate").value = "";
  document.querySelector(".modalIndividualWiretapsSourceNation").value = "";
  document.querySelector(".modalIndividualWiretapsSourceProvince").value = "";
  document.querySelector(".modalIndividualWiretapsSourceCity").value = "";
  document.querySelector(".modalIndividualWiretapsSourceCap").value = "";
  document.querySelector(".modalIndividualWiretapsSourceAddress").value = "";

  if(document.querySelector(".accordionSource").childNodes[1].childNodes[3].classList.contains("show")){
    document.querySelector(".accordionSource").childNodes[1].childNodes[3].classList.remove("show");
    document.querySelector(".accordionSource").childNodes[1].childNodes[1].childNodes[1].classList.add("collapsed");
  }
    
  //Destinatario
  document.querySelector(".accordionTarget").style.display = "block";
  document.querySelector(".modalIndividualWiretapsTargetSurname").value = "";
  document.querySelector(".modalIndividualWiretapsTargetName").value = "";
  document.querySelector(".modalIndividualWiretapsTargetDate").value = "";
  document.querySelector(".modalIndividualWiretapsTargetNation").value = "";
  document.querySelector(".modalIndividualWiretapsTargetProvince").value = "";
  document.querySelector(".modalIndividualWiretapsTargetCity").value = "";
  document.querySelector(".modalIndividualWiretapsTargetCap").value = "";
  document.querySelector(".modalIndividualWiretapsTargetAddress").value = "";

  if(document.querySelector(".accordionTarget").childNodes[1].childNodes[3].classList.contains("show")){
    document.querySelector(".accordionTarget").childNodes[1].childNodes[3].classList.remove("show");
    document.querySelector(".accordionTarget").childNodes[1].childNodes[1].childNodes[1].classList.add("collapsed");
  }


  //Chiamata
  document.querySelector(".modalIndividualWiretapsSource").selectedIndex = 0;
  document.querySelector(".modalIndividualWiretapsTarget").selectedIndex = 0;
  document.querySelector(".modalIndividualWiretapsSource").disabled = true;
  document.querySelector(".modalIndividualWiretapsTarget").disabled = true;
  document.querySelector(".modalIndividualWiretapsDate").value = "";
  document.querySelector(".modalIndividualWiretapsDuration").value = "";
  document.querySelector(".modalIndividualWiretapsTime").value = "";

}

//Funzione che inserisce i campi della chiamata nella modale
function fillUpdateModalCallIndividualWiretaps(){

  fillAddModalIndividualWiretaps();

  let [day, month, year] = document.querySelector(".infoIndividualWiretapsEdgeDateContent").innerHTML.split('/');
  
  //Checkbox
  document.querySelector("#CheckSourceExisting").checked = true;
  document.querySelector("#CheckTargetExisting").checked = true;

  //Mittente
  document.querySelector(".accordionSource").style.display = "none";
    
  //Destinatario
  document.querySelector(".accordionTarget").style.display = "none";


  
  //Chiamata
  document.querySelector(".modalIndividualWiretapsSource").value = document.querySelector(".infoIndividualWiretapsEdgeSourceContent").innerHTML;
  document.querySelector(".modalIndividualWiretapsTarget").value = document.querySelector(".infoIndividualWiretapsEdgeTargetContent").innerHTML;
  document.querySelector(".modalIndividualWiretapsSource").disabled = false;
  document.querySelector(".modalIndividualWiretapsTarget").disabled = false;
  document.querySelector(".modalIndividualWiretapsDate").value = `${year}-${month}-${day}`;
  document.querySelector(".modalIndividualWiretapsDuration").value = document.querySelector(".infoIndividualWiretapsEdgeDurationContent").innerHTML;
  document.querySelector(".modalIndividualWiretapsTime").value = document.querySelector(".infoIndividualWiretapsEdgeTimeContent").innerHTML;
  document.querySelector(".modalIndividualWiretapsTextarea").value = document.querySelector(".infoIndividualWiretapsEdgeContentContent").innerHTML;
  editorModalTextAreaIndividualWiretaps.setData(document.querySelector(".infoIndividualWiretapsEdgeContentContent").innerHTML);
}

//Funzione che inserisce i campi dell'individuo nella modale
function fillUpdateModalIndividualIndividualWiretaps(){
  let [day, month, year] = cyNodeDataIndividualWiretaps.date.split('/');

  //Individuo
  document.querySelector(".modalIndividualWiretapsIndividualSurname").value = cyNodeDataIndividualWiretaps.surname;
  document.querySelector(".modalIndividualWiretapsIndividualName").value = cyNodeDataIndividualWiretaps.name;
  document.querySelector(".modalIndividualWiretapsIndividualDate").value = `${year}-${month}-${day}`;
  document.querySelector(".modalIndividualWiretapsIndividualNation").value = cyNodeDataIndividualWiretaps.nation;
  document.querySelector(".modalIndividualWiretapsIndividualProvince").value = cyNodeDataIndividualWiretaps.province;
  document.querySelector(".modalIndividualWiretapsIndividualCity").value = cyNodeDataIndividualWiretaps.city;
  document.querySelector(".modalIndividualWiretapsIndividualCap").value = cyNodeDataIndividualWiretaps.cap;
  document.querySelector(".modalIndividualWiretapsIndividualAddress").value = cyNodeDataIndividualWiretaps.address;

}

//Funzione che all'apertura della modale di aggiunta cambia dei campi della modale e richiama la funzione per fillare gli input
function openModalAddNewCallIndividualWiretaps(){
  document.querySelector(".modalFormAddUpdateCall").style.display = "flex";
  document.querySelector(".modalFormUpdateIndividual").style.display = "none";
  document.querySelector("#modalIndividualWiretapsLabel").innerHTML = "Inserimento nuova intercettazione telefonica";

  fillAddModalIndividualWiretaps();

  //è stato messo qua e non dentro fillAllModalIndividualWiretaps() in quanto da problemi quando voglio fillare nella modifica, non prendendo il comando successivo, ma solo il seguente
  editorModalTextAreaIndividualWiretaps.setData("");
}

//Funzione che all'apertura della modale di modifica cambia dei campi della modale e richiama la funzione per fillare gli input
function openModalUpdateCallIndividualWiretaps(){
  document.querySelector(".modalFormAddUpdateCall").style.display = "flex";
  document.querySelector(".modalFormUpdateIndividual").style.display = "none";
  document.querySelector("#modalIndividualWiretapsLabel").innerHTML = "Modifica intercettazione telefonica";

  fillUpdateModalCallIndividualWiretaps();
}

//Funzione che all'apertura della modale di conferma eliminazione cambia i campi per la chiamata
function openModalDeleteCallIndividualWiretaps(){
  document.querySelector("#modalDeleteIndividualWiretapsLabel").innerHTML = "Cancellazione intercettazione telefonica";
  document.querySelector(".modalDeleteIndividualWiretapsBody").innerHTML = "Sei sicuro di voler cancellare questa chiamata? Verranno cancellati solamente i dati dell'intercettazione lasciando invariati i dati degli individui";
}

//Funzione che all'apertura della modale di modifica cambia dei campi della modale e richiama la funzione per fillare gli input
function openModalUpdateIndividualIndividualWiretaps(){
  document.querySelector(".modalFormAddUpdateCall").style.display = "none";
  document.querySelector(".modalFormUpdateIndividual").style.display = "flex";
  document.querySelector("#modalIndividualWiretapsLabel").innerHTML = "Modifica individuo";

  fillUpdateModalIndividualIndividualWiretaps();
}

//Funzione che all'apertura della modale di conferma eliminazione cambia i campi per l'individuo
function openModalDeleteIndividualIndividualWiretaps(){
  document.querySelector("#modalDeleteIndividualWiretapsLabel").innerHTML = "Cancellazione individuo";
  document.querySelector(".modalDeleteIndividualWiretapsBody").innerHTML = "Sei sicuro di voler cancellare questo individuo?";
}

//Funzione che manda al backend una nuova chiamata da inserire (e enventualmente i nuovi individui)
function sendNewCallToBackendIndividualWiretaps(){

  let [year, month, day] = "";

  let json = `{`;

  if(!document.querySelector("#CheckSourceExisting").checked){
    [year, month, day] = document.querySelector(".modalIndividualWiretapsSourceDate").value.split('-');

    json += ` "source" : {
                            "cognome": "${document.querySelector(".modalIndividualWiretapsSourceSurname").value}",
                            "nome": "${document.querySelector(".modalIndividualWiretapsSourceName").value}",
                            "dataNascita": "${day}/${month}/${year}",
                            "nazioneResidenza": "${document.querySelector(".modalIndividualWiretapsSourceNation").value}",
                            "provinciaResidenza": "${document.querySelector(".modalIndividualWiretapsSourceProvince").value}",
                            "cittaResidenza": "${document.querySelector(".modalIndividualWiretapsSourceCity").value}",
                            "indirizzoResidenza": "${document.querySelector(".modalIndividualWiretapsSourceAddress").value}",
                            "capResidenza":"${document.querySelector(".modalIndividualWiretapsSourceCap").value}"
                          },
            `;
  }
  else{
    json += ` "source" : {
        "nodeId": "${document.querySelector(".modalIndividualWiretapsSource").value}"
      },
    `;
  }

  if(!document.querySelector("#CheckTargetExisting").checked){
    [year, month, day] = document.querySelector(".modalIndividualWiretapsTargetDate").value.split('-');
    
    json += ` "target" : {
                            "cognome": "${document.querySelector(".modalIndividualWiretapsTargetSurname").value}",
                            "nome": "${document.querySelector(".modalIndividualWiretapsTargetName").value}",
                            "dataNascita": "${day}/${month}/${year}",
                            "nazioneResidenza": "${document.querySelector(".modalIndividualWiretapsTargetNation").value}",
                            "provinciaResidenza": "${document.querySelector(".modalIndividualWiretapsTargetProvince").value}",
                            "cittaResidenza": "${document.querySelector(".modalIndividualWiretapsTargetCity").value}",
                            "indirizzoResidenza": "${document.querySelector(".modalIndividualWiretapsTargetAddress").value}",
                            "capResidenza":"${document.querySelector(".modalIndividualWiretapsTargetCap").value}"
                          },
            `;
  }
  else{
    json += ` "target" : {
        "nodeId": "${document.querySelector(".modalIndividualWiretapsTarget").value}"
      },
    `;
  }

  [year, month, day] = document.querySelector(".modalIndividualWiretapsDate").value.split('-');
  
  if(document.querySelector("#CheckSourceExisting").checked && document.querySelector("#CheckTargetExisting").checked){
    if(document.querySelector(".modalIndividualWiretapsSource").value != document.querySelector(".modalIndividualWiretapsTarget").value){
      
      json += `  "call" : {
                            "sourceId": "${document.querySelector(".modalIndividualWiretapsSource").value}",
                            "targetiD": "${document.querySelector(".modalIndividualWiretapsTarget").value}",
                            "date": "${day}/${month}/${year}",
                            "duration": "${document.querySelector(".modalIndividualWiretapsDuration").value}",
                            "time": "${document.querySelector(".modalIndividualWiretapsTime").value}",
                            "content": "${editorModalTextAreaIndividualWiretaps.getData().replace(/\n/g,"")}"
                          }
      `;
    }
  }
  else{
    json += `  "call" : {`;

    if(document.querySelector("#CheckSourceExisting").checked) 
    json += `
              "sourceId": "${document.querySelector(".modalIndividualWiretapsSource").value}",
            `;
    
    if(document.querySelector("#CheckTargetExisting").checked)
    json += `
              "targetId": "${document.querySelector(".modalIndividualWiretapsTarget").value}",
            `;
  
    json += `
              "date": "${day}/${month}/${year}",
              "duration": "${document.querySelector(".modalIndividualWiretapsDuration").value}",
              "time": "${document.querySelector(".modalIndividualWiretapsTime").value}",
              "content": "${editorModalTextAreaIndividualWiretaps.getData().replace(/\n/g,"")}"
            }
    `;
  }

  json += `}`;

  console.log(json)
  
  fetch("/CrimeMiner/individuoIntercettazione/creaIntercettazione/", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(json)
  })
  .then(response => {
    if (response.ok) {
      viewToastMessage("Registrazione Chiamata", "Registrazione avvenuta con successo.", "success");
      returnToCreationPageIndividualWiretaps();
    } else {
      viewToastMessage("Registrazione Chiamata", "Errore nella registrazione della chiamata.", "error");
    }
  })
  .catch(error => {
    console.error(error);
  });

}

//Funzione che manda al backend i dati da aggiornare della chiamata
function sendUpdateCallToBackendIndividualWiretaps(){
  let json = `{`;

  if(!document.querySelector("#CheckSourceExisting").checked){
    [year, month, day] = document.querySelector(".modalIndividualWiretapsSourceDate").value.split('-');

    json += ` "source" : {
                            "cognome": "${document.querySelector(".modalIndividualWiretapsSourceSurname").value}",
                            "nome": "${document.querySelector(".modalIndividualWiretapsSourceName").value}",
                            "dataNascita": "${day}/${month}/${year}",
                            "nazioneResidenza": "${document.querySelector(".modalIndividualWiretapsSourceNation").value}",
                            "provinciaResidenza": "${document.querySelector(".modalIndividualWiretapsSourceProvince").value}",
                            "cittaResidenza": "${document.querySelector(".modalIndividualWiretapsSourceCity").value}",
                            "indirizzoResidenza": "${document.querySelector(".modalIndividualWiretapsSourceAddress").value}",
                            "capResidenza":"${document.querySelector(".modalIndividualWiretapsSourceCap").value}"
                          },
            `;
  }
  else{
    json += ` "source" : {
        "nodeId": "${document.querySelector(".modalIndividualWiretapsSource").value}"
      },
    `;
  }

  if(!document.querySelector("#CheckTargetExisting").checked){
    [year, month, day] = document.querySelector(".modalIndividualWiretapsTargetDate").value.split('-');
    
    json += ` "target" : {
                            "cognome": "${document.querySelector(".modalIndividualWiretapsTargetSurname").value}",
                            "nome": "${document.querySelector(".modalIndividualWiretapsTargetName").value}",
                            "dataNascita": "${day}/${month}/${year}",
                            "nazioneResidenza": "${document.querySelector(".modalIndividualWiretapsTargetNation").value}",
                            "provinciaResidenza": "${document.querySelector(".modalIndividualWiretapsTargetProvince").value}",
                            "cittaResidenza": "${document.querySelector(".modalIndividualWiretapsTargetCity").value}",
                            "indirizzoResidenza": "${document.querySelector(".modalIndividualWiretapsTargetAddress").value}",
                            "capResidenza":"${document.querySelector(".modalIndividualWiretapsTargetCap").value}"
                          },
            `;
  }
  else{
    json += ` "target" : {
        "nodeId": "${document.querySelector(".modalIndividualWiretapsTarget").value}"
      },
    `;
  }

  [year, month, day] = document.querySelector(".modalIndividualWiretapsDate").value.split('-');

  if(document.querySelector("#CheckSourceExisting").checked && document.querySelector("#CheckTargetExisting").checked){
    if(document.querySelector(".modalIndividualWiretapsSource").value != document.querySelector(".modalIndividualWiretapsTarget").value){
      
      json += `  "call" : {
                            "edgeId": "${document.querySelector(".infoIndividualWiretapsEdgeIdContent").innerHTML}",
                            "sourceId": "${document.querySelector(".modalIndividualWiretapsSource").value}",
                            "targetiD": "${document.querySelector(".modalIndividualWiretapsTarget").value}",
                            "date": "${day}/${month}/${year}",
                            "duration": "${document.querySelector(".modalIndividualWiretapsDuration").value}",
                            "time": "${document.querySelector(".modalIndividualWiretapsTime").value}",
                            "content": "${editorModalTextAreaIndividualWiretaps.getData().replace(/\n/g,"")}"
                          }
      `;
    }
  }
  else{
    json += `  "call" : {
                          "edgeId": "${document.querySelector(".infoIndividualWiretapsEdgeIdContent").innerHTML}",
        `;

    if(document.querySelector("#CheckSourceExisting").checked) 
    json += `
              "sourceId": "${document.querySelector(".modalIndividualWiretapsSource").value}",
            `;
    
    if(document.querySelector("#CheckTargetExisting").checked)
    json += `
              "targetId": "${document.querySelector(".modalIndividualWiretapsTarget").value}",
            `;
  
    json += `
              "date": "${day}/${month}/${year}",
              "duration": "${document.querySelector(".modalIndividualWiretapsDuration").value}",
              "time": "${document.querySelector(".modalIndividualWiretapsTime").value}",
              "content": "${editorModalTextAreaIndividualWiretaps.getData().replace(/\n/g,"")}"
            }
    `;
  }

  json += `}`;
  
  fetch("/CrimeMiner/individuoIntercettazione/modificaIntInd/", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(json)
  })
  .then(response => {
    if (response.ok) {
      viewToastMessage("Modifica Chiamata", "Modifica avvenuta con successo.", "success");
      returnToCreationPageIndividualWiretaps()
    } else {
      viewToastMessage("Modifica Chiamata", "Errore nella modifica della chiamata.", "error");
    }
  })
  .catch(error => {
    console.error(error);
  });

  viewToastMessage("Modifica Chiamata", "Modifica avvenuta con successo.", "success");  
}

//Funzione che manda al backend i dati da aggiornare dell'individuo
function sendUpdateIndividualToBackendIndividualWiretaps(){
  let json;

  json = `{
            "nodeId": "${document.querySelector(".infoIndividualWiretapsNodeIdContent").innerHTML}",
            "surname": "${document.querySelector(".modalIndividualWiretapsIndividualSurname").value}",
            "name": "${document.querySelector(".modalIndividualWiretapsIndividualName").value}",
            "date": "${document.querySelector(".modalIndividualWiretapsIndividualDate").value}",
            "nation": "${document.querySelector(".modalIndividualWiretapsIndividualNation").value}",
            "province": "${document.querySelector(".modalIndividualWiretapsIndividualProvince").value}",
            "city": "${document.querySelector(".modalIndividualWiretapsIndividualCity").value}",
            "address": "${document.querySelector(".modalIndividualWiretapsIndividualAddress").value}",
            "cap":"${document.querySelector(".modalIndividualWiretapsIndividualCap").value}"
          }`;
  
  fetch("/CrimeMiner/individuo/modificaIndividuo/", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(json)
  })
  .then(response => {
    if (response.ok) {
      viewToastMessage("Modifica Chiamata", "Modifica avvenuta con successo.", "success");
      returnToCreationPageIndividualWiretaps()
    } else {
      viewToastMessage("Modifica Chiamata", "Errore nella modifica della chiamata.", "error");
    }
  })
  .catch(error => {
    console.error(error);
  });

  viewToastMessage("Modifica Chiamata", "Modifica avvenuta con successo.", "success");  
}

//Funzione che invia al backend l'individuo da cancellare
function deleteNodeIndividualWiretaps(){

  let json = `{
              "nodeId": "${document.querySelector(".infoIndividualWiretapsNodeIdContent").innerHTML}"
  }`;

  fetch("/CrimeMiner/individuo/eliminaIndividuo/", { 
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(json)
  })
  .then(response => {
    if (response.ok) {
      viewToastMessage("Cancellazione Individuo", "Cancellazione avvenuta con successo.", "success");
      returnToCreationPageIndividualWiretaps()
    } else {
      viewToastMessage("Cancellazione Individuo", "Errore nella cancellazione dell'individuo'.", "error");
    }
  })
  .catch(error => {
    console.error(error);
  });

  viewToastMessage("Cancellazione Individuo", "Cancellazione avvenuta con successo.", "success");
}

//Funzione che invia al backend la chiamata da cancellare
function deleteEdgeIndividualWiretaps(){

  let json = `{
      "edgeId": "${document.querySelector(".infoIndividualWiretapsEdgeIdContent").innerHTML}"
  }`;

  fetch("/CrimeMiner/individuoIntercettazione/eliminaIntInd/", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(json)
  })
  .then(response => {
    if (response.ok) {
      viewToastMessage("Cancellazione Chiamata", "Cancellazione avvenuta con successo.", "success");
      returnToCreationPageIndividualWiretaps()
    } else {
      viewToastMessage("Cancellazione Chiamata", "Errore nella cancellazione della chiamata.", "error");
    }
  })
  .catch(error => {
    console.error(error);
  });

  viewToastMessage("Cancellazione Chiamata", "Cancellazione avvenuta con successo.", "success");
}

//Funzione che decide se devo richiamare la funzione di aggiunta di una chiamata (compresa di due nuovi individui se inseriti) o di modifica di un individuo o modifica di una chiamata
function selectFunctionToRegisterDateIndividualWiretaps(){
  if(document.querySelector("#modalIndividualWiretapsLabel").innerHTML == "Inserimento nuova intercettazione telefonica")
    if(inputControlIndividualWiretaps() == true) 
      sendNewCallToBackendIndividualWiretaps();

  if(document.querySelector("#modalIndividualWiretapsLabel").innerHTML == "Modifica intercettazione telefonica")
    if(inputControlIndividualWiretaps() == true)  
      sendUpdateCallToBackendIndividualWiretaps();

  if(document.querySelector("#modalIndividualWiretapsLabel").innerHTML == "Modifica individuo")
    if(inputControlIndividualWiretapsUpdateInd() == true)
      sendUpdateIndividualToBackendIndividualWiretaps();
}

//Funzione che decide se devo richiamare la funzione di cancellazione di un individuo o una chiamata
function selectFunctionToDeleteDateIndividualWiretaps(){
  if(document.querySelector("#modalDeleteIndividualWiretapsLabel").innerHTML == "Cancellazione individuo")
    deleteNodeIndividualWiretaps();

  if(document.querySelector("#modalDeleteIndividualWiretapsLabel").innerHTML == "Cancellazione intercettazione telefonica")
    deleteEdgeIndividualWiretaps();
}

//Funzione di ricaricamento della pagina quando creo, modifico o cancello dati nel grafo
function returnToCreationPageIndividualWiretaps(){

  document.querySelector(".btnCloseModalAddUpdate").click();
  document.querySelector(".btnCloseModalDelete").click();

  //Funzione che fa partire il caricamento
  loadPage(500);
  requestAllNodesIndividualWiretaps();
  checkedSourceAndTargetModalIndividualWiretaps();

  //Comando che fa aprire all'avvio della pagina l'accordion delle proprietà
  if(document.querySelector("#item-properties").checked == false)
    document.querySelector("#item-properties").click();

  if(document.querySelector("#item-details").checked == true){
    document.querySelector(".infoIndividualWiretapsEdge").style.display = "none";
    document.querySelector(".infoIndividualWiretapsNode").style.display = "none";
    document.querySelector(".infoIndividualWiretapsNot").style.display = "flex";

    document.querySelector(".accordionButtonTwo").innerHTML = "Dettagli";
    document.querySelector("#item-details").click();
  } 

  if(document.querySelector("#item-settings").checked == true)
    document.querySelector("#item-settings").click();

  //Controllo se devo anonimizzare i dati
  if(getCookie("anonymization") == "yes")
    document.querySelector("#CheckAnonymization").checked = true;
}

//Funzione che controlla se gli input nei form di creazione sono vuoti
function inputControlIndividualWiretaps(){
  let value = true;

  if(!document.querySelector("#CheckSourceExisting").checked){
    
    if(document.querySelector(".modalIndividualWiretapsSourceSurname").value == ""){
      document.querySelector(".modalIndividualWiretapsSourceSurname").style.borderColor = 'red';
      value = false;
    }
    else
      document.querySelector(".modalIndividualWiretapsSourceSurname").style.borderColor = 'green';

    if(document.querySelector(".modalIndividualWiretapsSourceName").value == ""){
      document.querySelector(".modalIndividualWiretapsSourceName").style.borderColor = 'red';
      value = false;
    }
    else
      document.querySelector(".modalIndividualWiretapsSourceName").style.borderColor = 'green';

  }else{
    if(document.querySelector(".modalIndividualWiretapsSource").value == ""){
      document.querySelector(".modalIndividualWiretapsSource").style.borderColor = 'red';
      value = false;
    }
    else
      document.querySelector(".modalIndividualWiretapsSource").style.borderColor = 'green';
  }

  if(!document.querySelector("#CheckTargetExisting").checked){
  
    if(document.querySelector(".modalIndividualWiretapsTargetSurname").value == ""){
      document.querySelector(".modalIndividualWiretapsTargetSurname").style.borderColor = 'red';
      value = false;
    }
    else
      document.querySelector(".modalIndividualWiretapsTargetSurname").style.borderColor = 'green';

    if(document.querySelector(".modalIndividualWiretapsTargetName").value == ""){
      document.querySelector(".modalIndividualWiretapsTargetName").style.borderColor = 'red';
      value = false;
    }
    else
      document.querySelector(".modalIndividualWiretapsTargetName").style.borderColor = 'green';

  }else{
    if(document.querySelector(".modalIndividualWiretapsTarget").value == ""){
      document.querySelector(".modalIndividualWiretapsTarget").style.borderColor = 'red';
      value = false;
    }
    else
      document.querySelector(".modalIndividualWiretapsTarget").style.borderColor = 'green';
  }

  return value;
}

//Funzione che controlla se gli input nei form di aggiornamento sono vuoti
function inputControlIndividualWiretapsUpdateInd(){
  let value = true;
  
  if(document.querySelector(".modalIndividualWiretapsIndividualSurname").value == ""){
    document.querySelector(".modalIndividualWiretapsIndividualSurname").style.borderColor = 'red';
    value = false;
  }
  else
    document.querySelector(".modalIndividualWiretapsIndividualSurname").style.borderColor = 'green';

  if(document.querySelector(".modalIndividualWiretapsIndividualName").value == ""){
    document.querySelector(".modalIndividualWiretapsIndividualName").style.borderColor = 'red';
    value = false;
  }
  else
    document.querySelector(".modalIndividualWiretapsIndividualName").style.borderColor = 'green';

  return value;
}



/* FUNZIONE PER AGGIORNARE IL GRAFO IN BASE AI 2 INPUT DATE */
function getGraphByDates(){
  
  let dateFrom=document.formDates.date_from.value;
  let dateTo=document.formDates.date_to.value;
  
  let path="/CrimeMiner/individuoIntercettazione/getGraph_IndividuiIntercettazioneTel_by_Dates/"+dateFrom+","+dateTo;
  fetch(path, { method: "GET"
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
    createGraphIndividualWiretaps(data.result);
    fillPropertyAccordionIndividualWiretaps(data.result);
    //requestAllNodesModalIndividualEnviromentalTapping();
  })
  .catch(error => {
    console.error(error);
  });
}



// Genera i mesi tra due date nel formato ANNO-MESE
function generateMonths(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const months = [];
  
  while (start <= end) {
    const year = start.getFullYear();
    const month = String(start.getMonth() + 1).padStart(2, '0'); // Aggiunge uno zero ai mesi singoli
    months.push(`${year}-${month}`);
    start.setMonth(start.getMonth() + 1);
  }
  
  return months;
}

// Calcola posizione in percentuale
function calculatePosition(monthIndex) {
  return (monthIndex / (totalMonths - 1)) * 100;
}

// Aggiorna le date visualizzate
function updateDates() {
  const leftIndex = Math.round((parseFloat(leftSelector.style.left) / 100) * (totalMonths - 1));
  const rightIndex = Math.round((parseFloat(rightSelector.style.left) / 100) * (totalMonths - 1));

  startDateDisplay.textContent = months[leftIndex];
  endDateDisplay.textContent = months[rightIndex];
}

// Gestione drag per i selector
function makeDraggable(selector, isLeftSelector) {
  let isDragging = false;

  // Avvia il trascinamento
  selector.addEventListener('pointerdown', (event) => {
    isDragging = true;
    document.body.style.cursor = 'grabbing';
  });

  // Gestione dello spostamento durante il trascinamento
  document.addEventListener('pointermove', (event) => {
    if (!isDragging) return;

    const timelineRect = timeline.getBoundingClientRect();
    let position = ((event.clientX - timelineRect.left) / timelineRect.width) * 100;

    // Limita la posizione all'interno della timeline
    position = Math.max(0, Math.min(position, 100));

    if (isLeftSelector) {
      const rightPosition = parseFloat(rightSelector.style.left);
      position = Math.min(position, rightPosition - 2); // Evita sovrapposizioni
    } else {
      const leftPosition = parseFloat(leftSelector.style.left);
      position = Math.max(position, leftPosition + 2);
    }

    // Aggiorna la posizione del selettore
    selector.style.left = `${position}%`;

    // Aggiorna le date nella UI in tempo reale
    updateDates();
  });

  // Rilascia il cursore: aggiorna grafo
  document.addEventListener('pointerup', () => {
    if (isDragging) {
      reloadGraphSliderTemp(); // Aggiorna il grafo solo al rilascio
    }

    isDragging = false;
    document.body.style.cursor = 'default';
  });
}
// Funzione per ottenere il nome del mese in formato abbreviato (3 lettere)
function getMonthName(monthIndex) {
  const months = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
  return months[monthIndex];
}

// Genera le etichette delle date in punti specifici
function createDateLabels() {
  const lineElement = document.querySelector('.line');
  const interval = 3; // Numero di mesi tra un'etichetta e l'altra (modificato a 3)

  months.forEach((month, index) => {
    if (index % interval === 0 || index === months.length - 1) {
      const label = document.createElement('div');
      label.className = 'date-label';

      // Estrai il mese e l'anno
      const date = new Date(month + '-01'); // Crea una data per il mese specificato
      const monthName = getMonthName(date.getMonth()); // Nome del mese in 3 lettere
      const year = date.getFullYear().toString().slice(-2); // Ultime 2 cifre dell'anno

      // Format: "Mese/Anno"
      label.textContent = `${monthName}/${year}`;

      // Alterna la posizione sopra e sotto la timeline
      if ((index / interval) % 2 === 0) {
        label.classList.add('above');
      } else {
        label.classList.add('below');
      }

      const positionPercent = calculatePosition(index);
      label.style.left = `${positionPercent}%`;

      lineElement.appendChild(label);
    }
  });
}

// Aggiungi le linee verticali "|" per ogni mese nello sliderTemporale
function addVerticalLines() {
  const lineElement = document.querySelector('.line');
  
  months.forEach((month, index) => {
    if (index === 0 || index === months.length - 1) return;

    const verticalLine = document.createElement('div');
    verticalLine.className = 'vertical-line';

    const positionPercent = calculatePosition(index);
    verticalLine.style.left = `${positionPercent}%`;

    // Aumenta l'altezza delle linee verticali in corrispondenza delle etichette
    const labelPosition = index % 3 === 0 ? 30 : 10; // 30px più grande per le etichette
    verticalLine.style.height = index % 3 === 0 ? '12px' : '6px'; // Maggiore altezza quando c'è l'etichetta

    lineElement.appendChild(verticalLine);
  });
}

function reloadGraphSliderTemp(){
  startDate = document.getElementById('start-date').textContent;
  endDate = document.getElementById('end-date').textContent;

  let path="/CrimeMiner/individuoIntercettazione/getGraph_IndividuiIntercettazioneTel_by_Dates/"+startDate+","+endDate;
  fetch(path, { method: "GET"
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
    createGraphIndividualWiretaps(data.result);
    fillPropertyAccordionIndividualWiretaps(data.result);
    //requestAllNodesModalIndividualWiretaps();
  })
  .catch(error => {
    console.error(error);
  });
}