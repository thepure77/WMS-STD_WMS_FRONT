'use strict';

app.component('dirNavBar', {
    controllerAs: '$vm',
    bindings: {
        param1: '<',
        param2: '=',
        param3: "&"
    },
    controller: function ($scope, $q, $filter, $timeout, $element, ngAuthSettings, $window, $templateCache, $state, userFactory /*, authService*/) {
        var $vm = this;
        $scope.root = ngAuthSettings.ClientDirective + 'contents/ace-master/';
        $scope.rootContents = ngAuthSettings.ClientDirective + 'contents/';

        $scope.logout = function () {
            userFactory.reset();
            
            // $templateCache.removeAll();
            $timeout(function () {
              
                // authService.logOut();
                // window.location.reload();
                $state.go('login')

            }, 3000);

        }
        this.$onInit = function () {
            angular.element($element).find('.dropdown-toggle').dropdown();

        };

        this.$onDestroy = function () {

        };
    },
    templateUrl: function ($element, $attrs, ngAuthSettings, authService) {
        return ngAuthSettings.ClientDirective + "widgets/dirNavBar/navbar.html";
    }
});