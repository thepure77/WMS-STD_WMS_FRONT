'use strict';

app.directive('datePicker', function (ngAuthSettings, moment) {

    var set = function ($scope) {

        if ($scope.item && $scope.item != '') {
            if ($scope.onChange != true) {
                $scope.dt = $scope.item;
            } else {
                $scope.onChange = false;
            }
        }
    }

    return {
        restrict: 'E',
        scope: {
            delegates: '=?',
            invokes: '=?',
            item: "=ngModel",
            name: "=",
            required: "="
        },
        controller: function ($scope) {
            //variable

            //parameter
            $scope.delegates = ($scope.delegates) ? $scope.delegates : {};
            $scope.invokes = ($scope.invokes) ? $scope.invokes : {};
            //scope variable
            $scope.ClientDirective = ngAuthSettings.ClientDirective;

            $scope.today = function () {
                $scope.dt = new Date();
            };
            $scope.showButtonBar = false;

            $scope.clear = function () {
                $scope.dt = null;
            };

            // Disable weekend selection
            $scope.disabled = function (date, mode) {
                return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
            };

            $scope.toggleMin = function () {
                $scope.minDate = $scope.minDate ? null : new Date();
            };
            $scope.toggleMin();
            $scope.maxDate = new Date(2020, 5, 22);

            $scope.open = function ($event) {
                $scope.status.opened = true;
            };

            $scope.setDate = function (year, month, day) {
                $scope.dt = new Date(year, month, day);
            };
            $scope.close = function () {
                setTimeout(function () {
                    if (!$scope.$$phase)
                        $scope.$apply(function () {
                            $scope.status.opened = false;
                        });
                }, 100);

            };

            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };

            $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'dd/MM/yyyy'];
            $scope.format = $scope.formats[4];

            $scope.status = {
                opened: false
            };

            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            var afterTomorrow = new Date();
            afterTomorrow.setDate(tomorrow.getDate() + 2);
            $scope.events = [{
                    date: tomorrow,
                    status: 'full'
                },
                {
                    date: afterTomorrow,
                    status: 'partially'
                }
            ];

            $scope.getDayClass = function (date, mode) {
                if (mode === 'day') {
                    var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                    for (var i = 0; i < $scope.events.length; i++) {
                        var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                        if (dayToCheck === currentDay) {
                            return $scope.events[i].status;
                        }
                    }
                }
            }

            $scope.onChange = false;
            $scope.myChangeFunction = function () {

                var a = $scope.dt;
                $scope.onChange = true;

                if (a != null) {
                    $scope.item = moment(a).format("YYYYMMDD");
                } else {
                    $scope.item = undefined;
                }
                $scope.close();
            }

            $scope.init = function () {
                if ($scope.item && $scope.item != '') {
                    set($scope);
                }

            }

        },

        link: function ($scope, element, attributes) {

            $scope.$watch("item", function (news, olds) {

                if (news != olds) {

                    set($scope);
                }

                if (news == null) {
                    $scope.dt = '';
                }
            }, true);
        },
        templateUrl: "modules/ModuleOms/widgets/dirDatePicker2/datepicker.html",
    };
});