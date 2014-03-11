describe("application modules", function(){
  "use strict";
  var app;

  beforeEach(function() {
    app = new Backbone.Marionette.Application();
  });

  describe(".module", function() {
    describe("when creating a module", function() {

      var module, initializeSpy, additionalParam, defineSpy;

      beforeEach(function() {
        app = new Backbone.Marionette.Application();
        initializeSpy = jasmine.createSpy();
        defineSpy = jasmine.createSpy();
      });

      describe("and no params are passed in", function() {
        beforeEach(function() {
          module = app.module('Mod');
        });

        it("should add module to the app", function(){
          expect(module).toBe(app.Mod);
        });
      });

      describe("and the define function is provided", function() {
        beforeEach(function() {
          additionalParam = {};
          module = app.module('Mod', defineSpy, additionalParam);
        });

        it("it should add module to the app", function(){
          expect(module).toBe(app.Mod);
        });

        it("the define function should be called once", function() {
          expect(defineSpy.callCount).toBe(1);
        });

        it("the define function should be called on the module", function() {
          expect(defineSpy.mostRecentCall.object).toBe(module);
        });

        it("the define function should be calld with arguments", function() {
          expect(defineSpy).toHaveBeenCalledWith(
            module,
            app,
            Backbone,
            Marionette,
            Marionette.$,
            _,
            additionalParam
          );
        });
      });

      describe("and the options object is used", function() {
        describe('', function() {
          var options;

          beforeEach(function() {
            var ModuleClass = Backbone.Marionette.Module.extend({
                initialize: initializeSpy,
                propA: 'becomes instance property'
            });

            options = {
              moduleClass: ModuleClass,
              define: defineSpy,
              propB: 'becomes options property'
            };
            module = app.module('Mod', options, additionalParam);
          });

          it("should add module to the app", function(){
            expect(module).toBe(app.Mod);
          });
          
          it("initialize function is called", function() {
            expect(initializeSpy).toHaveBeenCalled();
          });

          it('the define function is called', function() {
            expect(defineSpy).toHaveBeenCalled();
          });

          it("the define function should be called on the module", function() {
            expect(defineSpy.mostRecentCall.object).toBe(module);
          });

          it("the define function is calld with arguments", function() {
            expect(defineSpy).toHaveBeenCalledWith(
              module,
              app,
              Backbone,
              Marionette,
              Marionette.$,
              _,
              additionalParam
            );
          });

          it('initialize function is called with arguments', function() {
            expect(initializeSpy).toHaveBeenCalledWith(options, "Mod", app);
          });

          it("prototype properties are defined", function() {
            expect(module.propA).not.toBeUndefined();
          });

          it("options properties are defined", function() {
            expect(module.options.propB).not.toBeUndefined();
          });
        });

        describe("and initialize is overriden", function() {
          var initializeOptionsSpy;

          beforeEach(function() {
            initializeOptionsSpy = jasmine.createSpy();

            var ModuleClass = Backbone.Marionette.Module.extend({
                initialize: initializeSpy,
                propA: 'becomes instance property'
            });

            module = app.module('Mod', {
              moduleClass: ModuleClass,
              initialize: initializeOptionsSpy,
              propB: 'becomes options property'
            });
          });

          it("initialize function is called", function() {
            expect(initializeOptionsSpy).toHaveBeenCalled();
          });

        })
      });

  	  describe("and using a module class", function() {
        var ModuleClass;

  	    beforeEach(function() {
  	      ModuleClass = Backbone.Marionette.Module.extend({
              initialize: initializeSpy,
              propA: 'becomes instance property'
          });

          module = app.module('Mod', ModuleClass);
  	    });

  	    it("should add module to the app", function(){
          expect(module).toBe(app.Mod);
        });

        it("the initialize function is called", function() {
          expect(initializeSpy).toHaveBeenCalled();
        });

        it('the initialize function is called with arguments', function() {
          // TODO: this is unintended behavior. 
          var defOptions = _.extend({}, ModuleClass);
          expect(initializeSpy).toHaveBeenCalledWith(defOptions, "Mod", app);
        });

        it("prototype properties", function() {
          expect(module.propA).not.toBeUndefined();
        });
  	  });
  	});

    describe("when re-calling module", function() {
      var module;

      beforeEach(function() {
        app = new Backbone.Marionette.Application();
      });

      describe("and no options are passed", function() {
        var module1, module2;
        
        beforeEach(function() {
          module1 = app.module('Mod');
          module2 = app.module('Mod');
        });

        it("returns the same module", function() {
          expect(module1).toBe(module2);
          expect(module1).toBe(app.Mod);
        });
      });

      describe("and define functions are provided", function() {
        beforeEach(function() {
          module = app.module('Mod', function(module, app) {
            module.prop1 = 'first property';
          });

          module = app.module('Mod', function(module, app) {
            module.prop2 = 'second property';
          });
        });

        it("it sets both properties", function() {
          expect(module.prop1).not.toBeUndefined();
          expect(module.prop2).not.toBeUndefined();
        });
      });
    });

    describe("when creating a sub-module", function() {
      var parent, child, grandChild;

      describe("and the parent is already created", function() {
        var parentDefineSpy, childDefineSpy;

        beforeEach(function() {
          parentDefineSpy = jasmine.createSpy();
          childDefineSpy = jasmine.createSpy();

          parent = app.module('parent', parentDefineSpy);
          child = app.module('parent.child', childDefineSpy); 
        });

        it("parent should remain the same", function() {
          expect(parent).toBe(app.parent);
        });

        it("parent definition should be called once", function() {
          expect(parentDefineSpy.callCount).toBe(1);
        });

        it("child should be created", function() {
          expect(child).toBe(app.parent.child);
        });

        it("child definition should be called once", function() {
          expect(childDefineSpy.callCount).toBe(1);
        });
      });

      describe("and the parent is not already created", function() {
        var defineSpy;
        beforeEach(function() {
          defineSpy = jasmine.createSpy();
          child = app.module('parent.child', defineSpy); 
        });

        it("parent should be defined", function() {
          expect(app.parent).not.toBeUndefined();
        })

        it("child should be created", function() {
          expect(child).toBe(app.parent.child);
        });

        it("definition should be called once", function() {
          expect(defineSpy.callCount).toBe(1);
        })
      });
    });
  });

  describe(".start", function() {
    describe("when starting a module", function() {
      var module, startSpy, beforeStartSpy, initializeSpy1, initializeSpy2;
      beforeEach(function() {
        startSpy = jasmine.createSpy();
        beforeStartSpy = jasmine.createSpy();
        initializeSpy1 = jasmine.createSpy();
        initializeSpy2 = jasmine.createSpy();

        module = app.module('Mod');
        module.on('before:start', beforeStartSpy);
        module.on('start', startSpy);
        module.addInitializer(initializeSpy1);
        module.addInitializer(initializeSpy2);

        module.start();
      });

      it('calls before start', function() {
        expect(beforeStartSpy).toHaveBeenCalled();
      });

      it('calls start', function() {
        expect(startSpy).toHaveBeenCalled();
      });

      it('calls initializers', function() {
        expect(initializeSpy1).toHaveBeenCalled();
        expect(initializeSpy2).toHaveBeenCalled();
      });
    });

    describe("when starting a module with sub-modules", function() {
      var module, child;

      beforeEach(function() {
        module = app.module('Mod');
        child = app.module('Mod.Child');
        spyOn(module, 'start').andCallThrough();
        spyOn(child, 'start').andCallThrough();
        app.start();
      });
      
      it('starts module', function() {
        expect(module.start).toHaveBeenCalled();
      });

      it('starts child', function() {
        expect(child.start).toHaveBeenCalled();
      })
    });

    describe("after app is started", function() {

      var module, initializeSpy;

      beforeEach(function() {
        app.start();
        initializeSpy = jasmine.createSpy();

        module = app.module('Mod')
        module.addInitializer(initializeSpy);
        module.start();
      });

      it("creates the module", function() {
        expect(module).toBe(app.Mod);
      });

      it("calls the modules initializers", function() {
        expect(initializeSpy).toHaveBeenCalled();
      });
    });

  });
});
