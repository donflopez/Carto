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
    let map = Map( this.$( '#map' )[0], JSON.parse( res.content ).rows );

    map.moveTo( [- 73.976030753509, 40.78151131065725], 10 );
    // tiles = map.loadMapData( JSON.parse( res.content ).rows );
    //
    // let area = map.getArea( 30, [- 73.976030753509, 40.78151131065725] );
    //
    // // console.log( data );
    //
    // map.drawMap( tiles, area );
    //
    // console.log( map );

    // map.drawMap(data, 1);
  } );
  // map.drawPolygon(polygon.coordinates);
} );
