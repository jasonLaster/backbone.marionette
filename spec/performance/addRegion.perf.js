$(function(){

  var MyRegion = Backbone.Marionette.Region.extend({
    el: "#region",
      Foooooooo: "bar"
  });

  var MyRegion2 = Backbone.Marionette.Region.extend({
    el: "#region2"
  });



  JSLitmus.test('addRegion:: Add region selectors', function() {
    var MyApp = new Backbone.Marionette.Application();
    MyApp.addRegions({
      MyRegion: MyRegion,
      anotherRegion: MyRegion2
    });
    MyApp.start();
  });

  JSLitmus.test('addRegion:: Add region objects', function() {
    var MyApp = new Backbone.Marionette.Application();
    MyApp.addRegions({
      MyRegion: "#region",
      anotherRegion: "region2"
    });
    MyApp.start();
  });


  // --------------------------------------------
});
