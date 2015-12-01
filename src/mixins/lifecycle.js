import _getValue                from '../utils/_getValue';
import Renderer                 from '../renderer';
import MarionetteError          from '../error';

export default {
  supportsRenderLifecycle: true,

  supportsDestroyLifecycle: true,

  _isRendered: false,

  _isDestroyed: false,

  isDestroyed: function() {
    return !!this._isDestroyed;
  },

  isRendered: function() {
    return !!this._isRendered;
  },

  // Get the template for this view
  // instance. You can set a `template` attribute in the view
  // definition or pass a `template: "whatever"` parameter in
  // to the constructor options.
  getTemplate: function() {
    return this.getOption('template');
  },

  // Internal method to render the template with the serialized data
  // and template context via the `Marionette.Renderer` object.
  _renderTemplate: function() {
    var template = this.getTemplate();

    // Allow template-less views
    if (template === false) {
      return;
    }

    // Add in entity data and template context
    var data = this.mixinTemplateContext(this.serializeData());

    // Render and add to el
    var html = Renderer.render(template, data, this);
    this.attachElContent(html);
  },

  // Mix in template context methods. Looks for a
  // `templateContext` attribute, which can either be an
  // object literal, or a function that returns an object
  // literal. All methods and attributes from this object
  // are copies to the object passed in.
  mixinTemplateContext: function(target) {
    target = target || {};
    var templateContext = this.getOption('templateContext');
    templateContext = _getValue(templateContext, this);
    return _.extend(target, templateContext);
  },

  // Prepares the special `model` property of a view
  // for being displayed in the template. By default
  // we simply clone the attributes. Override this if
  // you need a custom transformation for your view's model
  serializeModel: function() {
    if (!this.model) { return {}; }
    return _.clone(this.model.attributes);
  },

  // Internal helper method to verify whether the view hasn't been destroyed
  _ensureViewIsIntact: function() {
    if (this._isDestroyed) {
      throw new MarionetteError({
        name: 'ViewDestroyedError',
        message: 'View (cid: "' + this.cid + '") has already been destroyed and cannot be used.'
      });
    }
  }
};
