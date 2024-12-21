//funzione che permette di ruotare la freccia dei sottomenu scambiando due classi inserite nell'scss
document.addEventListener('DOMContentLoaded', function() {
    let navLinks = document.querySelectorAll('.sidebar-nav-link');

    navLinks.forEach(function(navLink) {
        navLink.addEventListener('click', function() {
            if(navLink.querySelector('.sidebarIconArrow').classList.contains('sidebarIconToggleRight'))
                navLink.querySelector('.sidebarIconArrow').classList.replace('sidebarIconToggleRight','sidebarIconToggleDown');
            else
                navLink.querySelector('.sidebarIconArrow').classList.replace('sidebarIconToggleDown','sidebarIconToggleRight');
        });
    });
});

function toggleDropdown() {
    const dropdown = document.querySelector('.sidebarFirst');
    dropdown.classList.toggle('open');
}

function toggleDropdown2() {
    const dropdown = document.querySelector('.sidebarSecond');
    dropdown.classList.toggle('open');
}

function toggleDropdown3() {
    const dropdown = document.querySelector('.sidebarThird');
    dropdown.classList.toggle('open');
}

function toggleDropdown4() {
    const dropdown = document.querySelector('.sidebarFourth');
    dropdown.classList.toggle('open');
}

/*CREAZIONI GRAFICI PER CAMBIARE IL LAYOUT */

let cyIndividualWiretaps;
let cyIndividualEnviromentalTapping;
let cyIndividualCrimes;

/*INTERCETTAZIONI TELEFONICHE*/
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

