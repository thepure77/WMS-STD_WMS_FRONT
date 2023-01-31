
(function () {
    'use strict';
    app.directive('customer', function () {
        var directive = {
            restrict: 'E',
            controllerAs: "$vm",
            controller: controller,
            link: link,
            scope: {
                isDisabled: '=?',
                name: '=?',
                value: '=?',
                delegates: '=?',
                selected: '=?',
            },
            bindToController: true,
            templateUrl: "modules/ModuleOms/widgets/customer/customer.html"

        };
        return directive;

        function controller($scope, $q, $http, $filter, $state, $window, $timeout, $translate, commonService, clientService, masterDataModel) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var eFindItem = $filter('findItem');
            var eFindItemList = $filter('findItemList');
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;

            var Defers = {};
            // Defers.resolve();
            // Defers.reject();

            var viewModel = {
                post: clientService.post,
                get: clientService.get
            }

            $scope.prefix = commonService.guid();
            $scope.fromDisabled = $vm.isDisabled;

            // ----------------------------------------------------
            // This start

            // ----------------------------------------------------
            // This delegates
            $vm.delegates = {
                load: ''
            };
            $scope.$watchCollection("$vm.name", function (newValue, oldValue) {

                if (newValue == null) {
                    $vm.name = "";
                }

            }, true);

            
            // ----------------------------------------------------
            // This autoComplate configuration
            $scope.Autocompleted = {};

            $scope.Autocompleted.Customer = {
                selected: function (item, items, text) {
                    
                    if ($vm.selected)
                    
                        $vm.selected(item);
                },
                config: {
                    field: 'id',
                    http: 'get',
                    placeholder: 'Customer Name',
                    url: 'api/customer/Suggestion/'
                }
            };

            $scope.init = function () {

            }

            $scope.$on("$destroy", function destroy() {


            });

        }

        //Link function
        function link(scope, element, attrs) {



        }
    });
})();
