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
        name: 'Sandbox',
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
        editable: false,
        removeable: false
      }
    ];

    var moduleButtons = [
      { text: 'if', moduleNum: 1},
      { text: 'while', moduleNum: 1},
      { text: 'variable', moduleNum: 1},
      { text: 'end if', moduleNum: 1},
      { text: 'end loop', moduleNum: 1}
    ];

    // Promise-based API
    return {
      loadAllModules : function() {
        // Simulate async nature of real remote calls
        return $q.when(modules);
      },
      standardItems: standardItems,
      moduleButtons: moduleButtons
    };
  }

})();
