// 'use_strict';

// export default function topViewLabelProperty() {
//     return {
//         controllerAs: '$vm',
//         controller: topViewLabelPropertyCtrl,
//         template: require('./topViewLabelProperty.html'),
//         bindings: {
//             trigger: '=?',
//             callback: '=?'
//         }
//     };

(function () {
    'use strict'
    app.component('topViewLabelProperty', {
        controllerAs: '$vm',
        controller: topViewLabelPropertyCtrl,
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/virtualWarehouse/manage/component/topViewLabelProperty.html";
        },
        bindings: {
            trigger: '=?',
            callback: '=?'
        },
        controller: topViewLabelPropertyCtrl
    })
})();


function topViewLabelPropertyCtrl($scope, $http, localStorageService, vwManageTopFactory) {
    var $vm = this;
    var apiFactory = vwManageTopFactory;

    this.$onInit = function () {
        $vm.model = {};
    };

    $scope.$on('$destroy', function () { });

    $vm.trigger = function (model) {
        $('#top-label-modal-form').modal('show');

        $vm.model = model;
        $scope.model = $vm.model;

        $('#refreshTopLabel').click();
    }

    $vm.save = function () {
        var saveModel = $vm.model;
        if (saveModel.status == "0") {
            apiFactory.saveTopRack(saveModel).then(
                function (res) {
                    if (typeof $vm.callback === 'function') {
                        $vm.callback(res.data);
                    }
                },
                function (err) {

                });
        } else {

            apiFactory.laySpriteUpDate(saveModel).then(
                function (res) {
                    if (typeof $vm.callback === 'function') {
                        $vm.callback(res.data);
                    }
                },
                function (err) {

                });
        }

        $scope.onClose();
    };

    $scope.onClose = function () {
        $('#top-label-modal-form').modal('hide');
        $vm.callback();
    }

    $vm.delete = function () {
        var model = $vm.model;
        apiFactory.inActive(model).then(
            function (res) {
                if (typeof $vm.callback === 'function') {
                    $vm.callback(res.data);
                }
            },
            function (err) {

            });
        $('#top-label-modal-form').modal('hide');
    };

    
}
