'use strict';

angular.module('webApp').directive('cuFocus', function(){
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attrs, controller){
      controller.$focused = false;
      element.bind('focus', function(e){
        scope.$apply(function(){ controller.$focused = true; });
      }).bind('blur', function(e){
        scope.$apply(function(){ controller.$focused = true; });
      });
    }
  }
});