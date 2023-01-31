'use strict';
app.directive('dirDatePicker', function (ngAuthSettings, moment) {

    var set = function ($scope) {
        // if ($scope.item && $scope.item != '') {
        if ($scope.onChange != true) {
            var d = $scope.item + '';
            if (d.length >= 8) {
                var year = d.substr(0, 4);
                var month = d.substr(4, 2);
                var day = d.substr(6, 2);
                month = parseInt(month) - 1;

                $scope.dt = new Date(year, month, day);
            }
            else if (d.length == 0) {
                $scope.dt = '';
            }

        } else {
            $scope.onChange = false;
        }
        // } else {
        //     $scope.dt = null;
        // }
    }

    return {
        restrict: 'E',
        scope: {
            delegates: '=?',
            invokes: '=?',
            item: "=ngModel",
            disabled: "=?",
            onTextChange: '=?',
            chkData: '=chkData',
            valuesd: '=?valuesd'
        },
        controller: function ($scope) {
            //variable


            //parameter
            $scope.delegates = ($scope.delegates) ? $scope.delegates : {};
            $scope.invokes = ($scope.invokes) ? $scope.invokes : {};

            $scope.disabled = $scope.disabled ? $scope.disabled : false;
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
            ////$scope.disabled = function(date, mode) {
            ////    return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
            ////};

            $scope.toggleMin = function () {
                $scope.minDate = $scope.minDate ? null : new Date();
            };
            $scope.toggleMin();
            $scope.maxDate = new Date(2020, 5, 22);

            $scope.open = function ($event) {
                if (!$scope.disabled)
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
                startingDay: 1,
                showWeeks: false


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
            $scope.valuesd = 0;

            $scope.myChangeFunction = function () {



                var a = $scope.dt;
                $scope.onChange = true;
                $scope.valuesd = 1;

                if (a) {
                    $scope.item = moment(a).format("YYYYMMDD");
                    $scope.chkData ="true";
                }
                else {
                    $scope.item = "";
                    $scope.chkData ="false";
                }



                $scope.close();

                if ($scope.onTextChange)
                    $scope.onTextChange($scope.item);

            }

            $scope.init = function () {

                // $scope.today();
                if ($scope.item && $scope.item != '') {
                    set($scope);
                }

            }

            //$scope.$watchCollection("disabled", function (iNew, iOld) {
            //    if (iNew != iOld) {
            //        $scope.disabled = iNew;
            //    }
            //}, true);


        },

        link: function ($scope, element, attributes) {

            $scope.$watch("item", function (news, olds) {
                set($scope);
                if (news == null) {
                    $scope.dt = null;
                }
            }, true);
        },
        templateUrl: "modules/widgets/datePicker/datepicker.html",
    };
});
