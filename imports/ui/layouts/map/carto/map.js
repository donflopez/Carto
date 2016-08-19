import { Coords } from './coords.js';
import { Tiles } from './tiles.js';

function getCtx( canvas ) {
  return canvas.getContext( '2d' );
}

function drawPolygon( coordinates, ctx ) {
  let c = coordinates,
      nPoints = c.length;

  ctx.beginPath();

  for ( var i = nPoints - 1; i > - 1; i-- ) {
    let actP = c[i],
        nextP = c[i - 1 >= 0 ? i - 1 : nPoints - 1];

    ctx.moveTo( actP[0], actP[1] );
    ctx.lineTo( nextP[0], nextP[1] );
  }

  ctx.stroke();
  ctx.fill();
  ctx.closePath();
}

function clean( ctx, size ) {
  ctx.clearRect( 0, 0, size.w, size.h );
}

let Map = function ( canvas, data ) {
  const AREA_SIZE = 0.001;

  let screenSize = {
    w: window.innerWidth,
    h: window.innerHeight
  };

  let ctx = getCtx( canvas ),
      _polygons = Coords.get.polygons( data ),
      _limits = Coords.get.limits( _polygons ),
      _tiles = Tiles.generate.fromPolygons( [[_limits.min.x, _limits.min.y], [_limits.max.x, _limits.max.y]], 0.0005, _polygons );

  this.moveTo = function ( coords, zoom ) {
    let area = Coords.get.area( zoom, coords );

    clean( ctx, screenSize );

    Tiles.get.inArea( area, [_limits.min.x, _limits.min.y], _tiles, AREA_SIZE,
      tile => {
        Tiles.get.polygonsInTile( tile, polygon => {
          for ( var i = 0; i < polygon.length; i++ ) {
            let point = polygon[i];

            polygon[i] = Coords.get.relativePoint( area[0][0], area[0][1], area[1][0], area[1][1], screenSize.w, screenSize.h, point );
          }

          drawPolygon( polygon, ctx );
        } );
      }
    );

  };

  return this;

};

export { Map };
