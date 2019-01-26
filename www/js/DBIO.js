// データの入出力関係のJavaScript
let moveTime;

const arPath = {
  "path": "www/ar.html",
  "requiredFeatures": [
    "geo"
  ],
  "startupConfiguration": {
    "camera_position": "back"
  }
}; // AR生成に必要なパス


function recordPush() {
  let route_name = document.getElementById("route_Name");
  if (route_name.value == "") {
    ons.notification.alert({
      title: "注意",
      message: "保存名が設定されていません"
    })
  } else {
    // NCMB.Objectのサブクラスを生成
    let GPSPosition = ncmb.DataStore("GPSPosition");

    let position = new GPSPosition();
    let route_code = getTotal();
    let currentUser = ncmb.User.getCurrentUser();
    let publicLevel = document.getElementsByName("group");
    let re;
    for (let i = 0; i < publicLevel.length; i++) {
      if (publicLevel[i].checked) {
        re = publicLevel[i].value;
        break;
      }
    }
    position.set("route_name", route_name.value)
      .set("route_code", route_code)
      .set("user_name", currentUser.get("userName"))
      .set("moveTime", moveTime)
      .set("publicLevel", Number(re))
      .save()
      .then(function (position) {
        // 保存後の処理
        console.log("保存しました");
        GPSPosition.equalTo("route_code", route_code)
          .limit(1)
          .fetchAll()
          .then(function (results) {
            for (var i = 0; i < results.length; i++) {
              ons.notification.alert({
                title: "保存完了",
                message: "以下の道情報を保存しました\n" + '保存ルート名:' + route_name.value + '\n'
              });
            }
          })
          .catch(function (err) {
            console.log(err);
          });
        fn.load("home.html");
      })
      .catch(function (err) {
        // エラー処理
        console.log(err);
      });
  }
}

function serchRoute() {
  // NCMB.Objectのサブクラスを生成
  let GPSPosition = ncmb.DataStore("GPSPosition");

  // クラスの新しいインスタンスを生成
  let position = new GPSPosition();
  let serchId = document.getElementById("serchId");
  GPSPosition.equalTo("objectId", serchId.value)
    .greaterThanOrEqualTo("publicLevel", 2)
    .limit(1)
    .fetchAll()
    .then(function (results) {
      for (var i = 0; i < results.length; i++) {
        let result = document.getElementById("serchResult");
        result.innerHTML =
          "<div class=\"serchResult\">" +
          "経路名：" + results[i].get("route_name") + "<br>"
          + "登録ユーザ名：" + results[i].get("user_name") + "<br>"
          + "<button onclick=\"bookMark('" + results[i].get("objectId") + "')\">" + "保存" + "</button></div>"
      }

    })
    .catch(function (err) {
      console.log(err);
    });
}

function serchRouteforFr() {
  let UserList = ncmb.DataStore("UserList");
  let serchId = document.getElementById("userName");
  console.log(serchId.value);
  UserList.equalTo("user_name", serchId.value)
    .limit(1)
    .fetchAll()
    .then(function (results) {
      for (var i = 0; i < results.length; i++) {
        console.log(3);
        let result = document.getElementById("serchResultforFr");
        result.innerHTML =
        "<div class=\"serchResult\">" +
          "ユーザID：" + results[i].get("user_id") + "<br>"
          + "<button onclick=\"friendMark('" + results[i].get("user_name") + "')\">" + "保存" + "</button><div>"
      }

    })
    .catch(function (err) {
      console.log(err);
    });
}

function friendMark(userName) {
  let currentUser = ncmb.User.getCurrentUser();
  let FriendList = ncmb.DataStore("FriendList");
  let fl = new FriendList();
  fl.set("user_name", currentUser.get("userName"))
    .set("friend_name", userName)
    .save()
    .then(function (position) {
      ons.notification.alert({
        title: "報告",
        message: "友達登録(ブックマーク)しました"
      })
    })
    .catch(function (err) {
      // エラー処理
      console.log(err);
    });
}

