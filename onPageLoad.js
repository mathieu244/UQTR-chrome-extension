var dataType = "html";
//alert("allo UQT1R!");
// Fichier charger a l'affichage de oraprdnt.uqtr.uquebec.ca
var DEBUG = false;
// Informations qui doivent provenir de l'extension //
var no_programme = "7990";
var annee = "2018";
var dataType = "html";
var cours = [];
var cours_choisi = ["PDG1025","PDG1030"];
// Informations qui doivent provenir de l'extension //

var map = {lundi: {"8h": "","12": "","15": "","19": ""}, mardi: {"8h": "","12": "","15": "","19": ""}, mercredi: {"8h": "","12": "","15": "","19": ""}, jeudi: {"8h": "","12": "","15": "","19": ""}, vendredi: {"8h": "","12": "","15": "","19": ""}};
var plages = ["8h","12","15","19"];

var css = `<style>
table#horaire, th, td {
   border: 5px double black;
   background-color: WHITE;
}
table#horaire {
   margin: 0 auto;
   width: 100%;
   height: 400px;
}
#overlay {
    position: fixed; /* Sit on top of the page content */
    display: block; /* Hidden by default */
    width: 100%; /* Full width (cover the whole page) */
    height: 100%; /* Full height (cover the whole page) */
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.5); /* Black background with opacity */
    z-index: 2; /* Specify a stack order in case you're using a different order for other elements */
    cursor: pointer; /* Add a pointer on hover */
}
</style>`;

// Afficher les cours du programme
function get_cours_info(){
    var url = "https://oraprdnt.uqtr.uquebec.ca/pls/public/pgmw001?owa_type_rech=O&owa_type=P&owa_apercu=N&owa_valeur_rech=ED&owa_cd_pgm="+no_programme;
    jQuery.ajax({
      type: "GET",
      url: url,
      success: function(data,textStatus,jqXHR ){
        parser=new DOMParser();
        htmlDoc=parser.parseFromString(data, "text/html");
        category = htmlDoc.getElementsByClassName("courspgmhoraire");

        for (var i = 0; i < category.length; i++) {
          lignes = category[i].getElementsByTagName("tr");
          for (var j = 0; j < lignes.length; j++) {
            cours.push(lignes[j].getElementsByTagName("a")[0].text);
          }
        }
      },
      dataType: dataType
    });
}


function list_cours_selections(){

}

// affiche l'horaire des cours
function get_cours_horaire(cours_choisi2,owa_anses){
  cours_choisi = cours_choisi2;
  //alert("GET COURS!");
  map = {lundi: {"8h": "","12": "","15": "","19": ""}, mardi: {"8h": "","12": "","15": "","19": ""}, mercredi: {"8h": "","12": "","15": "","19": ""}, jeudi: {"8h": "","12": "","15": "","19": ""}, vendredi: {"8h": "","12": "","15": "","19": ""}};
  //console.log("Recherche de lhoraire!");
	var url = "https://oraprdnt.uqtr.uquebec.ca/pls/public/actw001f?&owa_apercu=N";
  //initMap();

  for (var i = 0; i < cours_choisi.length; i++) {
    var data = {owa_sigle: cours_choisi[i],owa_anses: owa_anses};
    jQuery.ajax({
      type: "POST",
      async: false,
      url: url,
      data: data,
      success: function(data,textStatus,jqXHR ){
        //alert("GET COURS: SUCCESS");
        parser=new DOMParser();
        htmlDoc=parser.parseFromString(data, "text/html");
        //console.log("Parse horaire");
        map_horaire(htmlDoc, cours_choisi[i]);
        //console.log(data);
        //map_cours(htmlDoc);
      },
      error: function(data,textStatus,errorThrown){
        //alert("GET COURS: ERROR");
        if(DEBUG) console.log("error! "+textStatus);
      },
      dataType: dataType
    });
  }
  //return map;

}

function get_cours_horair2e(){
  //alert("GET COURS!");
	var url = "https://oraprdnt.uqtr.uquebec.ca/pls/public/actw001f?&owa_apercu=N";
  initMap();

  for (var i = 0; i < cours_choisi.length; i++) {
    var data = {owa_sigle: cours_choisi[i],owa_anses: annee+"1"};
    jQuery.ajax({
      type: "POST",
      async: false,
      url: url,
      data: data,
      success: function(data,textStatus,jqXHR ){
        //alert("GET COURS: SUCCESS");
        parser=new DOMParser();
        htmlDoc=parser.parseFromString(data, "text/html");
        //console.log(data);
        map_cours(htmlDoc);
      },
      error: function(data,textStatus,errorThrown){
        //alert("GET COURS: ERROR");
        if(DEBUG) console.log("error! "+textStatus);
      },
      dataType: dataType
    });
  }
  return map;

}

