$=jQuery;
var save_btn = undefined;
var cours_btn = undefined;
var generate_btn = undefined;
var no_program_txt_field = undefined;
var annee_txt_field = undefined;
var map = undefined;
var cours = undefined;
var checkbox = undefined;

var DEBUG = true;
$( document ).ready(function() {
  loadExtentionItems();

  cours_btn.click(function(){
    if(DEBUG) console.log("load cours");
    saveProgramNumber(no_program_txt_field.value);
    retrieveCours();
  });

  generate_btn.click(function(){
    if(DEBUG) console.log("Save du numero");
    //saveProgramNumber(no_program_txt_field.value);
    retrieveTable();
  });

  save_btn.click(function(){
    if(DEBUG) console.log("Save du numero");
    saveProgramNumber(no_program_txt_field.value);
    retrieveTable();
    retrieveCours();
  });

  get_btn.click(function(){
    if(DEBUG) console.log("Get du numero");

  });

  checkbox.onclick = function(){
    toggleAllCours();
  };

  loadProgramNumber();
  //retrieveTable();
  //updateHtmlTable(map);
});

function onNumberChange(number){
  no_program_txt_field.value = number == undefined ? "3799" : number;
}

function onMapChange(map1){
  map = map1;
  updateHtmlTable(map);
}

function onCoursChange(cours1){
  cours = cours1;
  //TODO SAVE COURS
  updateHtmlCours(cours);
}

function updateHtmlCours(cours){
  $("#liste_cours").html("<p>"+buildHtmlCours(cours));
}

function updateHtmlTable(map){

  $("#choix_cours").html("<p>"+buildHtmlTable(map));
}

function retrieveTable(){
  console.log("get_cours_horaire(["+jQuery.map($("#liste_cours input:checked").toArray(), function(b){return "'"+b.id+"'"})+"], '"+annee+""+session+"');");
  // Annee
  // Session
  var annee = $("#annee").val();
  var session = $("#session").val();
  chrome.tabs.executeScript({
    code: "get_cours_horaire(["+jQuery.map($("#liste_cours input:checked").toArray(), function(b){return "'"+b.id+"'"})+"], '"+annee+""+session+"');"
  },
  function (result) {
    chrome.tabs.executeScript({
      code: "map;"
    },
    function (result) {
      var getText = Array();

      for (i = 0; i < result.length; i++)
        getText[i] = result[i];

      if(DEBUG) console.log(getText);
      console.log("Horaires a afficher");
      console.log(getText[0]);

      onMapChange(getText[0]);

    });

    var getText = Array();
    for (i = 0; i < result.length; i++)
      getText[i] = result[i];
    console.log(getText);
  });
}

function retrieveCours(){
  chrome.tabs.executeScript({
    code: "get_cours('"+no_program_txt_field.value+"');"
  },
  function (result) {
    chrome.tabs.executeScript({
      code: "cours;"
    },
    function (result) {
      var getText = Array();

      for (i = 0; i < result.length; i++)
        getText[i] = result[i];

      if(DEBUG) console.log(getText[0]);
      //cours=getText[0];
      onCoursChange(getText[0]);

    });

    var getText = Array();
    for (i = 0; i < result.length; i++)
      getText[i] = result[i];
    console.log(getText);
  });
}

function showTable(){
  chrome.tabs.executeScript({
    code: "map;"
  },
  function (result) {
    var getText = Array();

    for (i = 0; i < result.length; i++)
      getText[i] = result[i];

    if(DEBUG) console.log(getText);
    $("#choix_cours").html("<p>"+build_table(getText[0]));

  });
}

function loadProgramNumber(){
  chrome.storage.sync.get("program_number", function (obj) {
    onNumberChange(obj.program_number);
  });
}
function loadMap(){
  chrome.storage.sync.get("program_data", function (obj) {
    onMapChange(obj.program_data);
  });
}

function saveProgramNumber(number) {
  // Check that there's some code there.
  if (!number) {
    message('Error: No value specified');
    return;
  }
  // Save it using the Chrome extension storage API.
  chrome.storage.sync.set({'program_number': number}, function() {
    // Notify that we saved.
    if(DEBUG) message('Settings saved');
  });
}

function saveMap(map) {
  // Check that there's some code there.
  if (!map) {
    message('Error: No value specified');
    return;
  }
  // Save it using the Chrome extension storage API.
  chrome.storage.sync.set({'program_data': map}, function() {
    // Notify that we saved.
    if(DEBUG) message('Settings saved');
  });
}

function loadExtentionItems(){
  save_btn = $("#save_btn");
  get_btn = $("#get_btn");
  generate_btn = $("#generate_btn");
  no_program_txt_field = $("#no_program")[0];
  cours_btn = $("#cours_btn");
  annee_txt_field = $("#annee");
  checkbox = $("#checkall")[0];
  var d = new Date();
  annee_txt_field.val(d.getFullYear());
}
function buildHtmlCours(cours){
  var html = "";
  Object.keys(cours).forEach(function (key) {
   // do something with obj[key]
   html+='<div id="cours_'+key+'"> <input id="'+key+'" type="checkbox">'+key+": "+cours[key]+'</input> </div>';
  });
  return html;
}

function buildHtmlTable(map){
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
function message(msg){
  console.log(msg);
}

function toggleAllCours(){

  for (var i = 0; i < $("#liste_cours")[0].getElementsByTagName("input").length; i++) {
    $("#liste_cours")[0].getElementsByTagName("input")[i].checked = checkbox.checked;
  }
  //$("#checkall").val;
}
