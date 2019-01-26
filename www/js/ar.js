// オブジェクトを生成するために, 一時的に緯度経度情報を保存する変数
let lat = [];
let lon = [];

let World = new Array();

poiSplit(localStorage.getItem("arpoi"), lat, lon); //文字列を分割して緯度経度として個別に保存

/* 3Dオブジェクト */
for (let i = 0; i < lon.length - 1; i++) {
  /* オブジェクトの生成 */
  World[i] = new Object();

  /* プロパティの追加 */
  World[i].loaded = false;
  World[i].rotating = false;

  /* 初期化 */
  World[i].init = function initFn() {
    World[i].createModelAtLocation();
  };

  /* モデル作成 */
  World[i].createModelAtLocation = function createModelAtLocationFn() {

    let location = new AR.GeoLocation(lat[i], lon[i], 150);



    let model = new AR.Model("assets/hoge.wt3", {
      onLoaded: World[i].worldLoaded,
      scale: {
        x: 150,
        y: 150,
        z: 150
      },
      rotate: {
        x: 0,    // x(tilt)
        y: -(azimuth(lat[i], lon[i], lat[i + 1], lon[i + 1])), // y(heading)
        z: 0     // z(roll)
      }
    });

    let indicatorImage = new AR.ImageResource("assets/indi.png");

    let indicatorDrawable = new AR.ImageDrawable(indicatorImage, 0.1, {
      verticalAnchor: AR.CONST.VERTICAL_ANCHOR.TOP
    });

    let obj = new AR.GeoObject(location, {
      drawables: {
        cam: [model],
        indicator: [indicatorDrawable]
      }
    });
  };

  /* ロード */
  World[i].worldLoaded = function worldLoadedFn() {
    World[i].loaded = true;
    let e = document.getElementById('loadingMessage');
    e.parentElement.removeChild(e);
  };

  World[i].init();
}


/* GOAL */
let goal = new Object();

goal.loaded = false;
goal.rotating = false;

goal.init = function initFn() {
  goal.createModelAtLocation();
};

goal.createModelAtLocation = function createModelAtLocationFn() {
  let location = new AR.GeoLocation(lat[lat.length - 1], lon[lon.length - 1], 150);
  let model = new AR.Model("assets/goal.wt3", {
    onLoaded: goal.goalLoaded,
    scale: {
      x: 50,
      y: 50,
      z: 50
    },
    rotate: {
      x: 0,    // x(tilt)
      y: 0, // y(heading)
      z: 90     // z(roll)
    }
  });
  let indicatorImage = new AR.ImageResource("assets/indi.png");

  let indicatorDrawable = new AR.ImageDrawable(indicatorImage, 0.1, {
    verticalAnchor: AR.CONST.VERTICAL_ANCHOR.TOP
  });

  let obj = new AR.GeoObject(location, {
    drawables: {
      cam: [model],
      indicator: [indicatorDrawable]
    }
  });
};

goal.goalLoaded = function goalLoadedFn() {
  goal.loaded = true;
  let e = document.getElementById('loadingMessage');
  e.parentElement.removeChild(e);
};

goal.init();