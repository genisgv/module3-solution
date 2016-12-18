(function () {
  'use strict';

  angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .constant('ApiBasePath', "http://davids-restaurant.herokuapp.com/menu_items.json")
    .directive('foundItems', FoundItemsDirective);

  function FoundItemsDirective() {
    var ddo = {
      templateUrl: 'found-items.html',
      scope: {
        items: '<',
        onRemove: '&'
      }
    };

    return ddo;
  }

  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var narrowItDown = this;
    narrowItDown.found = undefined;

    narrowItDown.removeItem = function (index) {
      narrowItDown.found.splice(index, 1);
    };

    narrowItDown.search = function () {
      if (narrowItDown.searchTerm === undefined || narrowItDown.searchTerm.trim().length === 0) {
        narrowItDown.found = [];
      } else {
        MenuSearchService.getMatchedMenuItems(narrowItDown.searchTerm)
          .then(function (response) {
            narrowItDown.found = response;
          });
      }
    };
  }

  MenuSearchService.$inject = ['$http', '$q','ApiBasePath'];
  function MenuSearchService($http, $q, ApiBasePath) {
    var service = this;

    service.getMatchedMenuItems = function (searchTerm) {
      var deferred = $q.defer();

      $http.get(ApiBasePath)
        .then(function (result) {
          var items = result.data.menu_items.filter(function (item) {
            return item.description.indexOf(searchTerm) !== -1;
          });

          deferred.resolve(items);
        })
        .catch(function (error) {
          deferred.reject(error);
        });

      return $q.when(deferred.promise);
    };

  }

})();
