
 (function() {
    'use strict'
    app.directive('planGrPopupTable', function() {
        return {
            restrict: 'E',
            controllerAs: '$ctrl',
            templateUrl: "modules/GR/component/planGrPopup/planGrPopupTable/planGrPopupTable.html",
            scope: {
                delegates: '=',
                invokes: '=',
                config: '=',
                paginations: '=?'
            },
            controller: ['$scope', 'commonService', '$filter','dpMessageBox', function($scope, commonService, $filter,dpMessageBox) {
                $scope.invokes = $scope.invokes || {};
                $scope.config = $scope.config || {};
                $scope.config.paginations = $scope.config.paginations || {};
                
                $scope.items = $scope.items || [];
                var xObj = commonService.objects;
                var eFindItem = $filter('findItem');
                $scope.model = {                    
                    currentPage: $scope.config.currentPage + 1,
                    numPerPage: $scope.config.numPerPage,
                    totalRow: 0
                };
                $scope.show = {
                    action: true,
                    pagination: true,
                    checkBox: false
                }
                $scope.pageMode = 'Implement your config !';
                $scope.delegate = {
                    set: function(model, paginations,showchkbox) {
                        
                        // $scope.items = model;                        
                        // $scope.items.num = 2;
                        // $scope.items.totalRow = paginations.totalRow;
                        // $scope.items.numPerPage = paginations.perPage;
                        // $scope.items.maxSize = 5;   
                        $scope.show.checkBox = showchkbox;
                        if (model.length != 0) {
                            $scope.pagging.totalRow = model[0].count;
                            if (paginations != null) {
                                $scope.pagging.totalRow = paginations.totalRow;                                
                            }

                            $scope.items = model;
                        } else {
                            $scope.items = model;
                            $scope.pagging.totalRow = paginations.totalRow; 
                        }    
                    },
                    filter: function(model) {
                        $scope.items = model.dataModel;
                    },
                    delete: function(index) {},
                    selected: function(index) {},
                    edit: function(index) {},
                    add: function(model) {
                        var a = eFindItem({ items: $scope.items, filed: 'id', value: model.id });
                        if (!xObj.IsArray($scope.items)) {
                            $scope.items = [];
                        }
                        if (a == null)
                            $scope.items.push(model);
                    }
                };
                $scope.delegates = $scope.delegate;
                $scope.selecteds = function(param) {
                    if ($scope.invokes.selected)
                        $scope.invokes.selected(param);
                }
                $scope.select = function(){
                    var select = $scope.items.filter(c => c.selected);
                    if(select.length == 0)
                    {
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'Validate',
                                message: 'Please select the item !!'
                            }
                        )
                        return "";
                    }
                    else{
                    var chk = select.find(c => select[0].grDocumentTypeIndex != c.grDocumentTypeIndex);
                    if (chk)
                    {
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'Validate',
                                message: 'DocumentType Do not match !!'
                            }
                        )
                        return "";
                    }else{
                    if ($scope.invokes.selected)
                    $scope.invokes.selected(select);
                    }
                }
                }
                var init = function() {
                    if ($scope.config.pageMode == "Search") {
                        $scope.pageMode = "Search";
                    }
                    $scope.checkAll = false
                }
                $scope.changeTableSize = function () {
                    let ChangeTable = 1;
                    if ($scope.invokes.page) {
                        if ($scope.model.numPerPage == undefined) {
                            $scope.model.numPerPage = $scope.pagging.perPage;
                        }
                        var p = {
                            currentPage: ChangeTable,
                            numPerPage: $scope.pagging.perPage
                        };
                        $scope.invokes.page(p);
                    }
                }
                $scope.changePage = function() {            
                    if ($scope.invokes.page) {
                        var p = {
                            currentPage: $scope.pagging.currentPage,
                            numPerPage: $scope.pagging.perPage
                        };
                        var all = {
                            currentPage: 0,
                            numPerPage: 0
                        };
                        $scope.invokes.page(p);
                    }
                }      
                
                
                $scope.pagging = {
                    num: 1,
                    maxSize: 5,
                    perPage: $scope.config.numPerPage,
                    change: function () {                        
                        if ($scope.invokes.page) {
                            var p = {
                                currentPage: $scope.pagging.currentPage - 1,
                                numPerPage: $scope.pagging.perPage
                            };
                            var all = {
                                currentPage: 0,
                                numPerPage: 0
                            };
                            if ($scope.pagging.currentPage != 0) {
                                p.currentPage = p.currentPage + 1
                            }
                            $scope.invokes.page(p);
                        }
                    }
                };
                $scope.pageOption = [                    
                    { 'value': 30 },
                    { 'value': 50 },
                    { 'value': 100 },
                    { 'value': 500 },
                ];

                $scope.chkAll =function(){
                    $scope.checkAll = !$scope.checkAll;
                    if ($scope.checkAll === true) {
                        angular.forEach($scope.items, function (v, k) {
                            $scope.items[k].selected = true;
                        });
                    } else {
                        angular.forEach($scope.items, function (v, k) {
                            $scope.items[k].selected = false;
                        });
                    }
                }

                init();
              
            }],
            link: function($scope, $element, $attributes) {}
        }
    });
}());
