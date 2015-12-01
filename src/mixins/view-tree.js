import View                     from '../view';

export default {
  // used as the prefix for child view events
  // that are forwarded through the layoutview
  childViewEventPrefix: 'childview',

  // Returns an array of every nested view within this view
  _getNestedViews: function() {
    var children = this._getImmediateChildren();

    if (!children.length) { return children; }

    return _.reduce(children, function(memo, view) {
      if (!view._getNestedViews) { return memo; }
      return memo.concat(view._getNestedViews());
    }, children);
  },

  // Walk the _parent tree until we find a view (if one exists).
  // Returns the parent view hierarchically closest to this view.
  _parentItemView: function() {
    var parent  = this._parent;

    while (parent) {
      if (parent instanceof View) {
        return parent;
      }
      parent = parent._parent;
    }
  }
};
