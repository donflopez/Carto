import { Coords } from './coords.js';

const X = 0;
const Y = 1;

function getTilesInPolygon( ref, dim, polygon ) {
  let cordHash = {},
      tiles = [];

  for ( var i = 0; i < polygon.length; i++ ) {
    let p = polygon[i],
        x = parseInt( ( p[X] - ref[X] ) / dim ),
        y = parseInt( ( p[Y] - ref[Y] ) / dim );

    if ( !cordHash[x + ':' + y] ) {
      tiles.push( [x, y] );
    }

    cordHash[x + ':' + y] = true;
  }

  return tiles;
}

function getTileFromCoords( ref, side, coords ) {
  return [
    Math.ceil( ( coords[X] - ref[X] ) / side ),
    Math.ceil( ( coords[Y] - ref[Y] ) / side )
  ];
}


function generateTilesFromPolygons( area, dim, coords ) {
  dim *= 2;
  let size = Coords.getAreaSize( area ),
      nHTiles = parseInt( size.w / dim ),
      nVTiles = parseInt( size.h / dim ),
      tileMap = new Array( nHTiles );

  for ( var i = 0; i < coords.length; i++ ) {
    let c = coords[i],
        tiles = getTilesInPolygon( lim, dim, c );

    for ( var j = 0; j < tiles.length; j++ ) {
      let x = tiles[j][X],
          y = tiles[j][Y];

      if ( !tileMap[x] ) {

        tileMap[x] = new Array( nVTiles );

      }
      else if ( !tileMap[x][y] ) {

        tileMap[x][y] = [];

      }

      tileMap[x][y].push( c );
    }
  }

  return tileMap;
}

let Tiles = {
  get: {
    inPolygon: getTilesInPolygon,
    inCoords: getTileFromCoords,
  },
  generate: {
    fromPolygons: generateTilesFromPolygons
  }
};

export { Tiles };
