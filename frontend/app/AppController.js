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

    // Data
    self.selected        = null;
    self.progress        = 5;
    self.modules         = [ ];
    self.standardItems   = AppService.standardItems;
    self.moduleButtons   = AppService.moduleButtons;
    self.gridsterOpts    = AppService.gridsterOpts;

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

    /**
     * Gridster Add Widget Functionality
     */
    function AddWidget(text) {
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

    /**
     * Gridster Delete Widget Functionality
     */
    function DeleteWidget(index) {
      self.standardItems.splice(index, 1);
    }

  }

})();
