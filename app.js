(function(){
  'use strict';

  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
  .controller('FoundItemsDirectiveController', FoundItemsDirectiveController)
  .service('MenuSearchService', MenuSearchService)
  .directive('foundItems', FoundItemsDirective);

  // directive

  function FoundItemsDirective() {
    var ddo = {
      scope: {
        items: "<",
        onRemove: "&",

      },
      restrict: "E",
      templateUrl: "foundItems.html",
      controller: 'FoundItemsDirectiveController as fidCntrl',
      bindToController: true
    }
    return ddo;
  }

  // There is no function needed here
  function FoundItemsDirectiveController() {
    var fidCntrl = this;

    // // for deb
    // fidCntrl.testFn = function() {
    //   console.log("fidCntrl", fidCntrl);
    //   return 1;
    // }

  }

  // controller

  NarrowItDownController.$inject=['$scope', 'MenuSearchService'];
  function NarrowItDownController($scope, MenuSearchService) {
    var nidCntrl = this;
    nidCntrl.lastItemRemoved = {};
    nidCntrl.found = [];

    nidCntrl.getMatchedMenuItems = function(searchTerm) {
      var promise = MenuSearchService.getMatchedMenuItems(searchTerm);
      promise.then(function(response) {
        nidCntrl.found = response.data;
        nidCntrl.isServiceError = "false";
        nidCntrl.serviceError = null;
        nidCntrl.lastItemRemoved = {};

      }).
      catch(function(response){
        console.log('In Catch in MenusSearchService', response);
        nidCntrl.found = [];
        nidCntrl.isServiceError = "true";
        nidCntrl.serviceError = response.error;
        nidCntrl.lastItemRemoved = {};

      });
    }

    nidCntrl.onRemove = function(index) {
      nidCntrl.lastItemRemoved = nidCntrl.found[index];
      nidCntrl.found.splice(index, 1);
    }
  }

  // service

  MenuSearchService.$inject = ['$http', '$filter'];
  // returns a promise.
  function MenuSearchService($http, $filter) {
    var service = this;
    service.getMatchedMenuItems = function(searchTerm) {
      var foundItems = [];
      return $http({
        method: 'GET',
        url: 'https://davids-restaurant.herokuapp.com/menu_items.json'
      }).then (function(result){
         var promise = result;
         var menuItems = result.data.menu_items;
         promise.data = $filter('filter')(menuItems,
           {description: searchTerm}, false);
         return promise;
      });
    }
  }
})();
