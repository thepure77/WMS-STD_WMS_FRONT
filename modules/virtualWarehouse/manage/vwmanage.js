
(function () {
    'use strict'

    app.component('virtualWarehouseManage', {
        controllerAs: '$vm',
        controller: vwManageCtrl,
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/virtualWarehouse/manage/vwmanage.html";
        },
        bindings: {
        },
        controller: vwManageCtrl
    })
})();

function vwManageCtrl($scope, $http, localStorageService, vwManageFactory, vwManageTopFactory,$translate) {
    var $vm = this;
    var apiFactory = vwManageFactory;

    var config = {
        type: Phaser.AUTO,
        width: 1550 + topSceneManage.toolArea,
        height: 760,
        parent: 'gameContainer',
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_VERTICALLY
        },
        scene: [topSceneManage, rackSceneManage, floorSceneManage],
        physics: {
            default: 'arcade',
            arcade: {
                gravity: {
                    y: 0
                },
                debug: false
            }
        }
    }
    var game = new Phaser.Game(config);

    this.$onInit = function () {

        $scope.popupObj = {
            rack: {
                model: {},
            },
            floor: {
                model: {},
            },
            label: {
                model: {},
            },
            siderack: {
                model: {},
            },
            sidefloor: {
                model: {},
            },
            head: 'test',
        };
       
        topSceneManage.factory = vwManageTopFactory;

        rackSceneManage.selectedLayout = topSceneManage.selectedItem;
        rackSceneManage.config = config;
        rackSceneManage.factory = vwManageTopFactory;

        floorSceneManage.selectedLayout = topSceneManage.selectedItem;
        floorSceneManage.config = config;
        floorSceneManage.factory = vwManageTopFactory;
        $vm.layoutItem = topSceneManage.layoutItem;

        var warehouseFilter = {};

        apiFactory.loadWarehouse(warehouseFilter).then(function (res) {
            if (res.data && res.data.status == "SUCCESS") {
                $vm.warehouseList = res.data.items;

                if ($vm.warehouseList.length > 0) {
                    topSceneManage.warehouseIndex = $vm.warehouseList[0].warehouse_Index;
                    topSceneManage.warehouseName = $vm.warehouseList[0].warehouse_Name;
                    $scope.warehouse_Selected = $vm.warehouseList[0].warehouse_Index;
                }
            }
        });
    };

    $scope.$on('$destroy', function () { game.destroy(true) });

    $scope.$watch("warehouse_Selected", function (newValue, oldValue) {
        if($vm.warehouseList){
            var selectedItem = $vm.warehouseList.filter(function (item) {
                return item.warehouse_Index == newValue;
            });
    
            if (selectedItem.length > 0) {
                topSceneManage.warehouseIndex = selectedItem[0].warehouse_Index;
                topSceneManage.warehouseName = selectedItem[0].warehouse_Name;

                topSceneManage.reLoadLayout(topSceneManage.scene);
            }
        }
    });

    $scope.$watch("popupObj.rack.trigger", function () {
        if ($scope.popupObj.rack.trigger) {
            topSceneManage.rackEventTrigger = $scope.popupObj.rack.trigger;
        }
    });

    $scope.$watch("popupObj.floor.trigger", function () {
        if ($scope.popupObj.floor.trigger) {
            topSceneManage.floorEventTrigger = $scope.popupObj.floor.trigger;
        }
    });

    $scope.$watch("popupObj.label.trigger", function () {
        if ($scope.popupObj.label.trigger) {
            topSceneManage.labelEventTrigger = $scope.popupObj.label.trigger;
        }
    });

    $scope.$watch("popupObj.siderack.trigger", function () {
        if ($scope.popupObj.siderack.trigger) {
            rackSceneManage.rackSideEventTrigger = $scope.popupObj.siderack.trigger;
        }
    });

    var staResume = 0;
    var paddingLeft = 10;

    var staUpdate = 0;   // Update Contaier   0 : No , 1 : Yes
    var sideRackStatus = 0 // Update rack   0 : No , 1 : Yes
    var sideFloorStatus = 0 // Update rack   0 : No , 1 : Yes

    $scope.topViewCallBack = function (res) {
        if (res != undefined) {
            $vm.layoutItem = res.layoutItem || [];
            topSceneManage.reLoadLayout(topSceneManage.scene);
        }

        game.scene.resume(topSceneManage.key);

        staResume = 1;
        staUpdate = 1;
    }

    $scope.sideRackCallBack = function () {

        sideRackStatus = 1;
    }

    $scope.sideFloorCallBack = function () {

        sideFloorStatus = 1;
    }

    $scope.zoomin = function () {
        topSceneManage.zoomIn();
    }

    $scope.zoomout = function () {
        topSceneManage.zoomOut();
    }

    $scope.updateDataWarehouse = function(){
        $scope.statusUpdataWah = $translate.instant('PROCESSINGDATAWAH');
        $('#olaStatusUpd').css("color", "red");
        apiFactory.updateDataWarehouse().then(function (res) {
            if (res.data) {
                $scope.statusUpdataWah = $translate.instant('SUCCESSDATAWAH');
                $('#olaStatusUpd').css("color", "green");
                setTimeout(function(){ 
                    $scope.statusUpdataWah = "";
                }, 3000);
            }
        });
       
    }
}