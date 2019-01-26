// This is a JavaScript file
var map;
let mapCode = null;

function mapCreate(route_code){
  mapCode = route_code;
  console.log(mapCode);
  document.querySelector('#myNavigater').pushPage('Map.html');
  // fn.load('Map.html');
}
// 初期化。bodyのonloadでinit()を指定することで呼び出してます
function createMap() {
    let routePoints = mapCode.split("|");
    let startPosition = routePoints[0].split(",");
    // Google Mapで利用する初期設定用の変数
    var latlng = new google.maps.LatLng(startPosition[0], startPosition[1]);
    var opts = {
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      center: latlng
    };

    // getElementById("map")の"map"は、body内の<div id="map">より
    map = new google.maps.Map(document.getElementById("map"), opts);

    var patharray = new Array();
    for (let i = 0; i < routePoints.length - 1; i++) {
      console.log(routePoints[i]);
      let routeLaLo = routePoints[i].split(",");
      console.log(routeLaLo[0] + ":" + routeLaLo[1]);
      patharray[i] = new google.maps.LatLng(routeLaLo[0], routeLaLo[1]);
    }

    // Polylineの初期設定
    var polylineOpts = {
      map: map,
      path: patharray
    };
    // 直前で作成したPolylineOptionsを利用してPolylineを作成
    var polyline = new google.maps.Polyline(polylineOpts);

}