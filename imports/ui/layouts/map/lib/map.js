import { HTTP } from 'meteor/http';

import { CV } from './canvas.js';
import { Carto } from './carto.js';

let mapData,
    memoArea,
    memoLimit;

function loadMapData( geom ) {
  let rawData = Carto.getData( geom ),
      tiles = generateTiles( 0.0005, rawData );

  return tiles;
}

function getTilePolygon( lim, dim, coords ) {
  let cordHash = {},
      tiles = [];

  for ( var i = 0; i < coords.length; i++ ) {
    let c = coords[i],
        x = parseInt( ( c[0] - lim.min.x ) / dim ),
        y = parseInt( ( c[1] - lim.min.y ) / dim );

    cordHash[x + ':' + y] = true;
  }

  for ( var hash in cordHash ) {
    if ( cordHash.hasOwnProperty( hash ) ) {
      tiles.push( hash.split( ':' ) );
    }
  }

  return tiles;
}

function getTile( lim, dim, coords ) {
  return [
    Math.ceil( ( coords[0] - lim.min.x ) / dim ),
    Math.ceil( ( coords[1] - lim.min.y ) / dim )
  ];
}

function generateTiles( dim, coords ) {
  dim *= 2;

  let lim = calculateLimits( coords, true ),
      width = lim.max.x - lim.min.x,
      height = lim.max.y - lim.min.y,
      nHTiles = parseInt( width / dim ),
      nVTiles = parseInt( height / dim ),
      tileMap = new Array( nHTiles );

  for ( var i = 0; i < coords.length; i++ ) {
    let c = coords[i],
        tiles = getTilePolygon( lim, dim, c );

    for ( var j = 0; j < tiles.length; j++ ) {
      let x = tiles[j][0],
          y = tiles[j][1];

      if ( !tileMap[x] ) {
        tileMap[x] = new Array( nVTiles );
      }

      if ( !tileMap[x][y] ) {
        tileMap[x][y] = [];
      }

      tileMap[x][y].push( c );
    }
  }

  return tileMap;
}

function getArea( scale, point ) {
  return [[point[0] - ( scale * 0.0005 ), point[1] - ( scale * 0.0005 )],
          [point[0] + ( scale * 0.0005 ), point[1] + ( scale * 0.0005 )] ];
}

function checkPoint( area, p ) {
  return p[0] > area[0][0] && p[0] < area[1][0] && p[1] > area[0][1] && p[1] < area[1][1];
}

function filterPoints( area, data ) {
  if ( memoArea == area ) {
    return mapData;
  }

  let coord = [];

  for ( var i = 0; i < data.length; i++ ) {
    let field = data[i].the_geom,
        coords = JSON.parse( field ).coordinates,
        polygon = coords[0][0],
        breaked = false,
        breaks = 0;

    for ( var j = 0; j < polygon.length; j++ ) {
      let c = polygon[j];

      if ( ! checkPoint( area, c ) ) {
        breaks++;

        breaked = breaks === polygon.length;
      }
    }

    if ( ! breaked ) {
      coord.push( coords[0][0] );
    }
  }

  mapData = coord;

  return coord;
}

function calculateLimits( data, redo ) {

  if ( memoLimit && !redo ) {
    return memoLimit;
  }

  let minX = 1000, minY = 1000, maxX = - 1000, maxY = - 1000;

  for ( var i = 0; i < data.length; i++ ) {
    let polygon = data[i];

    for ( var j = 0; j < polygon.length; j++ ) {
      let c = polygon[j];

      minX = c[0] < minX ? c[0] : minX;
      minY = c[1] < minY ? c[1] : minY;

      maxX = c[0] > maxX ? c[0] : maxX;
      maxY = c[1] > maxY ? c[1] : maxY;
    }
  }

  memoLimit = { max: { x: maxX, y: maxY }, min: { x: minX, y: minY } };

  return memoLimit;
}

function getTilesFromArea( area, tiles, dim ) {
  let lim = calculateLimits( );
  let topLeftTile = getTile( lim, dim, area[0] ),
      bottomRightTile = getTile( lim, dim, area[1] ),
      subTiles = [];

  // console.log( tiles );

  for ( var i = topLeftTile[0]; i <= bottomRightTile[0]; i++ ) {
    for ( var j = topLeftTile[1]; j <= bottomRightTile[1]; j++ ) {
      // console.log( 'hehehe', i, j, tiles[i][j] );
      if ( tiles[i][j] ) {
        subTiles.push( tiles[i][j] );
      }
    }
  }

  return subTiles;
}

function drawMap( tiles, area ) {
  let subTiles = getTilesFromArea( area, tiles, 0.001 );

  for ( var i = 0; i < subTiles.length; i++ ) {
    let tile = subTiles[i];
    if ( tile ) {
      for ( var j = 0; j < tile.length; j++ ) {
        let polygon = tile[j];
        // console.log( polygon );
        // copy[j] = Carto.getPoint( area[0][0], area[0][1], area[1][0], area[1][1], window.innerWidth, window.innerHeight, polygon );
        let copy = new Array( polygon.length );

        for ( var k = 0; k < polygon.length; k++ ) {
          let point = polygon[k];

          copy[k] = Carto.getPoint( area[0][0], area[0][1], area[1][0], area[1][1], window.innerWidth, window.innerHeight, point );
        }

        cv.drawPolygon( copy );
      }

    }
  }
}

var Map = {
  drawMap: drawMap,
  calculateLimits: calculateLimits,
  init: init,
  cv: null,
  getArea: getArea,
  filterPoints: filterPoints,
  loadMapData: loadMapData
};

function init( element ) {
  cv = CV( element );

  Map.cv = cv;

  return Map;
}

export { Map };
