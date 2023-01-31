/*********************************************************
    - Author: Sebastian Cubillos
    - Github: @tianes
    - More Gists: https://gist.github.com/tianes/
    - Contact: sebastian@cubillos.org
    - Article: https://goo.gl/oOzNXU
**********************************************************/

app.directive('chars', ['$timeout', function ($timeout) {

    /* RegEx Examples:
        - email: "0-9a-zA-Z@._\-"
        - numbers only: "0-9"
        - letters only: "a-zA-Z"
        Email Usage Example:
        <input type="text" name="email" ng-model="user.email" chars="0-9a-zA-Z@._\-" />
    */
    'use strict';
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function ($scope, $elem, attrs, $ctrl) {

            var regReplace,
                preset = {
                    'only-numbers': '0-9',
                    'numbers': '0-9\\',
                    'date': '0-9\\/',
                    'only-letters': 'A-Za-z',
                    'letters': 'A-Za-z\\s',
                    'email': '\\wÑñ@._\\-',
                    'alpha-numeric': '\\w\\s',
                    'latin-alpha-numeric': '\\w\\sÑñáéíóúüÁÉÍÓÚÜ´¨'
                },
                filter = preset[attrs.chars] || attrs.chars;

            $elem.on('input keyup change', function () {

                var val = $elem.val().toString();

                regReplace = new RegExp('[^' + filter + ']', 'ig');
                $ctrl.$setViewValue(val.replace(regReplace, ''));
                $timeout(function () {

                    $ctrl.$render();

                });

            });

        }
    };

}]);