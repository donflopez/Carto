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


let Map = function ( canvas, data ) {
  let ctx = getCtx( canvas );

  if ( typeof data === 'string' ) {
    // TODO: make api call

    return;
  }



};