function bookMark(routeId) {
  // NCMB.Objectのサブクラスを生成
  let BookMarkList = ncmb.DataStore("BookMarkList");

  // クラスの新しいインスタンスを生成
  let bml = new BookMarkList();
  let currentUser = ncmb.User.getCurrentUser();
  bml.set("registerUser", currentUser.get("userName"))
    .set("registerRoute", routeId)
    .save()
    .then(function (position) {
      // 保存後の処理
      alert("ブックマークしました");
    })
    .catch(function (err) {
      // エラー処理
      console.log(err);
    });
}

function downloadMyRoute() {
  // NCMB.Objectのサブクラスを生成
  let GPSPosition = ncmb.DataStore("GPSPosition");

  // クラスの新しいインスタンスを生成
  let position = new GPSPosition();
  let currentUser = ncmb.User.getCurrentUser();
  let routes = document.getElementById("myRoutes");
  routes.innerHTML = "";
  let strs = "";
  strs = "<table>" +
    "<tr>" +
    "<th>名前</th><th>登録日</th>" +
    "</tr>";
  GPSPosition.equalTo("user_name", currentUser.get("userName"))
    .order("createDate",true)
    .fetchAll()
    .then(function (results) {
      for (var i = 0; i < results.length; i++) {
        let date = results[i].get("createDate").split("T");
        let dateSp = date[0].split("-");
        let dateR = dateSp[0] + "年" + dateSp[1] + "月" + dateSp[2] + "日";
        let str =
          "<tr>" +
          "<td><ons-button class=\"tableButton\" onclick=\"detailShow('" + results[i].get("objectId") + "')\">" + results[i].get("route_name") + "</ons-button></td>" +
          "<td>" + dateR + "</td>" +
          "</tr>";
        strs += str;
      }
      strs += "</table>";
      routes.innerHTML = strs;
    })
    .catch(function (err) {
      console.log(err);
    });
}

function readBookMark() {
  downloadBookMarkRoute()
    .then(function (results) { return readRoutebyBookMark(results) })
    .then(function (resultStr) { writteHTML(resultStr) });
}

//データベースはまず取得する外側が先に実行され、外側から検索される　　普通に考えておかしい
function downloadBookMarkRoute() {
  return new Promise(function (resolve, reject) {
    // NCMB.Objectのサブクラスを生成
    let BookMarkList = ncmb.DataStore("BookMarkList");
    let currentUser = ncmb.User.getCurrentUser();
    let res = new Array();

    BookMarkList.equalTo("registerUser", currentUser.get("userName"))
      .fetchAll()
      .then(function (results) {
        for (let i = 0; i < results.length; i++) {
          res.push(results[i].get("registerRoute"));
        }
        resolve(res);
      });
  });
}

function readRoutebyBookMark(routeId) {
  return new Promise(function (resolve, reject) {
    console.log(routeId);
    let GPSPosition = ncmb.DataStore("GPSPosition");
    let routes = document.getElementById("bookMarkRoutes");
    routes.innerHTML = "";
    strs = "";
    strs = "<table>" +
      "<tr>" +
      "<th>名前</th><th>登録日</th>" +
      "</tr>";
    for (let i = 0; i < routeId.length; i++) {
      GPSPosition.equalTo("objectId", routeId[i])
        .order("createDate",true)
        .fetchAll()
        .then(function (results) {
          for (let j = 0; j < results.length; j++) {
            let date = results[j].get("createDate").split("T");
            let dateSp = date[0].split("-");
            let dateR = dateSp[0] + "年" + dateSp[1] + "月" + dateSp[2] + "日";
            let str =
              "<tr>" +
              "<td><ons-button class=\"tableButton\" onclick=\"detailShow('" + results[j].get("objectId") + "')\">" + results[j].get("route_name") + "</ons-button></td>" +
              "<td>" + dateR + "</td>" +
              "</tr>";
            strs += str;
          }
        })
        .then(function () {
          if (i == routeId.length - 1) {
            resolve(strs);
          }
        });
    }
  });
}

