import { Template } from 'meteor/templating';
import { HTTP } from 'meteor/http';

import { CV } from './lib/canvas.js';
import { getPoint } from './lib/carto.js';

import './map.html';
import './map.scss';

Template.map.onRendered(function () {
  let canvasEl = this.$('#map')[0];
  canvasEl.width = window.innerWidth;
  canvasEl.height = window.innerHeight;
  var map = CV(this.$('#map')[0]);

  HTTP.get('http://localhost:3000/cartodb-query.json', function (err, res) {
    let rows = JSON.parse(res.content).rows,
        minX = 0, minY = 1000, maxX = -1000, maxY = -1000,
        cord = [];

    for (var i = 0; i < rows.length; i++) {
      let field = rows[i].the_geom,
          coords = JSON.parse(field).coordinates,
          polygon = coords[0][0];

      for (var j = 0; j < polygon.length; j++) {
        let c = polygon[j];
        minX = c[0] < minX ? c[0] : minX;
        minY = c[1] < minY ? c[1] : minY;

        maxX = c[0] > maxX ? c[0] : maxX;
        maxY = c[1] > maxY ? c[1] : maxY;
      }

      cord.push(coords[0][0]);
    }

    for (var i = 0; i < cord.length; i++) {
      let c = cord[i];

      for (var j = 0; j < c.length; j++) {
        c[j] = getPoint(minX, minY, maxX, maxY, window.innerWidth, window.innerHeight, c[j]);
      }

      map.drawPolygon(c);
    }

  });
  // map.drawPolygon(polygon.coordinates);
});
