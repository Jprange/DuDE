(function(){

  angular
       .module('app')
       .controller('AppController', [
          'AppService', '$mdSidenav', '$mdBottomSheet', '$log', '$q',
          AppController
       ]);

  /**
   * Main Controller for the Angular Material Todo App
   * @param $scope
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */
  function AppController( AppService, $mdSidenav, $mdBottomSheet, $log, $q) {
    var self = this;

    self.selected        = null;
    self.progress        = 5;
    self.modules         = [ ];
    self.getAvatar       = getAvatar;
    self.selectModule    = selectModule;
    self.toggleSidenav   = toggleSidenav;

    // Load all registered modules
    AppService
          .loadAllModules()
          .then( function( modules ) {
            self.modules  = [].concat(modules);
            self.selected = modules[0];
          });

    // *********************************
    // Internal methods
    // *********************************

    /**
     * Create Avatar SVG String
     */
    function getAvatar() {
      var avatarNum = self.modules.length + 1;
      var avatar    = 'svg-' + avatarNum.toString();
      return avatar;
    }

    /**
     * Select the current avatars
     * @param menuId
     */
    function selectModule(module) {
      self.selected = angular.isNumber(module) ? $scope.modules[module] : module;
      self.toggleSidenav('left');
    }

    /**
     * First hide the bottomsheet IF visible, then
     * hide or Show the 'left' sideNav area
     */
    function toggleSidenav(side) {
      var pending = $mdBottomSheet.hide() || $q.when(true);

      pending.then(function(){
        $mdSidenav(side).toggle();
      });
    }

    self.standardItems = [
      { 
        row: 0, 
        col: 0, 
        text: 'begin',
        editable: false
      },

    ];

    self.moduleButtons = [
      { text: 'if', moduleNum: 1},
      { text: 'while', moduleNum: 1},
      { text: 'variable', moduleNum: 1},
      { text: 'end if', moduleNum: 1},
      { text: 'end loop', moduleNum: 1}
    ];

    self.gridsterOpts = {
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

    self.AddWidget = function (text) {
      var editable = false;
      if(text === 'variable' || text === 'if' || text === 'while') {
        editable = true;
      }
      var w = { 
        row: 0, 
        col: 0, 
        text: text, 
        editable: editable
      };
      self.standardItems.push(w);
    }

    self.DeleteWidget = function  (index) {
      self.standardItems.splice(index, 1);
    }

  }

})();
