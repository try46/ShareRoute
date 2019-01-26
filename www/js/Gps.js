let total = "";
// const productionConfig = require('./production-config');
// 位置情報取得処理に渡すオプション
var options = {
  // 高精度な位置情報を取得するか(デフォルトはfalse)
  enableHightAccuracy: true,

  // 取得した位置情報をキャッシュする時間(ミリ秒。デフォルトは0)
  maximumAge: 0,

  // 何秒でタイムアウトとするか(ミリ秒。タイムアウトするとerrorCallback()がコールされる)
  timeout: 120000
}

// 位置情報取得処理が成功した時にコールされる関数
// 引数として、coords(coordinates。緯度・経度など)とtimestamp(タイムスタンプ)の2つを持ったpositionが渡される
function successCallback(position) {
  // メッセージを表示
  document.getElementById("message").innerHTML += "API成功<br />";

  // 引数positionからcoordinates(緯度・経度など)を取り出す
  // ただし、“★必ず取得できる”以外は中身が空っぽの可能性もある


  // メッセージを表示
  // document.getElementById("message").innerHTML += "取得日時：" + successDate.toLocaleString() + "<br />";
  // 緯度(-180～180度) ★必ず取得できる
  var latitude = position.coords.latitude + ",";
  // 経度(-90～90度) ★必ず取得できる
  var longitude = position.coords.longitude + "|";
  total += latitude + longitude;
  // document.getElementById("message").innerHTML += "緯度：" + latitude + " 度<br />";
  // document.getElementById("message").innerHTML += "経度：" + longitude + " 度<br />";
  // document.getElementById("message").innerHTML += "トータル" + total + "トータル<br>"
  // document.getElementById("message").innerHTML += "APIように置換ずみ" + total.slice(0, -1) + "APIに投げろ<br>"

  // 緯度・経度を地図上で確認するためにGoogleMapへのリンクを作成
    // document.getElementById("message").innerHTML += "<a target='_blank' href='https://maps.google.co.jp/maps?q="
    //   + latitude + "," + longitude + "+%28%E7%8F%BE%E5%9C%A8%E4%BD%8D%E7%BD%AE%29&iwloc=A'>緯度・経度をGoogleMapで確認</a><br /><br />";
}

// 位置情報取得処理が失敗した時にコールされる関数
// 引数として、code(コード)とmessage(メッセージ)の2つを持ったpositionErrorが渡される
function errorCallback(positionError) {

  // メッセージを表示
  document.getElementById("message").innerHTML += "API失敗<br />";


  // 引数positionErrorの中身2つを取り出す

  // コード(1～3のいずれかの値)
  var code = positionError.code;

  // メッセージ(開発者向けデバッグ用メッセージ)
  var message = positionError.message;


  // コードに応じたメッセージを表示
  switch (code) {
    case positionError.PERMISSION_DENIED: // codeが1
      document.getElementById("message").innerHTML += "GeolocationAPIのアクセス許可がありません<br />";
      break;

    case positionError.POSITION_UNAVAILABLE: // codeが2
      document.getElementById("message").innerHTML += "現在の位置情報を特定できませんでした<br />";
      break;

    case positionError.TIMEOUT: // codeが3
      document.getElementById("message").innerHTML += "指定されたタイムアウト時間内に現在の位置情報を特定できませんでした<br />";
      break;
  }

  // 開発者向けデバッグ用メッセージを表示
  document.getElementById("message").innerHTML += message + "<br /><br />";
}

// watchPosition()の戻り値。この戻り値をclearWatch()に渡すことでwatch(監視)を停止させる。
var watchId = null;

// 位置情報監視開始
function start() {
  console.log("計測開始");
  // watchIdが設定されているかをチェック
  if (watchId == null) {
    // 設定されていない → 監視中ではないのでwatch開始

    // メッセージ表示領域をクリア
    // document.getElementById("message").innerHTML = "";

    // ブラウザがGeolocation APIに対応しているかをチェック
    if (navigator.geolocation) {
      // 対応している → 位置情報監視開始
      // 取得成功時にsuccessCallback()、そして取得失敗時にerrorCallback()がコールされる
      // optionsはgetCurrentPosition()に渡す設定値
      watchId = navigator.geolocation.watchPosition(successCallback, errorCallback, options);

      // メッセージを表示。↑は非同期処理なので、直ぐにメッセージが表示される
      document.getElementById("message").innerHTML = "API実行<br />";
    } else {
      // 対応していない → alertを表示するのみ
      alert("Geolocation not supported in this browser");
    }
  }
}

// 位置情報監視停止
function stop() {
  console.log("計測終了")
  console.log(total);

  // watchIdが設定されているかをチェック
  if (watchId != null) {
    // 設定されている → 監視中なのでwatch停止
    navigator.geolocation.clearWatch(watchId);

    // watchIdを空にする
    watchId = null;

    // メッセージを表示
    document.getElementById("message").innerHTML += "位置情報の取得を終了します";
    if (total != null) {
      console.log(total);
    } else if (total == null) {
      document.getElementById("message").innerHTML += "位置情報がないため終了します<br/>";
    }
  }
}

function getTotal(){
  return total;
}