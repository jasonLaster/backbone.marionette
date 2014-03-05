describe("application modules", function(){
  "use strict";

  describe("setting up a module and submodule", function() {
    var MyApp, 
      myModule, ModuleClass, initializeBefore, initializeAfter,
      mySubModule, SubModuleClass, subInitializeBefore, subInitializeAfter;

    beforeEach(function() {
      initializeBefore = jasmine.createSpy("before handler");
      initializeAfter = jasmine.createSpy("after handler");
      subInitializeBefore = jasmine.createSpy("before handler");
      subInitializeAfter = jasmine.createSpy("after handler");
    });
    
    var tests = function() {
      it("should notify me before initialization starts", function(){
        expect(initializeBefore).toHaveBeenCalled();
      });

      it("should notify me after initialization", function(){
        expect(initializeAfter).toHaveBeenCalled();
      });

      it("should add module to the app", function(){
        expect(MyApp.MyModule).not.toBeUndefined();
      });

      it("should return the module", function(){
        expect(myModule).toBe(MyApp.MyModule);
      });

      it("should notify me before subModule initialization starts", function(){
        expect(subInitializeBefore).toHaveBeenCalled();
      });

      it("should notify me after subModule initialization", function(){
        expect(subInitializeAfter).toHaveBeenCalled();
      });

      it("should add submodle to the app", function(){
        expect(MyApp.MyModule.MySubModule).not.toBeUndefined();
      });

      it("should return the submodule", function(){
        expect(mySubModule).toBe(MyApp.MyModule.MySubModule);
      });
    }

    describe("when using default params", function() {
      beforeEach(function() {
        MyApp = new Backbone.Marionette.Application();
        myModule = MyApp.module("MyModule");
        mySubModule = MyApp.module("MyModule.MySubModule");

        myModule.on("before:start", initializeBefore);
        myModule.on("start", initializeAfter);
        mySubModule.on("before:start", subInitializeBefore);
        mySubModule.on("start", subInitializeAfter);

        myModule.start();
      });

      tests();
    });

    describe("when using define function", function() {
      beforeEach(function() {

        MyApp = new Backbone.Marionette.Application();
        myModule = MyApp.module("MyModule", function(MyModule, MyApp) {
            MyModule.on("before:start", initializeBefore);
            MyModule.on("start", initializeAfter);
        });

        mySubModule = MyApp.module("MyModule.MySubModule", function(MySubModule) {
            MySubModule.on("before:start", subInitializeBefore);
            MySubModule.on("start", subInitializeAfter);
        });

        myModule.start();
      });

      tests();
    });

    describe("when using an options object", function() {
      beforeEach(function() {

        ModuleClass = Backbone.Marionette.Module.extend({
            onBeforeStart: initializeBefore,
            onStart: initializeAfter
        });

        SubModuleClass = Backbone.Marionette.Module.extend({
            onBeforeStart: subInitializeBefore,
            onStart: subInitializeAfter
        });

        MyApp = new Backbone.Marionette.Application();
        myModule = MyApp.module("MyModule", {moduleClass: ModuleClass});
        mySubModule = MyApp.module("MyModule.MySubModule", {moduleClass: SubModuleClass});
        myModule.start();
      });

      tests();
    });

    describe("when using a module class", function() {
      beforeEach(function() {
        ModuleClass = Backbone.Marionette.Module.extend({
           onBeforeStart: initializeBefore,
           onStart: initializeAfter
        });

        SubModuleClass = Backbone.Marionette.Module.extend({
           onBeforeStart: subInitializeBefore,
           onStart: subInitializeAfter
        });

        MyApp = new Backbone.Marionette.Application();
        myModule = MyApp.module("MyModule", ModuleClass);
        mySubModule = MyApp.module("MyModule.MySubModule", SubModuleClass);
        MyApp.start();
      });

      tests();
    });
  });

  describe("when specifying sub-modules with a . notation", function(){
    var MyApp, lastModule, parentModule, childModule;

    describe("and the parent module already exists", function(){
      beforeEach(function(){
        MyApp = new Backbone.Marionette.Application();
        MyApp.module("Parent");
        parentModule = MyApp.Parent;

        lastModule = MyApp.module("Parent.Child");

        lastModule.start();
      });

      it("should not replace the parent module", function(){
        expect(MyApp.Parent).toBe(parentModule);
      });

      it("should create the child module on the parent module", function(){
        expect(MyApp.Parent.Child).not.toBeUndefined();
      });

      it("should return the last sub-module in the list", function(){
        expect(lastModule).toBe(MyApp.Parent.Child);
      });
    });

    describe("and the parent module does not exist", function(){
      beforeEach(function(){
        MyApp = new Backbone.Marionette.Application();
        lastModule = MyApp.module("Parent.Child.GrandChild");

        lastModule.start();
      });

      it("should create the parent module on the application", function(){
        expect(MyApp.Parent).not.toBeUndefined;
      });

      it("should create the child module on the parent module", function(){
        expect(MyApp.Parent.Child).not.toBeUndefined;
      });

      it("should create the grandchild module on the parent module", function(){
        expect(MyApp.Parent.Child.GrandChild).not.toBeUndefined;
      });

      it("should return the last sub-module in the list", function(){
        expect(lastModule).toBe(MyApp.Parent.Child.GrandChild);
      });
    });

    describe("When defining a grand-child module with an un-defined child, and starting the parent directly", function(){
      var handler;

      beforeEach(function(){
        handler = jasmine.createSpy("initializer");

        MyApp = new Backbone.Marionette.Application();

        MyApp.module("Parent.Child.GrandChild", function(mod){
          mod.addInitializer(handler);
        });

        MyApp.module("Parent").start();
      });

      it("should create the parent module on the application", function(){
        expect(MyApp.Parent).not.toBeUndefined;
      });

      it("should create the child module on the parent module", function(){
        expect(MyApp.Parent.Child).not.toBeUndefined;
      });

      it("should create the grandchild module on the parent module", function(){
        expect(MyApp.Parent.Child.GrandChild).not.toBeUndefined;
      });

      it("should start the grandchild module", function(){
        expect(handler).toHaveBeenCalled();
      });
    });

    describe("and a module definition callback is provided", function(){
      var definition;

      beforeEach(function(){
        definition = jasmine.createSpy();

        MyApp = new Backbone.Marionette.Application();
        lastModule = MyApp.module("Parent.Child", definition);

        lastModule.start();
      });

      it("should call the module definition for the last module specified", function(){
        expect(definition).toHaveBeenCalled();
      });

      it("should only run the module definition once", function(){
        expect(definition.callCount).toBe(1);
      });

    });
  });

  describe("when specifying the same module twice", function(){
    var MyApp, MyModule;

    beforeEach(function(){
      MyApp = new Backbone.Marionette.Application();

      MyApp.module("MyModule", function(){});
      MyModule = MyApp.MyModule;

      MyApp.module("MyModule", function(){});
    });

    it("should only create the module once", function(){
      expect(MyApp.MyModule).toBe(MyModule);
    });
  });

  describe("when attaching a method to the module parameter in the module definition", function(){
    var MyApp, myFunc;

    beforeEach(function(){
      myFunc = function(){};
      MyApp = new Backbone.Marionette.Application();

      var mod = MyApp.module("MyModule", function(myapp){
        myapp.someFunc = myFunc;
      });

      mod.start();
    });

    it("should make that method publicly available on the module", function(){
      expect(MyApp.MyModule.someFunc).toBe(myFunc);
    });
  });

  describe("when specifying the same module, with a definition, more than once", function(){
    var MyApp, myModule;

    beforeEach(function(){
      MyApp = new Backbone.Marionette.Application();

      myModule = MyApp.module("MyModule", function(MyModule){
        MyModule.definition1 = true;
      });

      MyApp.module("MyModule", function(MyModule){
        MyModule.definition2 = true;
      });

      myModule.start();
    });

    it("should re-use the same module for all definitions", function(){
      expect(myModule).toBe(MyApp.MyModule);
    });

    it("should allow the first definition to modify the resulting module", function(){
      expect(MyApp.MyModule.definition1).toBe(true);
    });

    it("should allow the second definition to modify the resulting module", function(){
      expect(MyApp.MyModule.definition2).toBe(true);
    });

  });

  describe("when returning an object from the module definition", function(){
    var MyApp, MyModule;

    beforeEach(function(){
      MyModule = {};
      MyApp = new Backbone.Marionette.Application();

      MyModule = MyApp.module("CustomModule", function(myapp){
        return {};
      });

      MyModule.start();
    });

    it("should not do anything with the returned object", function(){
      expect(MyApp.CustomModule).toBe(MyModule);
    });
  });

  describe("when creating a sub-module with the . notation, the second parameter should be the object from which .module was called", function(){
    var MyApp, MyModule;

    beforeEach(function(){
      MyModule = {};
      MyApp = new Backbone.Marionette.Application();

      var subMod = MyApp.module("CustomModule.SubModule", function(CustomModule, MyApp){
        MyModule = MyApp;
      });

      subMod.start();
    });

    it("should use the returned object as the module", function(){
      expect(MyModule).toBe(MyApp);
    });
  });

  describe("when providing arguments after the function definition", function(){
    var MyApp, r1, r2, r3, p1, p2, p3;

    beforeEach(function(){
      p1 = {};
      p2 = {};
      p3 = {};
      MyApp = new Backbone.Marionette.Application();

      var mod = MyApp.module("FooModule", function(Foo, MyApp, Backbone, Marionette, $, _, P1Arg, P2Arg){
        r1 = P1Arg;
        r2 = P2Arg;
      }, p1, p2);

      MyApp.module("FooModule", function(Foo, MyApp, Backbone, Marionette, $, _, P3Arg){
        r3 = P3Arg;
      }, p3);

      mod.start();
    });

    it("should pass those arguments to the first definition", function(){
      expect(r1).toBe(p1);
      expect(r2).toBe(p2);
    });

    it("should pass those arguments to the second definition", function(){
      expect(r3).toBe(p3);
    });
  });

});
