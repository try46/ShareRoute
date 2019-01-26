// AR関係の関数

/**
 * GPSデータを整形するための関数．
 * @param {string} stringPoi 緯度および経度情報を,および|を用いて1列に並べた文字列.
 * @param {Array<undefined>} latitudeArray 整形後の緯度情報を格納するための空配列.
 * @param {Array<undefined>} longitudeArray 整形後の経度情報を格納するための空配列.
 */
function poiSplit(stringPoi, latitudeArray, longitudeArray) {
  let tmp = stringPoi.split(/,|\|/); // , と | で分割
  for (var i = 0; i < tmp.length; i++) {
    tmp[i] = parseFloat(tmp[i]);
  }

  // 緯度Latitude
  for (var i = 0; i < tmp.length - 1; i = i + 2) {
    latitudeArray.push(tmp[i]);
  }

  // 経度Longitude
  for (var i = 1; i < tmp.length; i = i + 2) {
    longitudeArray.push(tmp[i]);
  }
}

/**
 * 方位角の計算を行う関数．
 * 引数で指定した2地点について，始点からみた終点の方位角を計算する．
 * 方位角は西を基準方位(値は0)とし，時計回りを正の角度とする．
 * すなわち西向きを0度，北向きを90度，東向きを180度，南向きを270度とする．
 * 
 * @param {number} poi0Lat 始点の緯度情報
 * @param {number} poi0Lon 始点の経度情報
 * @param {number} poi1Lat 終点の緯度情報
 * @param {number} poi1Lon 終点の経度情報
 * @return {number} 方位角を表す0から360までの数値
 */
function azimuth(poi0Lat, poi0Lon, poi1Lat, poi1Lon) {
  /* 定数 */
  const toRad = Math.PI / 180; // deg -> rad
  const toDeg = 180 / Math.PI; // rad -> deg

  /* deg -> radへ変換 */
  const x1 = poi0Lon * toRad; //経度
  const y1 = poi0Lat * toRad; // 緯度
  const x2 = poi1Lon * toRad; // 経度
  const y2 = poi1Lat * toRad; // 緯度

  const deltaX = x2 - x1;
  const y = Math.sin(deltaX);
  const x = Math.cos(y1) * Math.tan(y2) - Math.sin(y1) * Math.cos(deltaX);

  const psi = Math.atan2(y, x) * toDeg; // 方位角の計算を実施
  if (psi > 0) {
    return 360 + psi -90;
  } else {
    return psi -90;
  }
}