(function(){

  angular
       .module('app')
       .controller('AppController', [
          'AppService', '$mdSidenav', '$log', '$q',
          AppController
       ]);

  /**
   * Main Controller for the Angular Material Todo App
   * @param $scope
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */
  function AppController( AppService, $mdSidenav, $log, $q) {
    var self = this;

    // Data
    self.selected        = null;
    self.progress        = 5;
    self.modules         = [ ];
    self.module          = 0;
    self.instruction     = "";
    self.instructionNum  = 0;
    self.instructionList = null;
    self.standardItems   = AppService.standardItems;
    self.moduleButtons   = AppService.moduleButtons;

    // Functions
    self.getAvatar       = getAvatar;
    self.selectModule    = selectModule;
    self.toggleSidenav   = toggleSidenav;
    self.AddWidget       = AddWidget;
    self.DeleteWidget    = DeleteWidget;

    // Load all registered modules
    AppService
      .loadAllModules()
      .then( function( modules ) {
        self.modules         = [].concat(modules);
        self.instructionList = self.modules[self.module].instructions;
        self.instruction     = self.instructionList[self.instructionNum];
        self.selected        = modules[0];
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
     * Select the module
     * @param menuId
     */
    function selectModule(module) {
      self.selected = angular.isNumber(module) ? self.modules[module] : module;
      self.toggleSidenav('left');
    }

    /**
     * First hide the bottomsheet IF visible, then
     * hide or Show the 'left' sideNav area
     */
    function toggleSidenav(side) {
      $mdSidenav(side).toggle();
    }

    /**
     * Gridster Add Widget Functionality
     */
    function AddWidget(text) {
      var editable = false;
      if(text === "variable" || text === "if" || text === "while") {
        editable = true;
      }
      var w = {
        row: 0,
        col: 0,
        text: text,
        editable: editable,
        removeable: true
      };
      self.standardItems.push(w);
    }

    /**
     * Gridster Delete Widget Functionality
     */
    function DeleteWidget(index) {
      self.standardItems.splice(index, 1);
    }

    self.Start = function () {
      console.log(self.buildData());
      // $.ajax({
      //   type: "POST",
      //   url: 'http://456ec686.ngrok.com/evaluate',
      //   data: self.buildData(),
      //   success: success,
      //   dataType: dataType
      // });
    }

    self.NextInstruction = function () {
      if(self.instructionNum < self.instructionList.length - 1) {
        self.instructionNum = self.instructionNum + 1
        self.instruction = self.instructionList[self.instructionNum];
      }
    }

    self.PreviousInstruction = function () {
      if(self.instructionNum > 1) {
        self.instructionNum = self.instructionNum - 1
        self.instruction = self.instructionList[self.instructionNum];
      }
    }

    self.NextModule = function () {
      self.instructionNum = 0;
      self.module = self.module < 3 ? self.module + 1 : 3;
      self.progress = 25 + self.module * 25;
      self.selected = angular.isNumber(self.module) ? self.modules[self.module] : self.module;
      self.instructionList = self.modules[self.module].instructions;
      self.instruction     = self.instructionList[self.instructionNum];
    }

    self.PreviousModule = function () {
      self.instructionNum = 0;
      self.module = self.module > 0 ? self.module - 1 : 0;
      self.progress = 25 + self.module * 25;
      self.selected = angular.isNumber(self.module) ? self.modules[self.module] : self.module;
      self.instructionList = self.modules[self.module].instructions;
      self.instruction     = self.instructionList[self.instructionNum];
    }

    self.buildData = function () {
      var json = JSON.parse('{"program":[] }');
      // Push begin
      json.program.push({
        type: "begin",
        id: 0
      })
      if(self.standardItems.length == 1) {
        self.error('Please add stuff');
      }
      var newArrray = self.standardItems.slice(0);
      newArrray.splice(0, 1);
      console.log(newArrray);

      while(newArrray.length > 0) {
        console.log(newArrray[0].text);
        if (newArrray[0].text === 'variable') {

          json.program.push({
           type: newArrray[0].text,
            id: newArrray[0].row,
            data: {
              varname: newArrray[0].var,
              exp: newArrray[0].num
            }
          })
          newArrray.splice(0, 1);
        } else if (newArrray[0].text === 'if') {

          var children = [];

          while (newArrray.length != 1 && newArrray[1].text != 'end if') {
            console.log(newArrray[1]);
            children.push({
              type: newArrray[1].text,
              id: newArrray[1].row,
              data: {
                text: newArrray[1].var,
                value: newArrray[1].num
              }
            })

            if (newArrray.length === 1) {
              return self.error('rerrr');
            }

            newArrray.splice(1, 1);
          }

          json.program.push({
            type: newArrray[0].text,
            id: newArrray[0].row,
            data: {
              predicate: newArrray[0].predicate,
              branch: children
            }
          })

          newArrray.splice(0, 1);

          if (newArrray.length > 0 && newArrray[0].text === 'end if')  {
            json.program.push({
              type: newArrray[0].text,
              id: newArrray[0].row
            })

          } else {
            self.error('Please use end if');
          }

        } else if (newArrray[0].text === 'while') {

          var children = [];

          while (newArrray.length != 1 && newArrray[1].text != 'end loop') {
            children.push({
              type: newArrray[1].text,
              id: newArrray[1].row,
              data: {
                varname: newArrray[1].var,
                exp: newArrray[1].num
              }
            })

            if (newArrray.length === 1) {
              return self.error('rerrr');
            }

            newArrray.splice(1, 1);
          }

          json.program.push({
            type: newArrray[0].text,
            id: newArrray[0].row,
            data: {
              predicate: newArrray[0].predicate,
              branch: children
            }
          })

          newArrray.splice(0, 1);

          if (newArrray.length > 0 && newArrray[0].text === 'end loop')  {
            json.program.push({
              type: newArrray[0].text,
              id: newArrray[0].row
            })

          } else {
            self.error('Please use end loop');
          }

        } else {
          break;
        }
      }


      return json;
    }

    self.error = function (text) {
      console.log(text);
    }

    self.sort = function () {
      return _.sortBy(self.standardItems,(function(e) {
        return e.row;
      }))
    }

    self.gridsterOpts = {
        columns: 6, // the width of the grid, in columns
        pushing: false, // whether to push other items out of the way on move or resize
        floating: false, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
        swapping: true, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
        width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
        colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
        rowHeight: 80, // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
        margins: [10, 10], // the pixel distance between each widget
        outerMargin: true, // whether margins apply to outer edges of the grid
        isMobile: false, // stacks the grid items if true
        mobileBreakPoint: 200, // if the screen is not wider that this, remove the grid layout and stack the items
        mobileModeEnabled: true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
        minColumns: 1, // the minimum columns the grid must have
        minRows: 2, // the minimum height of the grid, in rows
        maxRows: 20,
        defaultSizeX: 4, // the default width of a gridster item, if not specifed
        defaultSizeY: 2, // the default height of a gridster item, if not specified
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
           stop: function(event, $element, widget) {
              self.standardItems = self.sort();
           } // optional callback fired when item is finished dragging
        }
    };

  }

})();
