import { HTTP } from 'meteor/http';

import { CV } from './canvas.js';
import { Carto } from './carto.js';

let minX = 1000, minY = 1000, maxX = -1000, maxY = -1000,
    mapData;

function getArea(scale, point) {
  return [[point[0] - (scale * 0.00000000000001), point[1] - (scale * 0.00000000000001)],
          [point[0] + (scale * 0.00000000000001), point[1] + (scale * 0.00000000000001)], ];
}

function checkPoint(area, p) {
  return p[0] > area[0][0] && p[0] < area[1][0] && p[1] > area[0][1] && p[1] < area[1][1];
}

function filterPoints(area, data) {
  let rPoints = [];
  let coord = [];

  for (var i = 0; i < data.length; i++) {
    let field = data[i].the_geom,
        coords = JSON.parse(field).coordinates,
        polygon = coords[0][0],
        breaked = false;

    for (var j = 0; j < polygon.length; j++) {
      let c = polygon[j];

      if (!checkPoint(area, c)) {
        breaked = true;
        break;
      }

      minX = c[0] < minX ? c[0] : minX;
      minY = c[1] < minY ? c[1] : minY;

      maxX = c[0] > maxX ? c[0] : maxX;
      maxY = c[1] > maxY ? c[1] : maxY;
    }

    if (!breaked) {
      coord.push(coords[0][0]);
    }
  }

  mapData = coord;

  return coord;
}

function calculateLimits(data) {
  let coord = [];

  for (var i = 0; i < data.length; i++) {
    let field = data[i].the_geom,
        coords = JSON.parse(field).coordinates,
        polygon = coords[0][0];

    for (var j = 0; j < polygon.length; j++) {
      let c = polygon[j];
      minX = c[0] < minX ? c[0] : minX;
      minY = c[1] < minY ? c[1] : minY;

      maxX = c[0] > maxX ? c[0] : maxX;
      maxY = c[1] > maxY ? c[1] : maxY;
    }

    coord.push(coords[0][0]);
  }

  console.log(maxX, minX, maxY, minY);

  mapData = coord;

  return coord;
}

function drawMap(data, scale) {
  data = data || mapData;

  Map.cv.scale(scale || 1, scale || 1);

  for (var i = 0; i < data.length; i++) {
    let c = data[i],
        copy = new Array(c.length);

    for (var j = 0; j < c.length; j++) {
      copy[j] = Carto.getPoint(minX, minY, maxX, maxY, window.innerWidth, window.innerHeight, c[j]);
    }

    cv.drawPolygon(copy);
  }
}

var Map = {
  drawMap: drawMap,
  calculateLimits: calculateLimits,
  init: init,
  cv: null,
  getArea: getArea,
  filterPoints: filterPoints,
};

function init(element) {
  cv = CV(element);

  Map.cv = cv;

  return Map;
}

export { Map };