function writteHTML(htmlStr) {
  return new Promise(function (resolve, reject) {
    let routes = document.getElementById("bookMarkRoutes");
    htmlStr += "</table>";
    routes.innerHTML = htmlStr;
    resolve("OK");
  });
}

function downloadFriendsCode() {
  return new Promise(function (resolve, reject) {
    // NCMB.Objectのサブクラスを生成
    let FriendList = ncmb.DataStore("FriendList");
    let currentUser = ncmb.User.getCurrentUser();
    let res = new Array();
    FriendList.equalTo("user_name", currentUser.get("userName"))
      .fetchAll()
      .then(function (results) {
        for (let i = 0; i < results.length; i++) {
          res.push(results[i].get("friend_name"));
        }
        console.log(res);
        resolve(res);
      });
  });
}

function writteFriendHTML(htmlStr) {
  console.log(htmlStr);
  let routes = document.getElementById("myFriends");
  htmlStr += "</table>";
  routes.innerHTML = htmlStr;
}

function readFriendInfo(FriendsCode) {
  return new Promise(function (resolve, reject) {
    let UserList = ncmb.DataStore("UserList");
    let myFriends = document.getElementById("myFriends");
    myFriends.innerHTML = "";
    strs = "";
    strs = "<table>" +
      "<tr>" +
      "<th>名前</th>" +
      "</tr>";
    for (let i = 0; i < FriendsCode.length; i++) {
      UserList.equalTo("user_name", FriendsCode[i])
        .fetchAll()
        .then(function (results) {
          for (let j = 0; j < results.length; j++) {
            let str =
              "<tr>" +
              "<td><ons-button class=\"tableButton\" onclick=\"userDetailShow('" + results[j].get("user_name") + "')\">" + results[j].get("user_id") + "</ons-button></td>" +
              "</tr>";
            strs += str;
          }
        })
        .then(function () {
          if (i == FriendsCode.length - 1) {
            resolve(strs);
          }
        });
      console.log(i);
    }
  });
}

let serchFreId;
function userDetailShow(friendId) {
  serchFreId = friendId;
  document.querySelector('#myNavigater').pushPage("friendRouteDetail.html");
}

function downloadFriendRoute() {
  console.log("friendRoute");
  // NCMB.Objectのサブクラスを生成
  let GPSPosition = ncmb.DataStore("GPSPosition");
  // クラスの新しいインスタンスを生成
  let position = new GPSPosition();
  let routes = document.getElementById("friendRoute");
  routes.innerHTML = "";
  let strs = "";
  strs = "<table>" +
    "<tr>" +
    "<th>名前</th><th>登録日</th>" +
    "</tr>";
  GPSPosition.equalTo("user_name", serchFreId)
    .greaterThanOrEqualTo("publicLevel", 2)
    .order("createDate",true)
    .fetchAll()
    .then(function (results) {
      for (var i = 0; i < results.length; i++) {
        let date = results[i].get("createDate").split("T");
        let dateSp = date[0].split("-");
        let dateR = dateSp[0] + "年" + dateSp[1] + "月" + dateSp[2] + "日";
        let str =
          "<tr>" +
          "<td><ons-button class=\"tableButton\" onclick=\"detailShow('" + results[i].get("objectId") + "')\">" + results[i].get("route_name") + "</ons-button></td>" +
          "<td>" + dateR + "</td>" +
          "</tr>";
        strs += str;
        console.log(str);
      }
      strs += "</table>";
      routes.innerHTML = strs;
    })
    .catch(function (err) {
      console.log(err);
    });
}

function detailShow(deId) {
  detailId = deId;
  document.querySelector('#myNavigater').pushPage('routeDetail.html');
}

