import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Load layouts
// const layouts = '/imports/ui/layouts/';

import '/imports/ui/layouts/landing/landing.js';
import '/imports/ui/layouts/map/map.js';
import '/imports/ui/layouts/mapGl/mapgl.js';

function render() {
  BlazeLayout.render( this.name );
}

FlowRouter.route( '/', {
  name: 'landing',
  action: render,
} );

FlowRouter.route( '/canvas', {
  name: 'map',
  action: render,
} );

FlowRouter.route( '/webgl', {
  name: 'mapgl',
  action: render,
} );
