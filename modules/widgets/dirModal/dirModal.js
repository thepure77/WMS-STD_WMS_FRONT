'use strict';
app.directive('modal', function () {
    return {
        templateUrl: 'modules/ModuleOms/widgets/dirModal/dirModal.html',
        restrict: 'EA',
        transclude: true,
        replace: true,
        scope: { visible: '=', onSown: '&', onHide: '&' },
        link: function postLink(scope, element, attrs) {

            // cancel box
            $(element).modal({
                show: false,
                keyboard: attrs.keyboard,
                backdrop: attrs.backdrop
            });

            scope.$watch(function () { return scope.visible; }, function (value) {

                if (value == true) {
                    $(element).modal('show');
                } else {
                    $(element).modal('hide');

                    console.log('modal hide');
                }
            });

            $(element).on('shown.bs.modal', function () {
                scope.$apply(function () {
                    scope.$parent[attrs.visible] = true;
                });
            });

            $(element).on('shown.bs.modal', function () {
                scope.$apply(function () {
                    scope.onSown({});
                });
            });

            $(element).on('hidden.bs.modal', function () {
                scope.$apply(function () {
                    scope.$parent[attrs.visible] = false;
                });
            });

            $(element).on('hidden.bs.modal', function () {
                scope.$apply(function () {
                    scope.onHide({});
                });
            });
        }
    };
}
);

app.directive('modalHeader', function () {
    return {
        template: '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">{{title}}</h4></div>',
        replace: true,
        restrict: 'EA',
        scope: { title: '@' }
    };
});

app.directive('modalBody', function () {
    return {
        template: '<div class="modal-body" ng-transclude></div>',
        replace: true,
        restrict: 'E',
        transclude: true
    };
});

app.directive('modalFooter', function (dynamicModal) {
    return {
        template: '<div class="modal-footer"></div>',
        replace: true,
        restrict: 'E',
        scope: { data: '=ngModel', method: '=' },
        link: function(scope, element, attrs) {
            var formData = scope.data;
            var numMethod = scope.method;

            scope.confirm = function () {
                var message = dynamicModal.confirm();
                alert(message);
            }

        }
    };
});