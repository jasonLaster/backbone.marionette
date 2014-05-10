describe("closing views", function(){
  "use strict";

  describe("when closing a Marionette.View multiple times", function(){
    var View = Marionette.View.extend({});
    var view;

    beforeEach(function(){
      view = new View();
      view.onBeforeClose = jasmine.createSpy("before destroy");

      view.destroy();
      view.destroy();
    });

    it("should only run the closing code once", function(){
      expect(view.onBeforeClose).toHaveBeenCalled();
    });

    it("should mark the view as destroyed", function(){
      expect(view.isDestroyed).toBe(true);
    });
  });

  describe("when closing a Marionette.ItemView multiple times", function(){
    var View = Marionette.ItemView.extend({});
    var view;

    beforeEach(function(){
      view = new View();
      view.onBeforeClose = jasmine.createSpy("before destroy");

      view.destroy();
      view.destroy();
    });

    it("should only run the closing code once", function(){
      expect(view.onBeforeClose).toHaveBeenCalled();
    });

    it("should mark the view as destroyed", function(){
      expect(view.isDestroyed).toBe(true);
    });
  });

  describe("when rendering a Marionette.ItemView that was previously destroyed", function(){
    var View = Marionette.ItemView.extend({
      template: function(){}
    });
    var view;

    beforeEach(function(){
      view = new View();
      view.onBeforeClose = jasmine.createSpy("before destroy");

      view.destroy();
      view.render();
    });

    it("should mark the view as not destroyed", function(){
      expect(view.isDestroyed).toBe(false);
    });
  });

  describe("when closing a Marionette.CollectionView multiple times", function(){
    var View = Marionette.CollectionView.extend({});
    var view;

    beforeEach(function(){
      view = new View();
      view.onBeforeClose = jasmine.createSpy("before destroy");

      view.destroy();
      view.destroy();
    });

    it("should only run the closing code once", function(){
      expect(view.onBeforeClose).toHaveBeenCalled();
    });

    it("should mark the view as destroyed", function(){
      expect(view.isDestroyed).toBe(true);
    });
  });

  describe("when rendering a Marionette.CollectionView that was previously destroyed", function(){
    var ItemView = Marionette.ItemView.extend({
      template: function(){}
    });

    var CollectionView = Marionette.CollectionView.extend({
      childView: ItemView
    });
    var view;

    beforeEach(function(){
      view = new CollectionView();
      view.onBeforeClose = jasmine.createSpy("before destroy");

      view.destroy();
      view.render();
    });

    it("should mark the view as not destroyed", function(){
      expect(view.isDestroyed).toBe(false);
    });
  });

  describe("when closing a Marionette.CompositeView multiple times", function(){
    var View = Marionette.CompositeView.extend({});
    var view;

    beforeEach(function(){
      view = new View();
      view.onBeforeClose = jasmine.createSpy("before destroy");

      view.destroy();
      view.destroy();
    });

    it("should only run the closing code once", function(){
      expect(view.onBeforeClose).toHaveBeenCalled();
    });

    it("should mark the view as destroyed", function(){
      expect(view.isDestroyed).toBe(true);
    });
  });

  describe("when rendering a Marionette.CompositeView that was previously destroyed", function(){
    var ItemView = Marionette.ItemView.extend({
      template: function(){}
    });

    var CompositeView = Marionette.CompositeView.extend({
      template: function(){},
      childView: ItemView
    });
    var view;

    beforeEach(function(){
      view = new CompositeView();
      view.onBeforeClose = jasmine.createSpy("before destroy");

      view.destroy();
      view.render();
    });

    it("should mark the view as not destroyed", function(){
      expect(view.isDestroyed).toBe(false);
    });
  });

});
