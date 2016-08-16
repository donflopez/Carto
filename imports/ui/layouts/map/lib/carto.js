function getData(rows, transformation) {

}

function getRang(min, max) {
  return (max - min);
}

function rule(rang, size, val) {
  return val * size / rang;
}

function getPoint(minX, minY, maxX, maxY, w, h, coord) {
  let rangX = getRang(minX, maxX),
      rangY = getRang(minY, maxY);

  return [rule(rangX, w, coord[0] - minX), rule(rangY, h, coord[1] - minY)];
}

let Carto = {
  getPoint: getPoint,
};

export { Carto };
