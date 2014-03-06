  describe("application modules", function(){
  "use strict";

  describe("#module", function() {

    var app, module, initializeSpy;

    beforeEach(function() {
      app = new Backbone.Marionette.Application();
      initializeSpy = jasmine.createSpy();
    });
    
    var tests = function() {
      // it("module should be initialized", function(){
      //   expect(initializeSpy).toHaveBeenCalled();
      // });

      it("should add module to the app", function(){
        expect(module).toBe(app.module);
      });
    }

    describe("no params", function() {
      beforeEach(function() {
        module = app.module('module');
        // module.on("initialze", initializeSpy);
      });

      tests();
    });

    describe("define function", function() {
      beforeEach(function() {
        debugger;
        module = app.module('module', function(module, app) {
          // module.on('initialize', initializeSpy);
        });
      });

      tests();
    });

    describe("options object", function() {
      beforeEach(function() {
        var ModuleClass = Backbone.Marionette.Module.extend({
            initialize: initializeSpy
        });

        app.module('module', {moduleClass: ModuleClass});
      });

      tests();
    });

	  describe("when using a module class", function() {
	    beforeEach(function() {
	      var ModuleClass = Backbone.Marionette.Module.extend({
            initialize: initializeSpy
        });
        app.module('module', ModuleClass);
	    });

	    tests();
	  });
	});

});