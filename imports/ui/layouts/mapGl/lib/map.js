import { WebGl } from './webGl.js';

import { Coords } from '../../map/carto/coords.js';

function polygonToLines( polygon, lim ) {
  let lines = [],
      pLen = polygon.length;

  for ( var i = 0; i < pLen; i++ ) {
    let point = polygon[i];

    point = Coords.get.relativePoint( lim.min.x, lim.min.y, lim.max.x, lim.max.y, 2, 2, point );
    point[0] -= 1;
    point[1] -= 1;
    point[2] = 0.0;

    lines.push( point );

    if ( i >= 1 ) {
      lines.push( point );
    }

    if ( i + 1 === pLen ) {
      lines.push( lines[0] );
    }
  }

  return lines;
}

function addToMapLines( line, mapLines ) {
  for ( var i = 0; i < line.length; i++ ) {
    mapLines.push( line[i] );
  }
}

function getMapAsLines( polygons, lim ) {
  let mapLines = [];
  for ( var i = 0; i < polygons.length; i++ ) {
    let polygon = polygons[i],
        line = polygonToLines( polygon, lim );

    addToMapLines( line, mapLines );
  }

  return _.flatten( mapLines );
}

let Map = function ( canvas, data ) {
  const MOVE_DIST = 0.005;
  const SCALE = 1.1;

  let gl = WebGl( canvas ),
      _polygons = Coords.get.polygons( data ),
      limits = Coords.get.limits( _polygons ),
      lines = getMapAsLines( _polygons, limits ),
      coords = [0.0, 0.0],
      scale = - 1.0;

  gl.loadData( lines );

  gl.start();

  document.addEventListener( 'keydown', function ( e ) {
    switch ( e.keyCode ) {
      case 37: // left
        coords[0] += MOVE_DIST;
      break;
      case 38:
        coords[1] -= MOVE_DIST;
      break;
      case 39:
        coords[0] -= MOVE_DIST;
      break;
      case 40:
        coords[1] += MOVE_DIST;
      break;
      case 73:
        scale /= SCALE;
      break;
      case 79:
        scale *= SCALE;
      break;
    }
    console.log( scale );
    gl.goTo( scale, coords[0], coords[1] );
  } );

  return this;
};

export { Map };
