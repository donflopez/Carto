const SCALE = 0.0005;
const X = 0;
const Y = 1;

function getData( geom ) {
  let coords = new Array( geom.length );

  for ( var i = 0; i < geom.length; i++ ) {
    let row = JSON.parse( geom[i].the_geom ).coordinates;

    coords[i] = row[0][0];
  }

  return coords;
}

function getRang( min, max ) {
  return ( max - min );
}

function getAreaSize( area ) {
  return { w: getRang( area[1][X], area[0][X] ), h: getRang( area[1][Y], area[0][Y] ) };
}

function rule( rang, size, val ) {
  return val * size / rang;
}

function getRelativePoint( minX, minY, maxX, maxY, w, h, coord ) {
  let rangX = getRang( minX, maxX ),
      rangY = getRang( minY, maxY );

  return [rule( rangX, w, coord[0] - minX ), rule( rangY, h, coord[1] - minY )];
}

function isInArea( area, point ) {
  return point[0] > area[0][0] && point[0] < area[1][0] && point[1] > area[0][1] && point[1] < area[1][1];
}

function getArea( scale, point ) {
  return [[point[0] - ( scale * SCALE ), point[1] - ( scale * SCALE )],
          [point[0] + ( scale * SCALE ), point[1] + ( scale * SCALE )] ];
}

function calculateLimits( data, redo ) {

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

  return { max: { x: maxX, y: maxY }, min: { x: minX, y: minY } };
}

function getPointsInPolygon( polygon, fn ) {
  if ( !fn ) return polygon;

  for ( var i = 0; i < polygon.length; i++ ) {
    let point = polygon[i];

    if ( fn ) {
      fn( point );
    }
  }
}

let Coords = {

  get: {
    areaSize: getAreaSize,
    relativePoint: getRelativePoint,
    data: getData,
    area: getArea,
    limits: calculateLimits,
    pointsInPolygon: getPointsInPolygon
  },
  isInArea: isInArea

};

export { Coords };
