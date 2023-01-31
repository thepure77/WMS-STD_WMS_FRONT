app.directive("dirSidebar", function(ngAuthSettings) {
    return {
        restrict: 'E',
        scope: { menu: '=', items: '=' },
        controller: function ($scope, $q, $filter, $timeout, $element, $window, $templateCache, $state/*, authService*/, $location, commonService, localStorageService) {
            $scope.state = $state;
            $scope.isActive = false;

            $scope.go = function(path){
                $location.path(path);
            }
        },
        controllerAs: "sidebarCtrl",
        templateUrl: "modules/widgets/dirSidebar/dirSidebar.html",
    }
});
