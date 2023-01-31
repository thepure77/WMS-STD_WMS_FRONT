// 'use_strict';

// export default function sideViewRackProperty() {
//     return {
//         controllerAs: '$vm',
//         controller: sideViewRackPropertyCtrl,
//         template: require('./sideViewRackProperty.html'),
//         bindings: {
//             model: '=?',
//             onShow: '=?',
//             trigger: '=?',
//             callback: '=?'
//         }
//     };

(function () {
    'use strict'
    app.component('sideViewRackProperty', {
        controllerAs: '$vm',
        controller: sideViewRackPropertyCtrl,
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/virtualWarehouse/manage/component/sideViewRackProperty.html";
        },
        bindings: {
            model: '=?',
            onShow: '=?',
            trigger: '=?',
            callback: '=?'
        },
        controller: sideViewRackPropertyCtrl
    })
})();

function sideViewRackPropertyCtrl($scope, $http, localStorageService, vwManageFactory) {
    var $vm = this;
    var apiFactory = vwManageFactory;

    this.$onInit = function () {
        $vm.model = $vm.model || [];
        $vm.dbModel = $vm.dbModel || {};
        $vm.selectedLocationName = '';
    };

    $scope.$on('$destroy', function () { });

    $vm.save = function () {
        var mapModel = {
            "sprite_Index": $vm.model.sprite_Index,
            "location_Id": $vm.dbModel.location_Id,
            "location_Index": $vm.dbModel.location_Index,
            "location_Bay": $vm.model.location_Bay,
            "location_Depth": $vm.model.location_Depth,
            "location_Level": $vm.model.location_Level
            }
        
        apiFactory.sideViewRackSave(mapModel).then(
            function (res) {
                console.log(res);
            },
            function (err) {

            });
        $scope.onClose();
    };

    $vm.locationAutoCompleteFunc = function (value) {
        return apiFactory.findLocationName(value).then(function (response) {
            return response.data.items;
        });
    }

    $vm.trigger = function (model) {
        console.log(JSON.stringify(model));
        $vm.model = model;
        $scope.model = $vm.model;

        debugger;
        $vm.selectedLocationName = {};
        //  $vm.dbModel = {};
        $('#side-siderack-modal-form').modal('show');
        
        // $vm.model.rackNo = 2;
    }

    $scope.onClose = function () {
        $('#side-siderack-modal-form').modal('hide');
        $vm.callback();
    }
}
