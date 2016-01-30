(function(){
  'use strict';

  angular.module('app')
         .service('AppService', ['$q', AppService]);

  /**
   * Lists DataService
   * Uses embedded, hard-coded data model; acts asynchronously to simulate
   * remote data service call(s).
   *
   * @returns {{loadAll: Function}}
   * @constructor
   */
  function AppService($q){
    var modules = [
      {
        name: 'Variables',
        avatar: 'svg-1',
        todos: [
          { title: 'Milk', done: false },
          { title: 'Fruit', done: false },
          { title: 'Bread', done: false },
          { title: 'Cereal', done: false },
          { title: 'Sandwich Meat', done: false },
          { title: 'Vegetables', done: false }
        ]
      },
      {
        name: 'Conditionals',
        avatar: 'svg-2',
        todos: [
          { title: 'Kitchen', done: false },
          { title: 'Bathroom', done: false },
          { title: 'Vacuum', done: false },
          { title: 'Windows', done: false }
        ]
      },
      {
        name: 'Loops',
        avatar: 'svg-3',
        todos: [
          { title: 'Oil Change', done: false },
          { title: 'Check Tire Pressure', done: false },
          { title: 'Check Brakes', done: false }
        ]
      },
      {
        name: 'Subroutines',
        avatar: 'svg-4',
        todos: [
          { title: 'Passport', done: false },
          { title: 'Green Card', done: false },
          { title: 'Laptop + Charger', done: false },
          { title: 'Phone + Charger', done: false }
        ]
      }
    ];

    var standardItems = [
      {
        row: 0,
        col: 0,
        text: 'begin',
        editable: false
      }
    ];

    var moduleButtons = [
      { text: 'if', moduleNum: 1},
      { text: 'while', moduleNum: 1},
      { text: 'variable', moduleNum: 1},
      { text: 'end if', moduleNum: 1},
      { text: 'end loop', moduleNum: 1}
    ];

    var gridsterOpts = {
        columns: 8, // the width of the grid, in columns
        pushing: false, // whether to push other items out of the way on move or resize
        floating: false, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
        swapping: true, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
        width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
        colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
        rowHeight: 100, // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
        margins: [10, 10], // the pixel distance between each widget
        outerMargin: true, // whether margins apply to outer edges of the grid
        isMobile: false, // stacks the grid items if true
        mobileBreakPoint: 200, // if the screen is not wider that this, remove the grid layout and stack the items
        mobileModeEnabled: true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
        minColumns: 1, // the minimum columns the grid must have
        minRows: 2, // the minimum height of the grid, in rows
        maxRows: 20,
        defaultSizeX: 2, // the default width of a gridster item, if not specifed
        defaultSizeY: 1, // the default height of a gridster item, if not specified
        minSizeX: 1, // minimum column width of an item
        maxSizeX: null, // maximum column width of an item
        minSizeY: 1, // minumum row height of an item
        maxSizeY: null, // maximum row height of an item
        resizable: {
           enabled: false
        },
        draggable: {
           enabled: true, // whether dragging items is supported
           handle: '.my-class', // optional selector for resize handle
           start: function(event, $element, widget) {}, // optional callback fired when drag is started,
           drag: function(event, $element, widget) {}, // optional callback fired when item is moved,
           stop: function(event, $element, widget) {} // optional callback fired when item is finished dragging
        }
    };

    // Promise-based API
    return {
      loadAllModules : function() {
        // Simulate async nature of real remote calls
        return $q.when(modules);
      },
      standardItems: standardItems,
      moduleButtons: moduleButtons,
      gridsterOpts: gridsterOpts
    };
  }

})();
