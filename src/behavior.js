// Behavior
// --------

// A Behavior is an isolated set of DOM /
// user interactions that can be mixed into any View.
// Behaviors allow you to blackbox View specific interactions
// into portable logical chunks, keeping your views simple and your code DRY.

import _                  from 'underscore';
import MarionetteObject   from './object';
import UIMixin            from './mixins/ui';
import getUniqueEventName from './utils/getUniqueEventName';

var Behavior = MarionetteObject.extend({
  cidPrefix: 'mnb',

  constructor: function(options, view) {
    // Setup reference to the view.
    // this comes in handle when a behavior
    // wants to directly talk up the chain
    // to the view.
    this.view = view;
    this.defaults = _.result(this, 'defaults') || {};
    this.options  = _.extend({}, this.defaults, options);
    // Construct an internal UI hash using
    // the behaviors UI hash and then the view UI hash.
    // This allows the user to use UI hash elements
    // defined in the parent view as well as those
    // defined in the given behavior.
    // This order will help the reuse and share of a behavior
    // between multiple views, while letting a view override a
    // selector under an UI key.
    this.ui = _.extend({}, _.result(this, 'ui'), _.result(view, 'ui'));

    MarionetteObject.apply(this, arguments);
  },

  // proxy behavior $ method to the view
  // this is useful for doing jquery DOM lookups
  // scoped to behaviors view.
  $: function() {
    return this.view.$.apply(this.view, arguments);
  },

  // Stops the behavior from listening to events.
  // Overrides Object#destroy to prevent additional events from being triggered.
  destroy: function() {
    this.stopListening();

    return this;
  },

  proxyViewProperties: function() {
    this.$el = this.view.$el;
    this.el = this.view.el;

    return this;
  },

  bindUIElements: function() {
    this._bindUIElements();

    return this;
  },

  unbindUIElements: function() {
    this._unbindUIElements();

    return this;
  },

  getUI: function(name) {
    this.view._ensureViewIsIntact();
    return this._getUI(name);
  },

  // Handle `modelEvents`, and `collectionEvents` configuration
  delegateEntityEvents: function() {
    this.undelegateEntityEvents();

    this.bindEntityEvents(this.view.model, this.getOption('modelEvents'));
    this.bindEntityEvents(this.view.collection, this.getOption('collectionEvents'));

    return this;
  },

  undelegateEntityEvents: function() {
    this.unbindEntityEvents(this.view.model, this.getOption('modelEvents'));
    this.unbindEntityEvents(this.view.collection, this.getOption('collectionEvents'));

    return this;
  },

  _getEvents: function() {
    // Normalize behavior events hash to allow
    // a user to use the @ui. syntax.
    var behaviorEvents = this.normalizeUIKeys(_.result(this, 'events'));

    // binds the handler to the behavior and builds a unique eventName
    return _.reduce(behaviorEvents, function(events, behaviorHandler, key) {
      if (!_.isFunction(behaviorHandler)) {
        behaviorHandler = this[behaviorHandler];
      }
      if (!behaviorHandler) { return; }
      key = getUniqueEventName(key);
      events[key] = _.bind(behaviorHandler, this);
      return events;
    } , {}, this);
  },

  // Internal method to build all trigger handlers for a given behavior
  _getTriggers: function() {
    if (!this.triggers) { return; }

    // Normalize behavior triggers hash to allow
    // a user to use the @ui. syntax.
    var behaviorTriggers = this.normalizeUIKeys(_.result(this, 'triggers'));

    return _.reduce(behaviorTriggers, function(events, eventName, key) {
      key = getUniqueEventName(key);
      events[key] = this.view._buildViewTrigger(eventName);
      return events;
    } , {}, this);
  }

});

_.extend(Behavior.prototype, UIMixin);

export default Behavior;
