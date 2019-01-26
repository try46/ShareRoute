// QRコード処理関係のJavaScript

function scanBarcode() {
  window.plugins.barcodeScanner.scan(function (result) {
    let serchQR = document.getElementById("serchId");
    serchQR.value = result.text;
  }, function (error) {
    alert("Scanning failed: " + error);
  });
}

function scanBarcodeforFr() {
  window.plugins.barcodeScanner.scan(function (result) {
    let serchQR = document.getElementById("userName");
    serchQR.value = result.text;
  }, function (error) {
    alert("Scanning failed: " + error);
  });
}

let qrCode;
function createQRPage(qrcode) {
  qrCode = qrcode;
  console.log(qrcode);
  document.querySelector('#myNavigater').pushPage('qrcode.html');
}

function QRCreate() {
  // $('#qrcode').html("");
  // $('#qrcode').qrcode({ width: 64, height: 64, text: qrCode });
  console.log(qrCode);
  jQuery('#qrcode').qrcode(qrCode);
}

function myCodeCopy() {
  let currentUser = ncmb.User.getCurrentUser();
  copyCode(currentUser.get("userName"));
}

function myCodeQR() {
  let currentUser = ncmb.User.getCurrentUser();
  qrCode = currentUser.get("userName");
  console.log(qrCode);
  document.querySelector('#myNavigater').pushPage('qrcode.html');
}

/**
 * クリップボードコピー関数
 * 入力値をクリップボードへコピーする
 * [引数]   textVal: 入力値
 * [返却値] true: 成功　false: 失敗
 */
function copyCode(code) {
  // テキストエリアを用意する
  var copyFrom = document.createElement("textarea");
  // テキストエリアへ値をセット
  copyFrom.textContent = code;

  // bodyタグの要素を取得
  var bodyElm = document.getElementsByTagName("body")[0];
  // 子要素にテキストエリアを配置
  bodyElm.appendChild(copyFrom);

  // テキストエリアの値を選択
  copyFrom.select();
  // コピーコマンド発行
  var retVal = document.execCommand('copy');
  // 追加テキストエリアを削除
  bodyElm.removeChild(copyFrom);
  // 処理結果を返却
  console.log("コピー結果：" + retVal);
  // return retVal;
}