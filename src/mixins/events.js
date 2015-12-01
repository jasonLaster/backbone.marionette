import _getValue                from '../utils/_getValue';

export default {
  _getEvents: function(eventsArg) {
    var events = _getValue(eventsArg || this.events, this);

    return this.normalizeUIKeys(events);
  }
};
