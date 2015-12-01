import getUniqueEventName       from '../utils/getUniqueEventName';
import _getValue                from '../utils/_getValue';
import getOption                from '../utils/getOption';
import { _triggerMethod }       from '../trigger-method';

export default {
  // Configure `triggers` to forward DOM events to view
  // events. `triggers: {"click .foo": "do:foo"}`
  _getTriggers: function() {
    if (!this.triggers) { return; }

    // Allow `triggers` to be configured as a function
    var triggers = this.normalizeUIKeys(_.result(this, 'triggers'));

    // Configure the triggers, prevent default
    // action and stop propagation of DOM events
    return _.reduce(triggers, function(events, value, key) {
      key = getUniqueEventName(key);
      events[key] = this._buildViewTrigger(value);
      return events;
    }, {}, this);
  },

  // Internal method to create an event handler for a given `triggerDef` like
  // 'click:foo'
  _buildViewTrigger: function(triggerDef) {
    var options = _.defaults({}, triggerDef, {
      preventDefault: true,
      stopPropagation: true
    });

    var eventName = _.isObject(triggerDef) ? options.event : triggerDef;

    return function(e) {
      if (e) {
        if (e.preventDefault && options.preventDefault) {
          e.preventDefault();
        }

        if (e.stopPropagation && options.stopPropagation) {
          e.stopPropagation();
        }
      }

      var args = {
        view: this,
        model: this.model,
        collection: this.collection
      };

      this.triggerMethod(eventName, args);
    };
  },

  _triggerEventOnParentLayout: function(eventName, args) {
    var layoutView = this._parentItemView();
    if (!layoutView) {
      return;
    }

    // invoke triggerMethod on parent view
    var eventPrefix = getOption(layoutView, 'childViewEventPrefix');
    var prefixedEventName = eventPrefix + ':' + eventName;
    var callArgs = [this].concat(args);

    _triggerMethod(layoutView, [prefixedEventName].concat(callArgs));

    // call the parent view's childViewEvents handler
    var childViewEvents = getOption(layoutView, 'childViewEvents');

    // since childViewEvents can be an object or a function use Marionette._getValue
    // to handle the abstaction for us.
    childViewEvents = _getValue(childViewEvents, layoutView);
    var normalizedChildEvents = layoutView.normalizeMethods(childViewEvents);

    if (!!normalizedChildEvents && _.isFunction(normalizedChildEvents[eventName])) {
      normalizedChildEvents[eventName].apply(layoutView, callArgs);
    }
  }
};
