
$( document ).ready(function(){  
    initMap();
});

// Links úteis:
//  > https://javascript.info/object
function initMap(){
    map = L.map('relataiMap', {scrollWheelZoom:false}).setView([-19.554872,-46.640265], 6);

    // baselayers
    var openstreetmap = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ',
        maxZoom: 18
    });
    var openStreetMapBlackAndWhite = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18
    });

    var empty = L.tileLayer('');    

    var baseLayers = {
        'Blank': empty,
        'OSM' : openstreetmap,
        'OSM_Black' : openStreetMapBlackAndWhite
    }

    // define the openstreetmap as main map layer    
    baseLayers.OSM_Black.addTo(map);    
     
    var overLayers = mountOverlayers();
    console.log(overLayers);

    overLayers.Todos.addTo(map);

    L.control.layers(baseLayers, overLayers).addTo(map);

    L.control.scale().addTo(map);
}

function mountOverlayers(){
    let group = {};

    let categories = findAllCategoriesAndYoursReports();
    
    if(categories != null){
        categories.forEach(categoria => {
            let categoriaName = categoria.nome;
            let reports = categoria.relatos;           

            if(categoria.relatos.length > 0){                   
                group[categoriaName] = mountMakersFromCategoria(reports);
            }
        });
    }

    group["Todos"] = mountAllLayerGroup(group);
       
    return group;
}

function mountAllLayerGroup(group){
    let layerGroups = [];

    for(key in group){
        layerGroups.push(group[key]);
    }

    return L.layerGroup(layerGroups);
}

function findAllCategoriesAndYoursReports(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            localStorage.setItem("response",JSON.stringify(this.responseText));     
        }   
    }; 
    xhttp.open("GET", "https://relatai-api.herokuapp.com/categorias", true);
    xhttp.send();

    let categories = JSON.parse(JSON.parse(localStorage.getItem("response")));
    
    return categories;
}

function mountMakersFromCategoria(reports){
    let makers = [];        

    reports.forEach(report => {       
        makers.push(L.marker([report.latitude, report.longitude]).bindPopup(report.descricao));
    });

    let makersLayerGroup = L.layerGroup(makers);

    return makersLayerGroup;
}
   