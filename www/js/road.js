// This is a JavaScript file
function recordRoad() {
  let imgs = document.getElementById("startbutton");
  let str = imgs.src + "";
  //画像の名前にstartが付くかどうか
  if (str.indexOf("START") != -1) {
    imgs.src = "img/captureSTOP.PNG";
    moveTime = Date.now();
    start();
  } else {
    if (getTotal() == "") {
      ons.notification.confirm({
        title: "注意",
        message: "何も記録されていませんが、終了しますか?",
        callback: function (answer) {
          if (answer > 0) {
            imgs.src = "img/captureSTART.PNG";
            moveTime -= Date.now();
            moveTime *= -1;
            stop();
            fn.load("saveRoad.html");
          }
        }
      })
    } else {
      ons.notification.confirm({
        title: "注意",
        message: "本当に終了してよろしいでしょうか?",
        callback: function (answer) {
          if (answer > 0) {
            imgs.src = "img/captureSTART.PNG";
            moveTime -= Date.now();
            moveTime *= -1;
            stop();
            fn.load("saveRoad.html");
          }
        }
      })
    }
  }
};
let editCode;
function editRoute(code){
  editCode = code;
  document.querySelector('#myNavigater').pushPage('editRoute.html');
}
