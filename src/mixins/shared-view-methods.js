// ViewMixin
//  ---------

import Backbone                 from 'backbone';
import _                        from 'underscore';
import _getValue                from '../utils/_getValue';
import getOption                from '../utils/getOption';
import { _triggerMethod }       from '../trigger-method';

export default {
  // Overriding Backbone.View's `delegateEvents` to handle
  // `events` and `triggers`
  delegateEvents: function(eventsArg) {

    this._proxyBehaviorViewProperties();

    var viewEvents = this._getEvents(eventsArg);

    if (typeof eventsArg === 'undefined') {
      this.events = viewEvents;
    }

    var combinedEvents = _.extend({},
      this._getBehaviorEvents(),
      viewEvents,
      this._getBehaviorTriggers(),
      this._getTriggers()
    );

    Backbone.View.prototype.delegateEvents.call(this, combinedEvents);

    return this;
  },

  // Handle `modelEvents`, and `collectionEvents` configuration
  delegateEntityEvents: function() {
    this.bindEntityEvents(this.model, this.getOption('modelEvents'));
    this.bindEntityEvents(this.collection, this.getOption('collectionEvents'));

    // bind each behaviors model and collection events
    this._delegateBehaviorEntityEvents();

    return this;
  },

  // Handle unbinding `modelEvents`, and `collectionEvents` configuration
  undelegateEntityEvents: function() {
    this.unbindEntityEvents(this.model, this.getOption('modelEvents'));
    this.unbindEntityEvents(this.collection, this.getOption('collectionEvents'));

    // unbind each behaviors model and collection events
    this._undelegateBehaviorEntityEvents();

    return this;
  },

  // Handle destroying the view and its children.
  destroy: function(...args) {
    if (this._isDestroyed) { return this; }

    this.triggerMethod('before:destroy', ...args);

    // update lifecycle flags
    this._isDestroyed = true;
    this._isRendered = false;

    // unbind UI elements
    this.unbindUIElements();

    // remove the view from the DOM
    // https://github.com/jashkenas/backbone/blob/1.2.3/backbone.js#L1235
    this._removeElement();

    // remove children after the remove to prevent extra paints
    this._removeChildren();

    this._destroyBehaviors(args);

    this.triggerMethod('destroy', ...args);

    this.stopListening();

    return this;
  },

  bindUIElements: function() {
    this._bindUIElements();
    this._bindBehaviorUIElements();

    return this;
  },

  // This method unbinds the elements specified in the "ui" hash
  unbindUIElements: function() {
    this._unbindUIElements();
    this._unbindBehaviorUIElements();

    return this;
  },

  getUI: function(name) {
    this._ensureViewIsIntact();
    return this._getUI(name);
  },

  // import the `triggerMethod` to trigger events with corresponding
  // methods if the method exists
  triggerMethod: function(eventName, ...args) {
    var ret = _triggerMethod(this, arguments);

    this._triggerEventOnBehaviors(arguments);
    this._triggerEventOnParentLayout(eventName, args);

    return ret;
  },
};
