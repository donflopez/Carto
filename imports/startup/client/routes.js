import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Load layouts
// const layouts = '/imports/ui/layouts/';

import '/imports/ui/layouts/landing/landing.js';
import '/imports/ui/layouts/map/map.js';

function render() {
  BlazeLayout.render(this.name);
}

FlowRouter.route('/landing', {
  name: 'landing',
  action: render,
});

FlowRouter.route('/map', {
  name: 'map',
  action: render,
});