function get_cours(no_program){
  //alert("GET COURS!");
	var url = "https://oraprdnt.uqtr.uquebec.ca/pls/public/pgmw001?owa_type_rech=M&owa_valeur_rech=informatique&owa_cd_pgm="+no_program;

  for (var i = 0; i < cours_choisi.length; i++) {
    jQuery.ajax({
      type: "GET",
      async: false,
      url: url,
      success: function(data,textStatus,jqXHR ){
        //alert("GET COURS: SUCCESS");
        parser=new DOMParser();
        htmlDoc=parser.parseFromString(data, "text/html");
        //console.log(data);
        map_cours(htmlDoc);
      },
      error: function(data,textStatus,errorThrown){
        //alert("GET COURS: ERROR");
        if(DEBUG) console.log("error! "+textStatus);
      },
      dataType: dataType
    });
  }
  return map;

}

function show_horaire(){
  var inner_table = build_table();
  var dom_add_html = css+'<div id="overlay">'+inner_table+'</div>';

  document.body.innerHTML+=dom_add_html;
}

function build_table(){
  var html = "";
  html += "<table id='horaire'>";
  html += "<tr><th>&nbsp;</th><th>Lundi</th><th>Mardi</th><th>Mercredi</th><th>Jeudi</th><th>Vendredi</th></tr>";
  html += "<tr>";
    html += "<td>8h30@11h30</td>";
    html += "<td>"+map.lundi["8h"]+"</td>";
    html += "<td>"+map.mardi["8h"]+"</td>";
    html += "<td>"+map.mercredi["8h"]+"</td>";
    html += "<td>"+map.jeudi["8h"]+"</td>";
    html += "<td>"+map.vendredi["8h"]+"</td>";
  html += "</tr>";
  html += "<tr>";
    html += "<td>12h00@15h00</td>";
    html += "<td>"+map.lundi["12"]+"</td>";
    html += "<td>"+map.mardi["12"]+"</td>";
    html += "<td>"+map.mercredi["12"]+"</td>";
    html += "<td>"+map.jeudi["12"]+"</td>";
    html += "<td>"+map.vendredi["12"]+"</td>";
  html += "</tr>";
  html += "<tr>";
    html += "<td>15h30@18h30</td>";
    html += "<td>"+map.lundi["15"]+"</td>";
    html += "<td>"+map.mardi["15"]+"</td>";
    html += "<td>"+map.mercredi["15"]+"</td>";
    html += "<td>"+map.jeudi["15"]+"</td>";
    html += "<td>"+map.vendredi["15"]+"</td>";
  html += "</tr>";
  html += "<tr>";
    html += "<td>19h00@22h00</td>";
    html += "<td>"+map.lundi["19"]+"</td>";
    html += "<td>"+map.mardi["19"]+"</td>";
    html += "<td>"+map.mercredi["19"]+"</td>";
    html += "<td>"+map.jeudi["19"]+"</td>";
    html += "<td>"+map.vendredi["19"]+"</td>";
  html += "</tr>";

  html += "</table>";
  return html;
}


function initMap(){
  for (var i = 0; i < plages.length; i++) {
    map.lundi[plages[i]] = "";
    map.mardi[plages[i]] = "";
    map.mercredi[plages[i]] = "";
    map.jeudi[plages[i]] = "";
    map.vendredi[plages[i]] = "";
  }
}
cours = {};
function initMapCours(){
  /*
  for (var i = 0; i < plages.length; i++) {
    cours+=
  }*/
}

function map_horaire(htmlDoc,owa_sigle){
  if(htmlDoc.getElementsByClassName("textedescription").length > 0){
    var campus_uqtr = htmlDoc.getElementsByClassName("textedescription")[0].getElementsByClassName("affhoraire");

    for (var i = 0; i < campus_uqtr.length; i++) {
      var horaire = campus_uqtr[i];
      var periodes = horaire.getElementsByClassName("dateshoraire")[0].getElementsByClassName("heure");

      for (var j = 0; j < periodes.length; j++) {
        console.log(periodes[j].innerText);


        try{
          var jour = horaire.getElementsByClassName("dateshoraire")[0].getElementsByTagName("tr")[1].getElementsByTagName("strong")[0].innerText; // Donne la journee de la semaine
        }catch(e){}


          var periode = periodes[0].innerText.replace(/(\r\n|\n|\r|\s)/gm,"").substring(0,2);
          var owa_sigle = horaire.getElementsByClassName("sigle")[0].innerText.split(":")[1].replace(/(\r\n|\n|\r|\s)/gm,"");
          if(periodes.length > 1)
            owa_sigle += "*";

        if(map[jour] == undefined)
          map[jour] = {};

        try{
          if(map[jour][periode] == undefined)
          {
            map[jour][periode] = owa_sigle+"-"+horaire.getElementsByClassName("groupe")[0].innerText;
          }
          else {
            map[jour][periode] = map[jour][periode] + owa_sigle+"-"+horaire.getElementsByClassName("groupe")[0].innerText+"<br/>";
          }
        }catch(e){}
      }
    }
  }
}

function map_cours(htmlDoc){
  var cours_tables = htmlDoc.getElementsByClassName("courspgmhoraire");
  cours = {};
  for (var i = 0; i < cours_tables.length; i++) {
    var cours_links = cours_tables[i].getElementsByTagName("tr");
    for (var j = 0; j < cours_links.length; j++) {
      cours[cours_links[j].getElementsByTagName("a")[0].text] = cours_links[j].getElementsByClassName("haut")[1].textContent;
    }
  }
}