/*CRIMINI*/
function createGraphIndividualCrimes(data) {

    //Creazione del grafico con assegnazione alla variabile
    cyIndividualCrimes = cytoscape({
      container: document.querySelector('.cyContent'),
      elements: data, //Questi sono i dati ricevuti dal backend, preformattati come vuole la libreria
      style: [ // Stile dei nodi e degli archi
        {
          selector: '.Individuo',
          style: {
            "width": "mapData(size, 0, 100, 20, 60)",
            "height": "mapData(size, 0, 100, 20, 60)",
            'background-color': '#03a74f',
            'label': 'data(id)'
          }
        },
        {
          selector: '.Reato',
          style: {
            "width": "mapData(size, 0, 100, 20, 60)",
            "height": "mapData(size, 0, 100, 20, 60)",
            'background-color': '#c70c35',
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
        },
      ],
      layout: {
        name: 'fcose', //dagre  //circle
        spacingFactor: 2,
        animate: true,
        animationDuration: 2000
      },
      minZoom: 0.6,
      maxZoom: 2.0
    });
  
    //Si aspetta che il grafo sia pronto per poter inserire per ogni nodo o arco un evento sul click
    cyIndividualCrimes.ready(function () {
  
      //Funzione di click per il nodo
      cyIndividualCrimes.on('tap', 'node', function(evt) {
  
        //Faccio la richiesta dei dettagli per il singolo nodo
        requestDetailsOfNodeIndividualCrimes(evt.target.id())
  
        //Controllo se prima di cliccare il nodo era stato cliccato un arco, se l'esito è positivo riporto l'arco al suo colore iniziale
        if(cyEdgeTouchedIndividualCrimes != "")
          cyIndividualCrimes.edges("#"+ cyEdgeTouchedIndividualCrimes).style('line-color', '#dfdfdf');
  
        //Controllo se prima di cliccare il nodo era stato cliccato un altro nodo, se l'esito è positivo riporto il nodo al suo colore iniziale
        if(cyNodeTouchedIndividualCrimes != "" || evt.target.classes() == undefined){
          if(cyNodeTouchedIndividualCrimes[0] == "I")
              cyIndividualCrimes.$("#"+ cyNodeTouchedIndividualCrimes).style('background-color', '#03a74f');
            else
              cyIndividualCrimes.$("#"+ cyNodeTouchedIndividualCrimes).style('background-color', '#c70c35');
        }
  
        //Inserisco il nodo corrente nella variabile e gli cambio il colore
        cyNodeTouchedIndividualCrimes = evt.target.id();
        evt.target.style('background-color', '#991199');
      });
  
      //Funzione di click per l'arco
      cyIndividualCrimes.on('tap', 'edge', function(evt) {
  
        //Faccio la richiesta dei dettagli per il singolo arco
        requestDetailsOfEdgeIndividualCrimes(evt.target.id())
  
        //Controllo se prima di cliccare l'arco era stato cliccato un nodo, se l'esito è positivo riporto il nodo al suo colore iniziale
        if(cyNodeTouchedIndividualCrimes != "" || evt.target.classes() == undefined){
          if(cyNodeTouchedIndividualCrimes[0] == "I")
              cyIndividualCrimes.$("#"+ cyNodeTouchedIndividualCrimes).style('background-color', '#03a74f');
            else
              cyIndividualCrimes.$("#"+ cyNodeTouchedIndividualCrimes).style('background-color', '#c70c35');
        }
  
        //Controllo se prima di cliccare l'arco era stato cliccato un altro arco, se l'esito è positivo riporto l'arco al suo colore iniziale
        if(cyEdgeTouchedIndividualCrimes != "" || evt.target.classes()[0] == "Individuo" || evt.target.classes()[0] == "Reato")
          cyIndividualCrimes.edges("#"+ cyEdgeTouchedIndividualCrimes).style('line-color', '#dfdfdf');
  
        //Inserisco l'arco corrente nella variabile e gli cambio il colore
        cyEdgeTouchedIndividualCrimes = evt.target.id();
        evt.target.style('line-color', '#991199');
      });
  
      //Funzione di click sul background del grafo
      cyIndividualCrimes.on('tap', function(evt) {
  
        //Controllo che sia stato effettivamente cliccata una zona diversa da nodi e archi
        if(evt.target._private.container != undefined){
  
          //In caso di esito positivo controllo se ci stavano dei nodi o degli archi selezionati e li riporto come in origine
          if(cyEdgeTouchedIndividualCrimes != ""){
            cyIndividualCrimes.$("#"+ cyEdgeTouchedIndividualCrimes).style('line-color', '#dfdfdf');
            cyEdgeTouchedIndividualCrimes = "";
          }
          if(cyNodeTouchedIndividualCrimes != ""){
            if(cyNodeTouchedIndividualCrimes[0] == "I")
              cyIndividualCrimes.$("#"+ cyNodeTouchedIndividualCrimes).style('background-color', '#03a74f');
            else
              cyIndividualCrimes.$("#"+ cyNodeTouchedIndividualCrimes).style('background-color', '#c70c35');
            cyNodeTouchedIndividualCrimes = "";
          }
        }
      });
  
      //Con questa funzione, quando passo sull'arco, cambia colore
      cyIndividualCrimes.on('mouseover', 'edge', function (event) {
        if(event.target.id() != cyEdgeTouchedIndividualCrimes)
          event.target.style('line-color', '#828282'); // Cambia il colore dell'arco al passaggio del mouse
      });
      
      //Con questa funzione, quando non sto più col mouse sull'arco, torna al colore iniziale
      cyIndividualCrimes.on('mouseout', 'edge', function (event) {
        if(event.target.id() != cyEdgeTouchedIndividualCrimes)
          event.target.style('line-color', '#dfdfdf'); // Ripristina il colore dell'arco quando il mouse esce
      });
    });
}

/*INTERCETTAZIONI AMBIENTALI*/

function createGraphIndividualEnviromentalTapping(data) {

    //Creazione del grafico con assegnazione alla variabile
    cyIndividualEnviromentalTapping = cytoscape({
      container: document.querySelector('.cyContent'),
      elements: data, //Questi sono i dati ricevuti dal backend, preformattati come vuole la libreria
      style: [ // Stile dei nodi e degli archi
        {
          selector: '.Individuo',
          style: {
            "width": "mapData(size, 0, 100, 20, 60)",
            "height": "mapData(size, 0, 100, 20, 60)",
            'background-color': '#03a74f',
            'label': 'data(id)'
          }
        },
        {
          selector: '.IntercettazioneAmb',
          style: {
            "width": "mapData(size, 0, 100, 20, 60)",
            "height": "mapData(size, 0, 100, 20, 60)",
            'background-color': '#d7bd1e',
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
        },
      ],
      layout: {
        name: 'fcose', //dagre  //circle
        spacingFactor: 3,
        animate: true,
        animationDyanimationDuration: 2000
      },
      minZoom: 0.14,
      maxZoom: 2.0
    });
  
    //Si aspetta che il grafo sia pronto per poter inserire per ogni nodo o arco un evento sul click
    cyIndividualEnviromentalTapping.ready(function () {
  
      //Funzione di click per il nodo
      cyIndividualEnviromentalTapping.on('tap', 'node', function(evt) {
  
        //Faccio la richiesta dei dettagli per il singolo nodo
        requestDetailsOfNodeIndividualEnviromentalTapping(evt.target.id())
  
        //Controllo se prima di cliccare il nodo era stato cliccato un arco, se l'esito è positivo riporto l'arco al suo colore iniziale
        if(cyEdgeTouchedIndividualEnviromentalTapping != "")
          cyIndividualEnviromentalTapping.edges("#"+ cyEdgeTouchedIndividualEnviromentalTapping).style('line-color', '#dfdfdf');
  
        //Controllo se prima di cliccare il nodo era stato cliccato un altro nodo, se l'esito è positivo riporto il nodo al suo colore iniziale
        if(cyNodeTouchedIndividualEnviromentalTapping != "" || evt.target.classes() == undefined){
          if(cyNodeTouchedIndividualEnviromentalTapping[1] == "A")
              cyIndividualEnviromentalTapping.$("#"+ cyNodeTouchedIndividualEnviromentalTapping).style('background-color', '#d7bd1e');
            else
              cyIndividualEnviromentalTapping.$("#"+ cyNodeTouchedIndividualEnviromentalTapping).style('background-color', '#03a74f');
        }
  
        //Inserisco il nodo corrente nella variabile e gli cambio il colore
        cyNodeTouchedIndividualEnviromentalTapping = evt.target.id();
        evt.target.style('background-color', '#991199');
      });
  
      //Funzione di click per l'arco
      cyIndividualEnviromentalTapping.on('tap', 'edge', function(evt) {
  
        //Faccio la richiesta dei dettagli per il singolo arco
        requestDetailsOfEdgeIndividualEnviromentalTapping(evt.target.id());
  
        //Controllo se prima di cliccare l'arco era stato cliccato un nodo, se l'esito è positivo riporto il nodo al suo colore iniziale
        if(cyNodeTouchedIndividualEnviromentalTapping != "" || evt.target.classes() == undefined){
          if(cyNodeTouchedIndividualEnviromentalTapping[1] == "A")
              cyIndividualEnviromentalTapping.$("#"+ cyNodeTouchedIndividualEnviromentalTapping).style('background-color', '#d7bd1e');
            else
              cyIndividualEnviromentalTapping.$("#"+ cyNodeTouchedIndividualEnviromentalTapping).style('background-color', '#03a74f');
        }
        
        //Controllo se prima di cliccare l'arco era stato cliccato un altro arco, se l'esito è positivo riporto l'arco al suo colore iniziale
        if(cyEdgeTouchedIndividualEnviromentalTapping != "" || evt.target.classes()[0] == "Individuo" || evt.target.classes()[0] == "IntercettazioneAmb")
          cyIndividualEnviromentalTapping.edges("#"+ cyEdgeTouchedIndividualEnviromentalTapping).style('line-color', '#dfdfdf');
  
        //Inserisco l'arco corrente nella variabile e gli cambio il colore
        cyEdgeTouchedIndividualEnviromentalTapping = evt.target.id();
        evt.target.style('line-color', '#991199');
      });
  
      //Funzione di click sul background del grafo
      cyIndividualEnviromentalTapping.on('tap', function(evt) {
  
        //Controllo che sia stato effettivamente cliccata una zona diversa da nodi e archi
        if(evt.target._private.container != undefined){
  
          //In caso di esito positivo controllo se ci stavano dei nodi o degli archi selezionati e li riporto come in origine
          if(cyEdgeTouchedIndividualEnviromentalTapping != ""){
            cyIndividualEnviromentalTapping.$("#"+ cyEdgeTouchedIndividualEnviromentalTapping).style('line-color', '#dfdfdf');
            cyEdgeTouchedIndividualEnviromentalTapping = "";
          }
          if(cyNodeTouchedIndividualEnviromentalTapping != ""){
            if(cyNodeTouchedIndividualEnviromentalTapping[1] == "A")
              cyIndividualEnviromentalTapping.$("#"+ cyNodeTouchedIndividualEnviromentalTapping).style('background-color', '#d7bd1e');
            else
              cyIndividualEnviromentalTapping.$("#"+ cyNodeTouchedIndividualEnviromentalTapping).style('background-color', '#03a74f');
            cyNodeTouchedIndividualEnviromentalTapping = "";
          }
        }
      });
  
      //Con questa funzione, quando passo sull'arco, cambia colore
      cyIndividualEnviromentalTapping.on('mouseover', 'edge', function (event) {
        if(event.target.id() != cyEdgeTouchedIndividualEnviromentalTapping)
          event.target.style('line-color', '#828282'); // Cambia il colore dell'arco al passaggio del mouse
      });
      
      //Con questa funzione, quando non sto più col mouse sull'arco, torna al colore iniziale
      cyIndividualEnviromentalTapping.on('mouseout', 'edge', function (event) {
        if(event.target.id() != cyEdgeTouchedIndividualEnviromentalTapping)
          event.target.style('line-color', '#dfdfdf'); // Ripristina il colore dell'arco quando il mouse esce
      });
    });
}

/*CAMBIA LAYOUT DEL GRAFO*/

function changeGraphLayout() {
    const layoutType = document.querySelector(".selectLayout").value;

    if (layoutType === 'circle') {
        loadPage(2500);

        try {
            cyIndividualWiretaps.layout({
                name: 'circle',
                animate: true,
                animationDuration: 2000
            }).run();
        } catch (error) {

        }

        try {
            cyIndividualEnviromentalTapping.layout({
                name: 'circle',
                animate: true,
                animationDuration: 2000
            }).run();
        } catch (error) {

        }

        try {
            cyIndividualCrimes.layout({
                name: 'circle',
                animate: true,
                animationDuration: 2000
            }).run();
        } catch (error) {

        }

    } else if (layoutType === 'dagre') {
        loadPage(7500);

        try {
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
        } catch (error) {

        }

        try {
            cyIndividualEnviromentalTapping.layout({
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
        } catch (error) {

        }

        try {
            cyIndividualCrimes.layout({
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
        } catch (error) {

        }

    } else if (layoutType === 'fcose') {
        loadPage(3000);

        try {
            cyIndividualWiretaps.layout({
                name: 'fcose',
                spacingFactor: 3,
                animate: true,
                animationDuration: 2000
            }).run();
        } catch (error) {

        }

        try {
            cyIndividualEnviromentalTapping.layout({
                name: 'fcose',
                spacingFactor: 3,
                animate: true,
                animationDuration: 2000
            }).run();
        } catch (error) {

        }

        try {
            cyIndividualCrimes.layout({
                name: 'fcose',
                spacingFactor: 3,
                animate: true,
                animationDuration: 2000
            }).run();
        } catch (error) {

        }
    }
}

//Funzione che si occupa di mostrare o meno gli identificativi dei nodi e degli archi sul grafo
function checkedNodesAndEdges(){
    try {
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
        } else {
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
    } catch (error) {
    }

    try {
        if(document.querySelector("#CheckNodes").checked){
            cyIndividualCrimes.style()
            .resetToDefault()
            .selector('.Individuo')
                .style({
                    "width": "mapData(size, 0, 100, 20, 60)",
                    "height": "mapData(size, 0, 100, 20, 60)",
                    'background-color': '#03a74f',
                    'label': 'data(id)'
                })
            .selector('.Reato')
                .style({
                    "width": "mapData(size, 0, 100, 20, 60)",
                    "height": "mapData(size, 0, 100, 20, 60)",
                    'background-color': '#c70c35',
                    'label': 'data(id)'
                })
            .update();
        } else {
            cyIndividualCrimes.style()
            .resetToDefault()
            .selector('.Individuo')
                .style({
                    "width": "mapData(size, 0, 100, 20, 60)",
                    "height": "mapData(size, 0, 100, 20, 60)",
                    'background-color': '#03a74f'
                })
            .selector('.Reato')
                .style({
                    "width": "mapData(size, 0, 100, 20, 60)",
                    "height": "mapData(size, 0, 100, 20, 60)",
                    'background-color': '#c70c35'
                })
            .update();
        }
    } catch (error) {
    }

    try {
        if(document.querySelector("#CheckNodes").checked){
            cyIndividualEnviromentalTapping.style()
            .resetToDefault()
            .selector('.Individuo')
                .style({
                    "width": "mapData(size, 0, 100, 20, 60)",
                    "height": "mapData(size, 0, 100, 20, 60)",
                    'background-color': '#03a74f',
                    'label': 'data(id)'
                })
            .selector('.IntercettazioneAmb')
                .style({
                    "width": "mapData(size, 0, 100, 20, 60)",
                    "height": "mapData(size, 0, 100, 20, 60)",
                    'background-color': '#d7bd1e',
                    'label': 'data(id)'
                })
            .update();
        } else {
            cyIndividualEnviromentalTapping.style()
            .resetToDefault()
            .selector('.Individuo')
                .style({
                    "width": "mapData(size, 0, 100, 20, 60)",
                    "height": "mapData(size, 0, 100, 20, 60)",
                    'background-color': '#03a74f'
                })
            .selector('.IntercettazioneAmb')
                .style({
                    "width": "mapData(size, 0, 100, 20, 60)",
                    "height": "mapData(size, 0, 100, 20, 60)",
                    'background-color': '#d7bd1e'
                })
            .update();
        }
    } catch (error) {
    }

    // Fa lo stesso con gli archi
    try {
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
        } else {
            cyIndividualWiretaps.style()
            .selector('edge')
                .style({
                    'width': 2,
                    'line-color': '#dfdfdf',
                    "curve-style": "bezier"
                })
            .update();
        }
    } catch (error) {
    }

    try {
        if(document.querySelector("#CheckEdges").checked){
            cyIndividualCrimes.style()
            .selector('edge')
                .style({
                    'width': 2,
                    'line-color': '#dfdfdf',
                    "curve-style": "bezier",
                    'label': 'data(id)'
                })
            .update();
        } else {
            cyIndividualCrimes.style()
            .selector('edge')
                .style({
                    'width': 2,
                    'line-color': '#dfdfdf',
                    "curve-style": "bezier"
                })
            .update();
        }
    } catch (error) {
    }

    try {
        if(document.querySelector("#CheckEdges").checked){
            cyIndividualEnviromentalTapping.style()
            .selector('edge')
                .style({
                    'width': 2,
                    'line-color': '#dfdfdf',
                    "curve-style": "bezier",
                    'label': 'data(id)'
                })
            .update();
        } else {
            cyIndividualEnviromentalTapping.style()
            .selector('edge')
                .style({
                    'width': 2,
                    'line-color': '#dfdfdf',
                    "curve-style": "bezier"
                })
            .update();
        }
    } catch (error) {
    }
}

//Funzione che inserisce nei cookie il valore dell'anonimizzazione e chiama un'altra funzione per la modifica nel layout
function checkedAnonymization() {
    try {
        if (document.querySelector("#CheckAnonymization").checked == true) {
            if (!document.cookie.includes("anonymization"))
                document.cookie = "anonymization=yes";
            else
                setCookie("anonymization", "yes");

            anonymizationNodeDetailsIndividualWiretaps("yes");
        } else {
            if (!document.cookie.includes("anonymization"))
                document.cookie = "anonymization=no";
            else
                setCookie("anonymization", "no");

            anonymizationNodeDetailsIndividualWiretaps("no");
        }
    } catch (error) {
        
    }

    try {
        if (document.querySelector("#CheckAnonymization").checked == true) {
            if (!document.cookie.includes("anonymization"))
                document.cookie = "anonymization=yes";
            else
                setCookie("anonymization", "yes");

            anonymizationNodeDetailsIndividualCrimes("yes");
        } else {
            if (!document.cookie.includes("anonymization"))
                document.cookie = "anonymization=no";
            else
                setCookie("anonymization", "no");

            anonymizationNodeDetailsIndividualCrimes("no");
        }
    } catch (error) {
        
    }

    try {
        if (document.querySelector("#CheckAnonymization").checked == true) {
            if (!document.cookie.includes("anonymization"))
                document.cookie = "anonymization=yes";
            else
                setCookie("anonymization", "yes");

            anonymizationNodeDetailsIndividualEnviromentalTapping("yes");
        } else {
            if (!document.cookie.includes("anonymization"))
                document.cookie = "anonymization=no";
            else
                setCookie("anonymization", "no");

            anonymizationNodeDetailsIndividualEnviromentalTapping("no");
        }
    } catch (error) {
        
    }
}
