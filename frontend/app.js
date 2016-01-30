'use strict';

// Declare app level module which depends on controllers, directives, filters, and services
angular.module('myApp', [
  'ngMaterial',
  'app',
  'gridster'
])
.config(function($mdThemingProvider, $mdIconProvider) {
  $mdIconProvider
      .defaultIconSet("assets/svg/avatars.svg", 128)
      .icon("prev"       , "assets/svg/arrow-left-bold-circle.svg" , 48)
      .icon("next"       , "assets/svg/arrow-right-bold-circle.svg", 48)
      .icon("play"       , "assets/svg/play-circle.svg"            , 48)
      .icon("add"        , "assets/svg/add.svg"                    , 48)
      .icon("remove"     , "assets/svg/remove.svg"                 , 48)
      .icon("clear"      , "assets/svg/clear.svg"                  , 48)
      .icon("check"      , "assets/svg/check.svg"                  , 48)
      .icon("menu"       , "assets/svg/menu.svg"                   , 24)
      .icon("share"      , "assets/svg/share.svg"                  , 24)
      .icon("google_plus", "assets/svg/google_plus.svg"            , 512)
      .icon("hangouts"   , "assets/svg/hangouts.svg"               , 512)
      .icon("twitter"    , "assets/svg/twitter.svg"                , 512)
      .icon("phone"      , "assets/svg/phone.svg"                  , 512);

  $mdThemingProvider.theme('default')
    .primaryPalette('blue', {
      'default': '500',
    })
    .accentPalette('green', {
      'default': '500'
    });

  // Configure a dark theme with primary foreground white
  $mdThemingProvider.theme('docs-dark', 'default')
    .primaryPalette('green', {
      'default': '500'
    })
    .dark();
});
