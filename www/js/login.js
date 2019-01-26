// ログイン関係のJavaScript
let ncmb = new NCMB("アプリケーションキーを設定してください", "クライアントキーを設定してください");

// function adminLogin() {
//   let addressLog = "toshita8081@gmail.com";
//   let pass = "ttt";
//   ncmb.User.loginWithMailAddress(addressLog, pass)
//     .then(function (data) {
//       // ログイン後処理
//       fn.load("home.html");
//     })
//     .catch(function (err) {
//       // エラー処理
//       alert("ログイン失敗");
//       console.log(err);
//     });
// }

function logout() {
  ncmb.User.logout();
  console.log("userログアウト");
  fn.load("title.html");
}

function currentIDCheck() {
  var currentUser = ncmb.User.getCurrentUser();
  if (currentUser) {
    ncmb.User.fetch()
      .then(function (results) {
        console.log("currentUserName is " + currentUser.get("userName"));
        fn.load("home.html");
      })
      .catch(function (err) {
        console.log("session tokenが切れてるぜ");
        ncmb.User.logout();
        fn.load("Login.html");
        //このあとはログイン画面を表示とか
      });

  } else {
    fn.load("Login.html");
  }
}

function newAccount() {
  let address = document.getElementById("address");
  ncmb.User.requestSignUpEmail(address.value)
    .then(function (data) {
      // 送信後処理
      alert("メールを送信しました。");
      fn.load("Login.html");
    })
    .catch(function (err) {
      // エラー処理
      console.log(err);
      let str = err + "";
      if (str.indexOf("443") != 0) {
        alert("そのメールアドレスは使用されています");
      }
    });
}

function login() {
  let addressLog = document.getElementById("addressLog");

  let pass = document.getElementById("pass");
  ncmb.User.loginWithMailAddress(addressLog.value, pass.value)
    .then(function (data) {
      // ログイン後処理
      var currentUser = ncmb.User.getCurrentUser();
      // NCMB.Objectのサブクラスを生成
      let UserList = ncmb.DataStore("UserList");
      UserList.equalTo("user_name", currentUser.get("userName"))
        .limit(1)
        .fetchAll()
        .then(function (results) {
          console.log(results);
          if(results == ""){
            fn.load("firstConf.html");
          }else{
            fn.load("home.html");
          }
        })
        .catch(function (err) {
          console.log(err);
          
        });
      
    })
    .catch(function (err) {
      // エラー処理
      alert("ログイン失敗");
      console.log(err);
    });
}

function firstConfSubmit(){
  let currentUser = ncmb.User.getCurrentUser();
  let createUserId = document.getElementById("createUserId");
  let UserList = ncmb.DataStore("UserList");
  let ul = new UserList();
  ul.set("user_name", currentUser.get("userName"))
    .set("user_id", createUserId.value)
    .save()
    .then(function (position) {
      // 保存後の処理
      console.log("保存しました");
      fn.load("home.html");
    })
    .catch(function (err) {
      // エラー処理
      console.log(err);
    });
}