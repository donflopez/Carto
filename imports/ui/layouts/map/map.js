import { Template } from 'meteor/templating';
import { HTTP } from 'meteor/http';

import { Map } from './lib/map.js';

import './map.html';
import './map.scss';

Template.map.onRendered(function () {
  let canvasEl = this.$('#map')[0];
  canvasEl.width = window.innerWidth;
  canvasEl.height = window.innerHeight;
  map = Map.init(this.$('#map')[0]);

  HTTP.get('http://localhost:3000/cartodb-query.json', function (err, res) {
    let area = map.getArea(500000000000, [-73.9802030753509, 40.78151131065725]);
    console.log(area);
    let data = map.filterPoints(area, JSON.parse(res.content).rows);

    map.drawMap(data, 1);

    console.log(map);

    // map.drawMap(data, 1);
  });
  // map.drawPolygon(polygon.coordinates);
});