function createRouteDetail() {
  // NCMB.Objectのサブクラスを生成
  let GPSPosition = ncmb.DataStore("GPSPosition");
  // クラスの新しいインスタンスを生成
  let position = new GPSPosition();
  let result = document.getElementById("detail");
  result.innerHTML = "";
  GPSPosition.equalTo("objectId", detailId)
    .limit(1)
    .fetchAll()
    .then(function (results) {
      for (var i = 0; i < results.length; i++) {
        let pLevel = results[i].get("publicLevel"); 
        let publicStr = "";
        if(pLevel == 1){
          publicStr = "非公開";
        }else if(pLevel == 2){
          publicStr = "友達のみ";
        }else if(pLevel == 3){
          publicStr = "だれでも";
        }
        let date = results[i].get("createDate").split("T");
        let dateSp = date[0].split("-");
        let dateR = dateSp[0] + "年" + dateSp[1] + "月" + dateSp[2] + "日";
        
        let str =
          "<table id=\"detailTable\" border=\"1\">" +
          "<tr>" +
          "<td>名前</td><td>" + results[i].get("route_name") + "</td>" +
          "</tr><tr>" +
          "<td>公開レベル</td><td>" + publicStr + "</td>" +
          "</tr><tr>" +
          "<td>移動時間</td><td>";
        let time = Math.round(results[i].get("moveTime")/1000);
        if(time/60 >= 1){
          let mini = Math.floor(time/60);
          str += mini + "分";
          time = time - mini * 60;
        }
        str += time + "秒" + "</td>" +
          "</tr><tr>"
        str += "<td>登録日</td><td>" + dateR + "</td>" +
          "</tr></table>";
        str += "<div id=\"detailButton\">" +
          "<button onclick=\"copyCode('" + results[i].get("objectId") + "')\">検索用IDをコピー</ons-button><br>" +
          "<button onclick=\"createQRPage('" + results[i].get("objectId") + "')\">QR" +
          "</button><br>" +
          "<button onclick=\"mapCreate('" + results[i].get("route_code") + "')\">地図" +
          "</button><br>" +
          "<button onclick=\"app.loadARchitectWorld(arPath, '" + results[i].get("route_code") + "')\">AR" +
          "</button><br>" +
          "<button onclick=\"editRoute('" + results[i].get("objectId") + "')\">編集" +
          "</button><br>" +
          "<button onclick=\"removeRoute('" + results[i].get("objectId") + "')\">削除" +
          "</button><br>" + 
          "</div>";
        console.log(str);
        result.innerHTML = str;
      }

    })
    .catch(function (err) {
      console.log(err);
    });
}

function removeRoute(removeCode) {
  ons.notification.confirm({
    title: "注意",
    message: "本当に削除しますか?",
    callback: function (answer) {
      if (answer > 0) {
        // NCMB.Objectのサブクラスを生成
        let GPSPosition = ncmb.DataStore("GPSPosition");
        GPSPosition.equalTo("objectId", removeCode)
          .fetchAll()
          .then(function (results) {
            results[0].delete()
              .then(function (result) {
                ons.notification.alert({
                  title: "削除完了",
                  message: "削除が完了しました"
                })
                document.querySelector('#myNavigater').popPage({ animation: 'default' });
                downloadMyRoute();
              })
              .catch(function (err) {
                // エラー処理
                console.log(err);
              });
          })
      }
    }
  })
}

function inputInformation() {
    let Information = ncmb.DataStore("Information");
    let NameList = ncmb.DataStore("UserList");

    let info = new Information();
    let namelist=new NameList();

    let name = document.getElementById("subject-line");
    let inquiry = document.getElementById("InformationText");

    let currentuser = ncmb.User.getCurrentUser();

    info.set("UserName",currentuser.get("userName"))
        .set("formtitle",name.value)
        .set("formBody",inquiry.value)
        .save()
        .then(function (position) {
            alert('送信しました、ありがとうございます');
            // console.log(currentuser.get("user_id")+'さん'+'送信しました、ありがとうございます')

            fn.load("home.html");
        }).catch(function (err) {
            alert('すいません、送信に失敗しましやり直してください。');
            
    })
}