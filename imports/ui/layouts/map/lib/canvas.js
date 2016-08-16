function getCtx(canvas) {
  return canvas.getContext('2d');
}

function drawPolygon(coordinates, ctx) {
  let c = coordinates,
      nPoints = c.length;

  ctx.beginPath();

  for (var i = nPoints - 1; i > -1; i--) {
    let actP = c[i],
        nextP = c[i - 1 >= 0 ? i - 1 : nPoints - 1];

    ctx.moveTo(actP[0], actP[1]);
    ctx.lineTo(nextP[0], nextP[1]);
  }

  ctx.stroke();
  ctx.fill();
  ctx.closePath();
}

let CV = function (canvas) {

  let ctx = getCtx(canvas);
  CTX = ctx;
  this.drawPolygon = function (polygon) {
    drawPolygon(polygon, ctx);
  };

  this.scale = function (x, y) {
    ctx.scale(x, y);
  };

  return this;
};

export { CV };
