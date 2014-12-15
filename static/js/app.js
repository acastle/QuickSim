var realms = ["Aegwynn","Aerie Peak","Agamaggan","Aggramar","Akama","Alexstrasza","Alleria","Altar of Storms","Alterac Mountains","Aman'Thul","Andorhal","Anetheron","Antonidas","Anub'arak","Arathor","Archimonde","Area 52","Argent Dawn","Arthas","Arygos","Auchindoun","Azgalor","Azjol-Nerub","Azralon","Azshara","Azuremyst","Baelgun","Balnazzar","Barthilas","Black Dragonflight","Blackhand","Blackrock","Blackwater Raiders","Blackwing Lair","Blade's Edge","Bladefist","Bleeding Hollow","Blood Furnace","Bloodhoof","Bloodscalp","Bonechewer","Borean Tundra","Boulderfist","Bronzebeard","Burning Blade","Burning Legion","Caelestrasz","Cairne","Cenarion Circle","Cenarius","Cho'gall","Chromaggus","Coilfang","Crushridge","Daggerspine","Dalaran","Dalvengyr","Dark Iron","Darkspear","Darrowmere","Dath'Remar","Dawnbringer","Deathwing","Demon Soul","Dentarg","Destromath","Dethecus","Detheroc","Doomhammer","Draenor","Dragonblight","Dragonmaw","Drak'Tharon","Drak'thul","Draka","Drakkari","Dreadmaul","Drenden","Dunemaul","Durotan","Duskwood","Earthen Ring","Echo Isles","Eitrigg","Eldre'Thalas","Elune","Emerald Dream","Eonar","Eredar","Executus","Exodar","Farstriders","Feathermoon","Fenris","Firetree","Fizzcrank","Frostmane","Frostmourne","Frostwolf","Galakrond","Gallywix","Garithos","Garona","Garrosh","Ghostlands","Gilneas","Gnomeregan","Goldrinn","Gorefiend","Gorgonnash","Greymane","Grizzly Hills","Gul'dan","Gundrak","Gurubashi","Hakkar","Haomarush","Hellscream","Hydraxis","Hyjal","Icecrown","Illidan","Jaedenar","Jubei'Thos","Kael'thas","Kalecgos","Kargath","Kel'Thuzad","Khadgar","Khaz Modan","Khaz'goroth","Kil'jaeden","Kilrogg","Kirin Tor","Korgath","Korialstrasz","Kul Tiras","Laughing Skull","Lethon","Lightbringer","Lightning's Blade","Lightninghoof","Llane","Lothar","Madoran","Maelstrom","Magtheridon","Maiev","Mal'Ganis","Malfurion","Malorne","Malygos","Mannoroth","Medivh","Misha","Mok'Nathal","Moon Guard","Moonrunner","Mug'thol","Muradin","Nagrand","Nathrezim","Nazgrel","Nazjatar","Nemesis","Ner'zhul","Nesingwary","Nordrassil","Norgannon","Onyxia","Perenolde","Proudmoore","Quel'Thalas","Quel'dorei","Ragnaros","Ravencrest","Ravenholdt","Rexxar","Rivendare","Runetotem","Sargeras","Saurfang","Scarlet Crusade","Scilla","Sen'jin","Sentinels","Shadow Council","Shadowmoon","Shadowsong","Shandris","Shattered Halls","Shattered Hand","Shu'halo","Silver Hand","Silvermoon","Sisters of Elune","Skullcrusher","Skywall","Smolderthorn","Spinebreaker","Spirestone","Staghelm","Steamwheedle Cartel","Stonemaul","Stormrage","Stormreaver","Stormscale","Suramar","Tanaris","Terenas","Terokkar","Thaurissan","The Forgotten Coast","The Scryers","The Underbog","The Venture Co","Thorium Brotherhood","Thrall","Thunderhorn","Thunderlord","Tichondrius","Tol Barad","Tortheldrin","Trollbane","Turalyon","Twisting Nether","Uldaman","Uldum","Undermine","Ursin","Uther","Vashj","Vek'nilash","Velen","Warsong","Whisperwind","Wildhammer","Windrunner","Winterhoof","Wyrmrest Accord","Xavius","Ysera","Ysondre","Zangarmarsh","Zul'jin","Zuluhed"];
var classes = [
  {"id":1, "name":"Warrior"},
  {"id":2, "name":"Paladin"},
  {"id":3, "name":"Hunter"},
  {"id":4, "name":"Rogue"},
  {"id":5, "name":"Priest"},
  {"id":6, "name":"Death Knight"},
  {"id":7, "name":"Shaman"},
  {"id":8, "name":"Mage"},
  {"id":9, "name":"Warlock"},
  {"id":10, "name":"Monk"},
  {"id":11, "name":"Druid"}];

var app = angular.module('raidTrack', []);
app.controller("RaidTrackController", function($scope, $http, socket){
  $scope.players = [];
  $scope.addPlayer = function(player, server, role){
    $scope.players.push({
      "name": player,
      "realm": server
    });
    $http.get("/characters/" + server + "/" + player);
  }
  $scope.getSpecIcon = function(className, specName) {
    if (className !== null && specName !== null){
      return "icon-" + className.toLowerCase();
    }

    return "";
  };
  $scope.getClassIcon = function(className) {
    if (className !== undefined && className !== null){
      return "icon-" + className.replace(" ", "").toLowerCase();
    }

    return "";
  };

  socket.on("character:loaded", function(data){
    console.log(data);
    for(var id in $scope.players) {
      if ($scope.players[id].realm.toLowerCase() === data.realm.toLowerCase() &&
        $scope.players[id].name.toLowerCase() === data.name.toLowerCase()){
        var spec;
        for (var i = 0; i < data.talents.length; i++){
          if (data.talents[i].selected){
            spec = data.talents[i].spec.name;
          }
        }
        $scope.$apply(function(){
          $scope.players[id].name = data.name;
          $scope.players[id].realm = data.realm;
          $scope.players[id].class = classes[data.class - 1];
          $scope.players[id].spec = spec;
          $scope.players[id].items = data.items;
        });
      }
    }
  })
});

app.controller("AddPlayerController", function($scope){
  $scope.realms = realms;
  $scope.selectedRealm = "Eonar";
  $scope.selectedRole = "Tank";
  $scope.playerName = ""
});

app.factory("socket", function(){
  var socket = io();
  return socket;
})
