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
    self.share           = share;

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
     * Show the bottom sheet
     */
    function share($event) {
        var module = self.selected;

        $mdBottomSheet.show({
          parent: angular.element(document.getElementById('content')),
          templateUrl: 'app/view/shareSheet.html',
          controller: [ '$mdBottomSheet', TodoSheetController ],
          controllerAs: "vm",
          bindToController : true,
          targetEvent: $event
        }).then(function(clickedItem) {
          clickedItem && $log.debug( clickedItem.name + ' clicked!');
        });

        /**
         * Bottom Sheet controller for the Avatar Actions
         */
        function TodoSheetController( $mdBottomSheet ) {
          this.module = module;
          this.items = [
            { name: 'Phone'       , icon: 'phone'       , icon_url: 'assets/svg/phone.svg'},
            { name: 'Twitter'     , icon: 'twitter'     , icon_url: 'assets/svg/twitter.svg'},
            { name: 'Google+'     , icon: 'google_plus' , icon_url: 'assets/svg/google_plus.svg'},
            { name: 'Hangout'     , icon: 'hangouts'    , icon_url: 'assets/svg/hangouts.svg'}
          ];
          this.performAction = function(action) {
            $mdBottomSheet.hide(action);
          };
        }
    }

  }

})();
