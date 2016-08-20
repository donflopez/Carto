import { Template } from 'meteor/templating';
import { HTTP } from 'meteor/http';

import { Map } from './carto/map.js';

import './map.html';
import './map.scss';

Template.map.onRendered( function () {
  let canvasEl = this.$( '#map' )[0];
  canvasEl.width = window.innerWidth;
  canvasEl.height = window.innerHeight;
  // map = Map.init( this.$( '#map' )[0] );

  HTTP.get( 'http://localhost:3000/cartodb-query.json', function ( err, res ) {
    const MOVE_DIST = 0.0001;
    const SCALE = 0.1;
    let map = Map( canvasEl, JSON.parse( res.content ).rows );
    let coords = [- 73.976030753509, 40.78151131065725],
        scale = 10;

    map.moveTo( coords, scale );

    document.addEventListener( 'keydown', e => {
      switch ( e.keyCode ) {
        case 37: //left
          coords[0] -= MOVE_DIST;
          break;
        case 38:
          coords[1] -= MOVE_DIST;
          break;
        case 39:
          coords[0] += MOVE_DIST;
          break;
        case 40:
          coords[1] += MOVE_DIST;
          break;
        case 73:
          scale -= SCALE;
          break;
        case 79:
          scale += SCALE;
          break;
      }
      requestAnimationFrame( function () {
        map.moveTo( coords, scale );
      } );
    } );
  } );
  // map.drawPolygon(polygon.coordinates);
} );
