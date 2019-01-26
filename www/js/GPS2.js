let total2 = "";

let gpsOptions = {
  // 高精度な位置情報を取得するか(デフォルトはfalse)
  enableHightAccuracy: true,

  // 取得した位置情報をキャッシュする時間(ミリ秒。デフォルトは0)
  maximumAge: 0,

  // 何秒でタイムアウトとするか(ミリ秒。タイムアウトするとerrorCallback()がコールされる)
  timeout: 120000
}
// onSuccess Callback
// This method accepts a Position object, which contains the
// current GPS coordinates
//
var onSuccess = function (position) {
  console.log("getPosition!");
  // 緯度(-180～180度) ★必ず取得できる
  let latitude = position.coords.latitude + ",";
  // 経度(-90～90度) ★必ず取得できる
  let longitude = position.coords.longitude + "|";
  total2 += latitude + longitude;
};

// onError Callback receives a PositionError object
//
function onError(error) {
  alert('code: ' + error.code + '\n' +
    'message: ' + error.message + '\n');
}

function getGPSPosition() {
  navigator.geolocation.getCurrentPosition(onSuccess, onError, gpsOptions);
  console.log(total2);
}

function getTotal2(){
  return total2;
}
