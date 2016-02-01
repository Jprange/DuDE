(function(){
 
  angular
       .module('app')
       .controller('AppController', [
          'AppService', '$mdSidenav', '$mdToast', '$log', '$q',
          AppController
       ]);
 
  /**
   * Main Controller for the Angular Material Todo App
   * @param $scope
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */
  function AppController( AppService, $mdSidenav, $mdToast, $log, $q) {
    var self = this;
 
    // Data
    self.progress        = 0;
    self.modules         = [];
    self.module          = 0;
    self.instruction     = "";
    self.instructionNum  = 0;
    self.instructionList = null;
    self.response        = "";
    self.state           = 0;
    self.variables       = [];
    self.varIndex        = 0;
    self.prevCount       = [];
    self.highlighted     = null;
    self.error           = "";
    self.standardItems   = AppService.standardItems.slice(0);
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
     function selectModule(module, closeNav) {
       self.module          = module;
       self.instructionList = self.modules[module].instructions;
       self.instruction     = self.instructionList[self.instructionNum];
       self.progress        = module === 3 ? 100 : module * 33;
 
       self.standardItems   = AppService.standardItems.slice(0);
       self.instructionNum  = 0;
       self.response        = "";
       self.state           = 0;
       self.variables       = [];
       self.varIndex        = 0;
       self.highlighted     = null;
 
       if (closeNav) {
         self.toggleSidenav('left');
       }
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
      var d = _.max(self.standardItems, function(o){return o.row + 2;});
      var w = {
        row: d,
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
      self.error = "";
      self.state = 0;
      self.variables = [];
      self.highlighted = null;
      var data = self.buildData();
 
      if(typeof data == 'object') {
        $.ajax({
          type: "POST",
          url: 'http://localhost:5000/evaluate',
          data: JSON.stringify(data),
          success: function(data) {
            self.showState(data.data);
          },
          dataType : "json",
          contentType: "application/json; charset=utf-8"
        });
      }
    }
 
    self.setVariables = function(prev) {
      if (prev) {
        for(var i = 0; i < self.prevCount[self.prevCount.length - 1]; ++i) {
          self.variables.pop();
        }
        self.prevCount.pop();
      } else if (self.response[self.state].state.length == 0) {
        self.variables.push('Begin');
        self.prevCount.push(1);
      } else {
        self.variables.push('--------------------');
        self.response[self.state].state.forEach(function(string) {
          self.variables.push(string);
        });
        self.prevCount.push(self.response[self.state].state.length + 1);
      }
    }
 
    self.showState = function (data) {
      self.response = data;
      self.highlighted = self.response[self.state].id;
      self.setVariables();
    }
 
    self.NextState = function () {
      if(self.state < self.response.length - 1) {
        self.state = self.state + 1;
        self.highlighted = self.response[self.state].id;
        self.setVariables();
      }
    }
 
    self.PreviousState = function () {
      if(self.state > 0) {
        self.state = self.state - 1;
        self.highlighted = self.response[self.state].id;
        self.setVariables(true);
      }
    }
 
    self.NextInstruction = function () {
      if(self.instructionNum < self.instructionList.length - 1) {
        self.instructionNum = self.instructionNum + 1
        self.instruction = self.instructionList[self.instructionNum];
      }
    }
 
    self.PreviousInstruction = function () {
      if(self.instructionNum > 0) {
        self.instructionNum = self.instructionNum - 1
        self.instruction = self.instructionList[self.instructionNum];
      }
    }
 
    self.NextModule = function () {
      self.instructionNum = 0;
      self.module = self.module < 3 ? self.module + 1 : 3;
      self.selectModule(self.module);
    }
 
    self.PreviousModule = function () {
      self.instructionNum = 0;
      self.module = self.module > 0 ? self.module - 1 : 0;
      self.selectModule(self.module);
    }
 
    self.buildData = function () {
      var json = JSON.parse('{"program":[] }');
      // Push begin
      json.program.push({
        type: "begin",
        id: 0
      })
      if(self.standardItems.length == 1) {
        return self.errorText('Please add content');
      }
 
      var newArrray = self.standardItems.slice(0);
      newArrray.splice(0, 1);
 
      while(newArrray.length > 0) {
        if (newArrray[0].text === 'variable') {
 
          json.program.push({
           type: 'assignment',
            id: newArrray[0].row,
            data: {
              varname: newArrray[0].name,
              expr: newArrray[0].value
            }
          })
          newArrray.splice(0, 1);
        } else if (newArrray[0].text === 'if') {
 
          var children = [];
 
          while (newArrray.length != 1 && newArrray[1].text != 'end if') {
            children.push({
              type: 'assignment',
              id: newArrray[1].row,
              data: {
                varname: newArrray[1].name,
                expr: newArrray[1].value
              }
            })
 
            if (newArrray.length === 1) {
              return self.errorText('Please use end if');
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
              type: 'endif',
              id: newArrray[0].row
            })
 
          } else {
            return self.errorText('Please use end if');
          }
 
        } else if (newArrray[0].text === 'while') {
 
          var children = [];
 
          while (newArrray.length != 1 && newArrray[1].text != 'end loop') {
            children.push({
              type: 'assignment',
              id: newArrray[1].row,
              data: {
                varname: newArrray[1].name,
                expr: newArrray[1].value
              }
            })
 
            if (newArrray.length === 1) {
              return self.errorText('Please use end loop');
            }
 
            newArrray.splice(1, 1);
          }
 
          json.program.push({
            type: 'loop',
            id: newArrray[0].row,
            data: {
              predicate: newArrray[0].predicate,
              branch: children
            }
          })
 
          newArrray.splice(0, 1);
 
          if (newArrray.length > 0 && newArrray[0].text === 'end loop')  {
            json.program.push({
              type: 'endloop',
              id: newArrray[0].row
            })
 
          } else {
            return self.errorText('Please use end loop');
          }
 
        } else {
          break;
        }
      }
 
 
      return json;
    }
 
    self.errorText = function (text) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(text)
          .position('top right')
          .hideDelay(3000)
      );
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
        rowHeight: 70, // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
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