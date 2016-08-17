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

function rule( rang, size, val ) {
  return val * size / rang;
}

function getPoint( minX, minY, maxX, maxY, w, h, coord ) {
  let rangX = getRang( minX, maxX ),
      rangY = getRang( minY, maxY );

  return [rule( rangX, w, coord[0] - minX ), rule( rangY, h, coord[1] - minY )];
}

let Carto = {
  getPoint: getPoint,
  getData: getData,
};

export { Carto };
