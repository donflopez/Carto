import { Template } from 'meteor/templating';
import { HTTP } from 'meteor/http';

import { Map } from './lib/map.js';
import {start} from './lib/wgl.js';

import './mapgl.html';
import './mapgl.scss';

Template.mapgl.onRendered( function () {
  let canvasEl = this.$( '#mapgl' )[0];

  canvasEl.width = window.innerWidth;
  canvasEl.height = window.innerHeight;

  HTTP.get( 'http://localhost:3000/cartodb-query.json', function ( err, res ) {
    // start( JSON.parse( res.content ).rows );
    myMap = Map( canvasEl, JSON.parse( res.content ).rows );
    //
  } );

} );
