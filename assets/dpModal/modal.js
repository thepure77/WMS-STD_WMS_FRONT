/**
 * @license Mr.Dhitipong Hongsawat
 * License: MIT
 */
'use strict'


/**
 * @ngdoc directive
 * @name dpModal
 * @description
 *
 * The `dpModal` directeve provides support for common
 * of assistive technologies, such as screen readers.
 *
 * <dp-modal on-show="model.show" on-hide="invoke.hide"></dp-modal>
 *
 * ## Usage
 *
 */
app.directive('dpModal', function () {
    return {
        restrict: 'A',
        // replace: 'true',
        scope: {
            onShow: '=',
            onHide: '='
        },
        controller: function ($scope, $element) {
            $scope.$watchCollection("onShow", function (n, o) {
                var myModal = angular.element($element);

                if (n == true) {

                    //myModal.modal({ show: true, backdrop :true});
                    var options = {
                        "show": "true"
                    }
                    myModal.modal(options);
                    myModal.off('hidden.bs.modal');
                    myModal.on('hidden.bs.modal', function (e) {

                        try {
                            if ($scope.onShow == true) {
                                if (!$scope.$$phase) {
                                    //$digest or $apply
                                    $scope.$apply(function () {
                                        $scope.onShow = false;
                                    });
                                }
                            }
                        } catch (e) {
                            console.log('dp-model error : ' + e);
                        } finally {
                            // $digest();
                            if ($scope.onHide) $scope.onHide();
                        }

                    });

                } else {
                    myModal.modal('hide');
                }

            }, true);
        },
        link: function (scope, iElement, attr) {
            //  scope.$watch(attr.amModal, function (n, o) {
       
            // scope.$watch('onShow', function (n, o) {
     
            // });
        }
    };
});

app.factory('convertDate', function () {


    return {
        dayOfWeek: function (date) {
            try {

                var d = date;
                var year = d.substr(0, 4);
                var month = d.substr(4, 2);
                var day = d.substr(6, 2);
                var dateFormat = moment(year + "-" + FormatNumberLength(month, 2) + "-" + day);
                // var dayOfWeek = dateFormat.format('dddd');
                var dayOfWeek = dateFormat.isoWeekday() - 1;
                var weekday = new Array(7);
                weekday[0] = "Mon";
                weekday[1] = "Tue";
                weekday[2] = "Wed";
                weekday[3] = "Thu";
                weekday[4] = "Fri";
                weekday[5] = "Sat";
                weekday[6] = "Sun";

                return weekday[dayOfWeek];

            } catch (e) {
                return "";
            }

        }
    };


    function FormatNumberLength(num, length) {
        var r = "" + num;
        while (r.length < length) {
            r = "0" + r;
        }
        return r;
    }
});
