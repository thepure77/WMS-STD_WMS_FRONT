app.run(['$rootScope', '$state', '$stateParams',
    function ($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        $state.go('login');
    }
]);

app.config(['$stateProvider', '$urlRouterProvider', 'ngAuthSettings',
    function ($stateProvider, $urlRouterProvider, $ngAuthSettings) {

        // login router
        $stateProvider.state('login', {
            url: "/login",
            templateUrl: $ngAuthSettings.ClientDirective + "views/state/login.html",
            controller: 'loginController',
        });


        // admin router
        $stateProvider.state('home', {
            url: "/home",
            templateUrl: $ngAuthSettings.ClientDirective + "views/state/home.html",
            controller: "homeController",
        });


        $stateProvider.state('nolayout', {
            url: "/nolayout",
            templateUrl: $ngAuthSettings.ClientDirective + "views/state/no-layout.html",
            controller: "noHeaderConntroller"
        });



        $stateProvider.state('wms', {
            url: "/wms",
            templateUrl: $ngAuthSettings.ClientDirective + "views/state/home.html",
            controller: "homeController"
        });
        // use controller
        $stateProvider.state('wms.index', {
            url: "/index",
            templateUrl: $ngAuthSettings.ClientDirective + "views/partials/home/index.html",
            controller: 'indexController',
        });
        $stateProvider.state('wms.index1', {
            url: "/Username/:Username",
            controller: function ($stateParams) {
                $stateParams.Username //*** Watch Out! DOESN'T EXIST!! ***//

            },
            templateUrl: $ngAuthSettings.ClientDirective + "views/partials/home/index.html",
        });
        //GR
        $stateProvider.state('wms.plan_summary', {
            url: '/plan-summary',
            template: '<plan-summary></plan-summary>'
        });
        $stateProvider.state('wms.gr_summary', {
            url: '/gr-summary',
            template: '<gr-summary></gr-summary>'
        });
        $stateProvider.state('wms.lpn_management', {
            url: '/lpn-management',
            template: '<lpn-management></lpn-management>'
        });
        $stateProvider.state('wms.put_away', {
            url: '/put-away',
            template: '<put-away></put-away>'
        });
        $stateProvider.state('wms.dock_to_staging', {
            url: '/dock-to-staging',
            template: '<dock-to-staging></dock-to-staging>'
        });
        $stateProvider.state('wms.putaway_by_sku', {
            url: '/putaway-by-sku',
            template: '<putaway-by-sku></putaway-by-sku>'
        });
        $stateProvider.state('wms.scan_receive', {
            url: '/scan-receive',
            template: '<scan-receive></scan-receive>'
        });
        $stateProvider.state('wms.gr_memo', {
            url: '/gr-memo-summary',
            template: '<gr-memo-summary></gr-memo-summary>'
        });

        // GI
        $stateProvider.state('wms.plan_gi_summary', {
            url: '/plan-gi-summary',
            template: '<plan-gi-summary></plan-gi-summary>'
        });
        $stateProvider.state('wms.gi_summary', {
            url: '/gi-summary',
            template: '<gi-summary></gi-summary>'
        });
        $stateProvider.state('wms.gi_memo', {
            url: '/gi-memo-summary',
            template: '<gi-memo-summary></gi-memo-summary>'
        });

        /*      $stateProvider.state('wms.load_summary', {
                 url: '/load-summary',
                 template: '<load-summary></load-summary>'
             }); */
        $stateProvider.state('wms.scan_load_summary', {
            url: '/scan-load-summary',
            template: '<scan-load-summary></scan-load-summary>'
        });


        $stateProvider.state('wms.assign_job', {
            url: '/assign-job',
            template: '<assign-job></assign-job>'
        });



        //Master Data
        $stateProvider.state('wms.wizard_form', {
            url: '/wizard-form',
            template: '<wizard-form></wizard-form>'
        });

        $stateProvider.state('wms.equipment', {
            url: '/equipment',
            template: '<master-equipment></master-equipment>'
        });

        $stateProvider.state('wms.equipment_type', {
            url: '/equipment-type',
            template: '<master-equipment-type></master-equipment-type>'
        });

        $stateProvider.state('wms.equipment_subtype', {
            url: '/equipment-subtype',
            template: '<master-equipment-subtype></master-equipment-subtype>'
        });

        $stateProvider.state('wms.vendor', {
            url: '/vendor',
            template: '<master-vendor></master-vendor>'
        });

        $stateProvider.state('wms.vendor_type', {
            url: '/vendor-type',
            template: '<master-vendor-type></master-vendor-type>'
        });

        $stateProvider.state('wms.owner', {
            url: '/owner',
            template: '<master-owner></master-owner>'
        });

        $stateProvider.state('wms.owner_vendor', {
            url: '/owner-vendor',
            template: '<master-owner-vendor></master-owner-vendor>'
        });

        $stateProvider.state('wms.owner_type', {
            url: '/owner-type',
            template: '<master-owner-type></master-owner-type>'
        });

        $stateProvider.state('wms.owner_soldto', {
            url: '/owner-soldto',
            template: '<master-owner-soldto></master-owner-soldto>'
        });

        $stateProvider.state('wms.sold_to', {
            url: '/sold-to',
            template: '<master-sold-to></master-sold-to>'
        });

        $stateProvider.state('wms.sold_to_type', {
            url: '/sold-to-type',
            template: '<master-sold-to-type></master-sold-to-type>'
        });

        $stateProvider.state('wms.ship_to', {
            url: '/ship-to',
            template: '<master-ship-to></master-ship-to>'
        });

        $stateProvider.state('wms.ship_to_type', {
            url: '/ship-to-type',
            template: '<master-ship-to-type></master-ship-to-type>'
        });

        $stateProvider.state('wms.sold_to_ship_to', {
            url: '/sold-to-ship-to',
            template: '<master-sold-to-ship-to></master-sold-to-ship-to>'
        });

        $stateProvider.state('wms.product', {
            url: '/product',
            template: '<master-product></master-product>'
        });

        $stateProvider.state('wms.product_category', {
            url: '/product-category',
            template: '<master-product-category></master-product-category>'
        });

        $stateProvider.state('wms.product_type', {
            url: '/product-type',
            template: '<master-product-type></master-product-type>'
        });

        $stateProvider.state('wms.product_sub_type', {
            url: '/product-sub-type',
            template: '<master-product-sub-type></master-product-sub-type>'
        });

        $stateProvider.state('wms.document_type', {
            url: '/document-type',
            template: '<master-document-type></master-document-type>'
        });

        $stateProvider.state('wms.product_owner', {
            url: '/product-owner',
            template: '<master-product-owner></master-product-owner>'
        });

        $stateProvider.state('wms.product_conversion', {
            url: '/product-conversion/',
            template: '<master-product-conversion></master-product-conversion>',
        });

        $stateProvider.state('wms.product_conversion_barcode', {
            url: '/product-conversion-barcode',
            template: '<master-product-conversion-barcode></master-product-conversion-barcode>'
        });

        $stateProvider.state('wms.ware_house', {
            url: '/ware-house',
            template: '<master-ware-house></master-ware-house>'
        });

        $stateProvider.state('wms.work_area', {
            url: '/work-area',
            template: '<master-work-area></master-work-area>'
        });

        $stateProvider.state('wms.room', {
            url: '/room',
            template: '<master-room></master-room>'
        });

        $stateProvider.state('wms.zone', {
            url: '/zone',
            template: '<master-zone></master-zone>'
        });
        $stateProvider.state('wms.zone_putaway', {
            url: '/zone-putaway',
            template: '<master-zone-putaway></master-zone-putaway>'
        });

        $stateProvider.state('wms.zone_location', {
            url: '/zone-location',
            template: '<master-zone-location></master-zone-location>'
        });


        $stateProvider.state('wms.product_location', {
            url: '/product-location',
            template: '<master-product-location></master-product-location>'
        });


        $stateProvider.state('wms.location', {
            url: '/location',
            template: '<master-location></master-location>'
        });

        $stateProvider.state('wms.location_equipment', {
            url: '/location-equipment',
            template: '<master-location-equipment></master-location-equipment>'
        });

        $stateProvider.state('wms.location_lock', {
            url: '/location-lock',
            template: '<master-location-lock></master-location-lock>'
        });

        $stateProvider.state('wms.location_type', {
            url: '/location-type',
            template: '<master-location-type></master-location>'
        });

        $stateProvider.state('wms.grade', {
            url: '/grade',
            template: '<master-grade></master-grade>'
        });

        $stateProvider.state('wms.item_status', {
            url: '/item-status',
            template: '<master-item-status-summary></master-item-status-summary>'
        });

        $stateProvider.state('wms.location_work_area', {
            url: '/location-work-area',
            template: '<master-location-work-area></master-location-work-area>'
        });

        $stateProvider.state('wms.user', {
            url: '/user',
            template: '<master-user></master-user>'
        });
        $stateProvider.state('wms.user_truck', {
            url: '/user-truck',
            template: '<master-user-truck></master-user-truck>'
        });
        $stateProvider.state('wms.user_group', {
            url: '/user-group',
            template: '<master-user-group></master-user-group>'
        });
        $stateProvider.state('wms.user_group_menu', {
            url: '/user-group-menu',
            template: '<master-user-group-menu></master-user-group-menu>'
        });
        $stateProvider.state('wms.user_group_zone', {
            url: '/user-group-zone',
            template: '<master-user-group-zone></master-user-group-zone>'
        });
        $stateProvider.state('wms.task_group', {
            url: '/task-group',
            template: '<master-task-group></master-task-group>'
        });

        $stateProvider.state('wms.task_group_equipment', {
            url: '/task-group-equipment',
            template: '<master-task-group-equipment></master-task-group-equipment>'
        });

        $stateProvider.state('wms.task_group_user', {
            url: '/task-group-user',
            template: '<master-task-group-user></master-task-group-user>'
        });

        $stateProvider.state('wms.task_group_work_area', {
            url: '/task-group-work-area',
            template: '<master-task-group-work-area></master-task-group-work-area>'
        });

        $stateProvider.state('wms.master_task_group', {
            url: '/master-task-group',
            template: '<master-task-group></master-task-group>'
        });
        $stateProvider.state('wms.master_location_work_area', {
            url: '/master-location-work-area',
            template: '<master-location-work-area></master-location-work-area>'
        });
        $stateProvider.state('wms.master_work_area', {
            url: '/master-work-area',
            template: '<master-work-area></master-work-area>'
        });
        $stateProvider.state('wms.master_task_group_work_area', {
            url: '/master-task-group-work-area',
            template: '<master-task-group-work-area></master-task-group-work-area>'
        });

        $stateProvider.state('wms.master_task_group_equipment', {
            url: '/master-task-group-equipment',
            template: '<master-task-group-equipment></master-task-group-equipment>'
        });


        $stateProvider.state('wms.master_task_group_user', {
            url: '/master-task-group-user',
            template: '<master-task-group-user></master-task-group-user>'
        });

        $stateProvider.state('wms.cost_center', {
            url: '/cost-center',
            template: '<master-cost-center></master-cost-center>'
        });
        $stateProvider.state('wms.movement_type', {
            url: '/movement-type',
            template: '<master-movement-type></master-movement-type>'
        });

        // Tramsfer
        $stateProvider.state('wms.tranfer_summary', {
            url: '/tranfer-summary',
            template: '<tranfer-summary></tranfer-summary>'
        });

        $stateProvider.state('wms.transfer_summary', {
            url: '/transfer-summary',
            template: '<transfer-summary></transfer-summary>'
        });

        $stateProvider.state('wms.pick_form', {
            url: '/pick-form',
            template: '<pick-form></pick-form>'
        });

        $stateProvider.state('wms.transfer_item_active_summary', {
            url: '/transfer-item-active-summary',
            template: '<transfer-item-active-summary></transfer-item-active-summary>'
        });

        $stateProvider.state('wms.transfer_item_relocation_active_summary', {
            url: '/transfer-item-relocation-active-summary',
            template: '<transfer-item-relocation-active-summary></transfer-item-relocation-active-summary>'
        });

        $stateProvider.state('wms.transfer_item_relocation_reserve_summary', {
            url: '/transfer-item-relocation-reserve-summary',
            template: '<transfer-item-relocation-reserve-summary></transfer-item-relocation-reserve-summary>'
        });

        $stateProvider.state('wms.transfer_item_reserve_summary', {
            url: '/transfer-item-reserve-summary',
            template: '<transfer-item-reserve-summary></transfer-item-reserve-summary>'
        });

        $stateProvider.state('wms.check_bypass_for_replenish', {
            url: '/check-bypass-for-replenish',
            template: '<check-bypass-for-replenish></check-bypass-for-replenish>'
        });

        $stateProvider.state('wms.bypass_partial', {
            url: '/bypass-partial',
            template: '<bypass-partial></bypass-partial>'
        });

        $stateProvider.state('wms.carton_item_summary', {
            url: '/carton-item-summary',
            template: '<carton-item-summary></carton-item-summary>'
        });

        $stateProvider.state('wms.status_grade_summary', {
            url: '/status-grade-summary',
            template: '<status-grade-summary></status-grade-summary>'
        });

        $stateProvider.state('wms.transfer_pallet_summary', {
            url: '/transfer-pallet-summary',
            template: '<transfer-pallet-summary></transfer-pallet-summary>'
        });

        $stateProvider.state('wms.transfer_status_location_summary', {
            url: '/transfer-status-location-summary',
            template: '<transfer-status-location-summary></transfer-status-location-summary>'
        });

        $stateProvider.state('wms.transfer_carton_summary', {
            url: '/transfer-carton-summary',
            template: '<transfer-carton-summary></transfer-carton-summary>'
        });

        $stateProvider.state('wms.print_carton', {
            url: '/print-carton',
            template: '<print-carton></print-carton>'
        });
        $stateProvider.state('wms.gt_memo', {
            url: '/gt-memo-summary',
            template: '<gt-memo-summary></gt-memo-summary>'
        });

        // $stateProvider.state('wms.picking_tools', {
        //     url: '/picking-tools',
        //     template: '<picking-tools></picking-tools>'
        // });

        //inquiry
        $stateProvider.state('wms.sku', {
            url: '/sku-summary',
            template: '<sku-summary></sku-summary>'
        });

        $stateProvider.state('wms.memo', {
            url: '/memo-summary',
            template: '<memo-summary></memo-summary>'
        });

        $stateProvider.state('wms.report', {
            url: '/report-summary',
            template: '<report-summary></report-summary>'
        });

        $stateProvider.state('wms.pick_manual', {
            url: '/pick-manual',
            template: '<pick-manual-summary></pick-manual-summary>'
        });
        $stateProvider.state('wms.pick_short', {
            url: '/short-summary',
            template: '<short-summary></short-summary>'
        });

        $stateProvider.state('wms.pack_summary', {
            url: '/pack-summary',
            template: '<pack-summary></pack-summary>'
        });

        $stateProvider.state('wms.grid_page', {
            url: '/grid-page',
            template: '<master-grid-page></master-grid-page>'
        });

        $stateProvider.state('wms.facility', {
            url: '/facility',
            template: '<master-facility></master-facility>'
        });

        $stateProvider.state('wms.facility_type', {
            url: '/facilityType',
            template: '<master-facility-type></master-facility-type>'
        });

        $stateProvider.state('wms.warehouse_owner', {
            url: '/warehouse-owner',
            template: '<master-warehouse-owner></master-warehouse-owner>'
        });

        $stateProvider.state('wms.warehouse_owner_type', {
            url: '/warehouse-owner-type',
            template: '<master-warehouse-owner-type></master-warehouse-owner-type>'
        });

        $stateProvider.state('wms.rule_condition_field', {
            url: '/rule-condition-field',
            template: '<master-rule-condition-field></master-rule-condition-field>'
        });

        $stateProvider.state('wms.rule_condition_operation', {
            url: '/rule-condition-operation',
            template: '<master-rule-condition-operation></master-rule-condition-operation>'
        });

        $stateProvider.state('wms.rule', {
            url: '/rule',
            template: '<master-rule></master-rule>'
        });

        $stateProvider.state('wms.wave', {
            url: '/wave',
            template: '<master-wave></master-wave>'
        });
        $stateProvider.state('wms.rule_condition', {
            url: '/rule-condition',
            template: '<master-rule-condition></master-rule-condition>'
        });

        $stateProvider.state('wms.scan_pick', {
            url: '/scan-pick-summary',
            template: '<scan-pick-summary></scan-pick-summary>'
        });

        $stateProvider.state('wms.scan_pick_labeling', {
            url: '/scan-pick-labeling-summary',
            template: '<scan-pick-labeling-summary></scan-pick-labeling-summary>'
        });

        $stateProvider.state('wms.product_assembly', {
            url: '/product-assembly',
            template: '<master-product-assembly></master-product-assembly>'
        });

        // cyclecountSummary
        $stateProvider.state('wms.cyclecount_summary', {
            url: '/cyclecount-summary',
            template: '<cyclecount-summary></cyclecount-summary>'
        });

        // TaskCyclecountSummary
        $stateProvider.state('wms.taskcyclecount_summary', {
            url: '/taskcyclecount-summary',
            template: '<taskcyclecount-summary></taskcyclecount-summary>'
        });

        // cyclecountSummaryV2
        $stateProvider.state('wms.cyclecount_summary_v2', {
            url: '/cyclecount-summary-v2',
            template: '<cyclecount-summary-v2></cyclecount-summary-v2>'
        });

        // TaskCyclecountSummaryV2
        $stateProvider.state('wms.taskcyclecount_summary_v2', {
            url: '/taskcyclecount-summary-v2',
            template: '<taskcyclecount-summary-v2></taskcyclecount-summary-v2>'
        });

        // LocationZoneputaway
        $stateProvider.state('wms.location_zoneputaway', {
            url: '/location-zoneputaway',
            template: '<master-location-zoneputaway></master-location-zoneputaway>'
        });

        // RuleputawayConditionField
        $stateProvider.state('wms.ruleputaway_condition_field', {
            url: '/ruleputaway-condition-field',
            template: '<master-ruleputaway-condition-field></master-ruleputaway-condition-field>'
        });

        // RuleputawayCondition
        $stateProvider.state('wms.ruleputaway_condition', {
            url: '/ruleputaway-condition',
            template: '<master-ruleputaway-condition></master-ruleputaway-condition>'
        });

        // Ruleputaway
        $stateProvider.state('wms.ruleputaway', {
            url: '/ruleputaway',
            template: '<master-ruleputaway></master-ruleputaway>'
        });

        // CountManual
        $stateProvider.state('wms.count_manual', {
            url: '/count-manual',
            template: '<count-manual></count-manual>'
        });

        //OverallPerformanceDashboard
        $stateProvider.state('wms.overall_performance_dashboard', {
            url: '/overall-performance-dashboard',
            template: '<overall-performance-dashboard></overall-performance-dashboard>'
        });

        //PickingOrderPerformance
        $stateProvider.state('wms.picking_order_performance', {
            url: '/picking-order-performance',
            template: '<picking-order-performance></picking-order-performance>'
        });

        $stateProvider.state('wms.document_type_item_status', {
            url: '/document-type-item-status',
            template: '<master-document-type-item-status></master-document-type-item-status>'
        });

        //Bom
        $stateProvider.state('wms.bom_summary', {
            url: '/bom-summary',
            template: '<bom-summary></bom-summary>'
        });

        //ConfigUserGroupMenu
        $stateProvider.state('wms.config_user_group_menu', {
            url: '/config-user-group-menu',
            template: '<config-user-group-menu></config-user-group-menu>'
        });
        //truckControl
        $stateProvider.state('wms.truck_load_summary', {
            url: '/truck-load-summary',
            template: '<truck-load-summary></truck-load-summary>'
        });


        //config_Replenishment
        $stateProvider.state('wms.replenishment_summary', {
            url: '/replenishment-summary',
            template: '<replenishment-summary></replenishment-summary>'
        });

        //AssignJonTransfer
        $stateProvider.state('wms.assign_job_transfer', {
            url: '/assign-job-transfer',
            template: '<assign-job-transfer></assign-job-transfer>'
        });
        //Report3
        $stateProvider.state('wms.report_3', {
            url: '/report_3',
            template: '<report_3></report_3>'
        });
        //Report4
        $stateProvider.state('wms.report_4', {
            url: '/report_4',
            template: '<report_4></report_4>'
        });
        //Report1
        $stateProvider.state('wms.report_1', {
            url: '/report_1',
            template: '<report_1></report_1>'
        });

        //Report2
        $stateProvider.state('wms.report_2', {
            url: '/report_2',
            template: '<report_2></report_2>'
        });

        //Report5
        $stateProvider.state('wms.report_5', {
            url: '/report_5',
            template: '<report_5></report_5>'
        });

        //Report6
        $stateProvider.state('wms.report_6', {
            url: '/report_6',
            template: '<report_6></report_6>'
        });

        //Scan Ref Transfer No
        $stateProvider.state('wms.scan_ref_Transfer_no_summary', {
            url: '/scan-ref-transfer-no-summary',
            template: '<scan-ref-transfer-no-summary></scan-ref-transfer-no-summary>'
        });
        // masterZone
        $stateProvider.state('wms.master_zone', {
            url: '/master-zone',
            template: '<master-zone></master-zone>'
        });

        // AssignJobGR
        $stateProvider.state('wms.assign_job_gr', {
            url: '/assign-job-gr',
            template: '<assign-job-gr></assign-job-gr>'
        });

        // taskDockToStaging
        $stateProvider.state('wms.task_dock_to_staging', {
            url: '/dock-to-staging',
            template: '<dock-to-staging></dock-to-staging>'
        });

        // taskPutaway
        $stateProvider.state('wms.task_putaway', {
            url: '/task-putaway',
            template: '<task-putaway></task-putaway>'
        });

        // Stock
        $stateProvider.state('wms.stock_summary', {
            url: '/stock-summary',
            template: '<stock-summary></stock-summary>'
        });

        // aging
        $stateProvider.state('wms.aging_summary', {
            url: '/aging-summary',
            template: '<aging-summary></aging-summary>'
        });

        // movement
        $stateProvider.state('wms.movement_summary', {
            url: '/movement-summary',
            template: '<movement-summary></movement-summary>'
        });
        //Report7
        $stateProvider.state('wms.report_7', {
            url: '/report_7',
            template: '<report_7></report_7>'
        });

        //Report8
        $stateProvider.state('wms.report_8', {
            url: '/report_8',
            template: '<report_8></report_8>'
        });

        //Report9
        $stateProvider.state('wms.report_9', {
            url: '/report_9',
            template: '<report_9></report_9>'
        });

        //Report10
        $stateProvider.state('wms.report_10', {
            url: '/report_10',
            template: '<report_10></report_10>'
        });

        //Report11
        $stateProvider.state('wms.report_11', {
            url: '/report_11',
            template: '<report_11></report_11>'
        });

        //Report12
        $stateProvider.state('wms.report_12', {
            url: '/report_12',
            template: '<report_12></report_12>'
        });

        //Report13
        $stateProvider.state('wms.report_13', {
            url: '/report_13',
            template: '<report_13></report_13>'
        });

        //Report14
        $stateProvider.state('wms.report_14', {
            url: '/report_14',
            template: '<report_14></report_14>'
        });
        //Report15
        $stateProvider.state('wms.report_15', {
            url: '/report_15',
            template: '<report_15></report_15>'
        });
        //Report16
        $stateProvider.state('wms.report_16', {
            url: '/report_16',
            template: '<report_16></report_16>'
        });
        //Report17
        $stateProvider.state('wms.report_17', {
            url: '/report_17',
            template: '<report_17></report_17>'
        });
        //Report18
        $stateProvider.state('wms.report_18', {
            url: '/report_18',
            template: '<report_18></report_18>'
        });
        //Report19
        $stateProvider.state('wms.report_19', {
            url: '/report_19',
            template: '<report_19></report_19>'
        });
        //Report20
        $stateProvider.state('wms.report_20', {
            url: '/report_20',
            template: '<report_20></report_20>'
        });
        //Report21
        $stateProvider.state('wms.report_21', {
            url: '/report_21',
            template: '<report_21></report_21>'
        });
        //ReportPickingPerformanceRecords
        $stateProvider.state('wms.report_picking_performance_records', {
            url: '/report-picking-performance-records',
            template: '<report-picking-performance-records-summary></report-picking-performance-records-summary>'
        });
        //ReportInventoryAccuracy
        $stateProvider.state('wms.report_inventory_accuracy', {
            url: '/report-inventory-accuracy',
            template: '<report-inventory-accuracy-summary></report-inventory-accuracy-summary>'
        });
        //ReportKPI
        $stateProvider.state('wms.report_kpi', {
            url: '/report-kpi',
            template: '<report-kpi-summary></report-kpi-summary>'
        });
        //ReportSpaceUtilization
        $stateProvider.state('wms.report_space_utilization', {
            url: '/report-space-utilization',
            template: '<report-space-utilization-summary></report-space-utilization-summary>'
        });
        //ReportSummaryShipping
        $stateProvider.state('wms.report_summary_shipping', {
            url: '/report-summary-shipping',
            template: '<report-summary-shipping-summary></report-summary-shipping-summary>'
        });
        //ReportPerformance
        $stateProvider.state('wms.report_performance', {
            url: '/report-performance',
            template: '<report-performance-summary></report-performance-summary>'
        });
        //ReportLaborPerformance 
        $stateProvider.state('wms.report_labor_performance', {
            url: '/report-labor-performance',
            template: '<report-labor-performance-summary></report-labor-performance-summary>'
        });
        //ReportSummaryMaterialsStock
        $stateProvider.state('wms.report_summary_materials_stock', {
            url: '/report_summary_materials_stock',
            template: '<report_summary_materials_stock></report_summary_materials_stock>'
        });
        //ReportSummaryInventoryPayment
        $stateProvider.state('wms.report_summary_inventory_payment', {
            url: '/report_summary_inventory_payment',
            template: '<report_summary_inventory_payment></report_summary_inventory_payment>'
        });
        //ReportInventoryStock
        $stateProvider.state('wms.report_inventory_stock', {
            url: '/report_inventory_stock',
            template: '<report_inventory_stock></report_inventory_stock>'
        });
        //ReportFinishGoods
        $stateProvider.state('wms.report_finish_goods', {
            url: '/report_finish_goods',
            template: '<report_finish_goods></report_finish_goods>'
        });


        //PrintOutRetrun
        $stateProvider.state('wms.print_out_retrun', {
            url: '/print-out-retrun',
            template: '<print-out-retrun></print-out-retrun>'
        });

        //assignJobCycleCount
        $stateProvider.state('wms.assign_job_cycle_count', {
            url: '/assign-job-cycle-count',
            template: '<assign-job-cycle-count></assign-job-cycle-count>'
        });

        //assignJobCycleCount_V2
        $stateProvider.state('wms.assign_job_cycle_count_v2', {
            url: '/assign-job-cycle-count-v2',
            template: '<assign-job-cycle-count-v2></assign-job-cycle-count-v2>'
        });


        // $stateProvider.state('wms.user_form', {
        //     url: '/user-form',
        //     template: '<user-form></user-form>'
        // });

        $stateProvider.state('wms.booking_dock_check_form', {
            url: '/booking-dock-check-form',
            template: '<booking-dock-check-form></booking-dock-check-form>'
        });

        $stateProvider.state('wms.log_file', {
            url: '/log-file-summary',
            template: '<log-file-summary></log-file-summary>'
        });

        $stateProvider.state('wms.log_file_admin', {
            url: '/logs-file-admin-summary',
            template: '<logs-file-admin-summary></logs-file-admin-summary>'
        });

        $stateProvider.state('wms.log_sap_summary', {
            url: '/log-sap-summary',
            template: '<log-sap-summary></log-sap-summary>'
        });

        // virtual warehouse
        $stateProvider.state('wms.vwpreview', {
            url: '/vwpreview',
            template: '<virtual-warehouse-preview></virtual-warehouse-preview>'
        });

        $stateProvider.state('wms.vwmanage', {
            url: '/vwmanage',
            template: '<virtual-warehouse-manage></virtual-warehouse-manage>'
        });

        $stateProvider.state('wms.ship_to_form', {
            url: '/ship-to-form',
            template: '<ship-to-form></ship-to-form>'
        });

        $stateProvider.state('wms.sold_to_form', {
            url: '/sold-to-form',
            template: '<sold-to-form></sold-to-form>'
        });

        $stateProvider.state('wms.vendor_form', {
            url: '/vendor-form',
            template: '<vendor-form></vendor-form>'
        });

        $stateProvider.state('wms.owner_form', {
            url: '/owner-form',
            template: '<owner-form></owner-form>'
        });

        $stateProvider.state('wms.work_area_form', {
            url: '/work-area-form',
            template: '<work-area-form></work-area-form>'
        });

        $stateProvider.state('wms.location_form', {
            url: '/location-form',
            template: '<location-form></location-form>'
        });

        $stateProvider.state('wms.product_form', {
            url: '/product-form',
            template: '<product-form></product-form>'
        });

        $stateProvider.state('wms.product_conversion_barcode_form', {
            url: '/productconversionbarcode-form',
            template: '<productconversionbarcode-form></productconversionbarcode-form>'
        });

        $stateProvider.state('wms.product_conversion_form', {
            url: '/product-conversion-form',
            template: '<product-conversion-form></product-conversion-form>'
        });

        $stateProvider.state('wms.vehicle_type', {
            url: '/vehicle-type',
            template: '<master-vehicle-type></master-vehicle-type>'
        });

        $stateProvider.state('wms.bk_yard_dock_summary', {
            url: '/bk-yard-dock-summary',
            template: '<bk-yard-dock-summary></bk-yard-dock-summary>'
        });

        $stateProvider.state('wms.yard', {
            url: '/master-yard',
            template: '<master-yard></master-yard>'
        });
        $stateProvider.state('wms.yard_type', {
            url: '/master-yard-type',
            template: '<master-yard-type></master-yard-type>'
        });
        $stateProvider.state('wms.dock', {
            url: '/master-dock',
            template: '<master-dock></master-dock>'
        });
        $stateProvider.state('wms.dock_type', {
            url: '/master-dock-type',
            template: '<master-dock-type></master-dock-type>'
        });
        $stateProvider.state('wms.dock_zone', {
            url: '/master-dock-zone',
            template: '<master-dock-zone></master-dock-zone>'
        });
        $stateProvider.state('wms.carrier', {
            url: '/master-carrier',
            template: '<master-carrier></master-carrier>'
        });
        $stateProvider.state('wms.carrier_type', {
            url: '/master-carrier-type',
            template: '<master-carrier-type></master-carrier-type>'
        });
        $stateProvider.state('wms.dock_qouta', {
            url: '/master-dock-qouta',
            template: '<master-dock-qouta></master-dock-qouta>'
        });
        $stateProvider.state('wms.gate_checkin', {
            url: '/master-gate-checkin',
            template: '<master-gate-checkin></master-gate-checkin>'
        });
        $stateProvider.state('wms.gate_checkout', {
            url: '/master-gate-checkout',
            template: '<master-gate-checkout></master-gate-checkout>'
        });

        $stateProvider.state('wms.bk_assign_dock', {
            url: '/bk-assign-dock',
            template: '<bk-assign-dock></bk-assign-dock>'
        });
        $stateProvider.state('wms.bk_config_dock', {
            url: '/bk-config-dock',
            template: '<bk-config-dock></bk-config-dock>'
        });
        $stateProvider.state('wms.bk_dock_appointment', {
            url: '/bk-dock-appointment',
            template: '<bk-dock-appointment></bk-dock-appointment>'
        });
        $stateProvider.state('wms.bk_dock_check', {
            url: '/bk-dock-check',
            template: '<bk-dock-check></bk-dock-check>'
        });

        $stateProvider.state('wms.booking_dock_checkout_form', {
            url: 'booking-dock-checkout-form',
            template: '<booking-dock-checkout-form></booking-dock-checkout-form>'
        });
        $stateProvider.state('wms.import_file_summary', {
            url: '/import-file-summary',
            template: '<import-file-summary></import-file-summary>'
        });
        $stateProvider.state('wms.import_file_master_summary', {
            url: '/import-file-master-summary',
            template: '<import-file-master-summary></import-file-master-summary>'
        });

        $stateProvider.state('wms.import_master_summary', {
            url: '/import-master-summary',
            template: '<import-master-summary></import-master-summary>'
        });

        $stateProvider.state('wms.report_stock_aging', {
            url: '/report-stock-aging',
            template: '<report-stock-aging></report-stock-aging>'
        });

        $stateProvider.state('wms.report_vendor_warehouse', {
            url: '/report-vendor-warehouse',
            template: '<report-vendor-warehouse></report-vendor-warehouse>'
        });
        $stateProvider.state('wms.config_service_summary', {
            url: '/config-service-summary',
            template: '<config-service-summary></config-service-summary>'
        });

        $stateProvider.state('wms.service_charge_type_summary', {
            url: '/service-charge-type-summary',
            template: '<service-charge-type-summary></service-charge-type-summary>'
        });

        $stateProvider.state('wms.re_print_tag', {
            url: '/re-print-tag',
            template: '<re-print-tag></re-print-tag>'
        });
        $stateProvider.state('wms.invoice_summary', {
            url: '/invoice-summary',
            template: '<invoice-summary></invoice-summary>'
        });

        $stateProvider.state('wms.master_vendor_summary', {
            url: '/master-vendor-summary',
            template: '<master-vendor-summary></master-vendor-summary>'
        });

        $stateProvider.state('wms.master_article_summary', {
            url: '/master-article-summary',
            template: '<master-article-summary></master-article-summary>'
        });

        $stateProvider.state('wms.master_po_summary', {
            url: '/master-po-summary',
            template: '<master-po-summary></master-po-summary>'
        });

        $stateProvider.state('wms.po_summary', {
            url: '/po-summary',
            template: '<po-summary></po-summary>'
        });

        $stateProvider.state('wms.pallet_inspection_summary', {
            url: '/taskpallet-inspection',
            template: '<taskpallet-inspection></taskpallet-inspection>'
        });

        // $stateProvider.state('wms.un_pack', {
        //     url: '/un_pack',
        //     template: '<un_pack></un_pack>'
        // });

        $stateProvider.state('wms.un_pack', {
            url: '/task-un-pack',
            template: '<task-un-pack></task-un-pack>'
        });

        $stateProvider.state('wms.pack_of', {
            url: '/pack_of',
            template: '<pack_of></pack_of>'
        });

        $stateProvider.state('wms.check_stock_summary', {
            url: '/check-stock-summary',
            template: '<check-stock-summary></check-stock-summary>'
        });

        // Claim
        $stateProvider.state('wms.claim', {
            url: '/claim-summary',
            template: '<claim-summary></claim-summary>'
        });
        $stateProvider.state('wms.plan_form', {
            url: '/plan-form',
            template: '<plan-form></plan-form>'
        });

        $stateProvider.state('wms.booking_gate_dock_check_in', {
            url: '/booking-gate-dock-check-in',
            template: '<booking-gate-dock-check-in></booking-gate-dock-check-in>'
        });

        $stateProvider.state('wms.booking_gate_dock_check_out', {
            url: '/booking-gate-dock-check-out',
            template: '<booking-gate-dock-check-out></booking-gate-dock-check-out>'
        });

        $stateProvider.state('wms.booking_gate_dock_check_summary', {
            url: '/booking-gate-dock-check-summary',
            template: '<booking-gate-dock-check-summary></booking-gate-dock-check-summary>'
        });

        $stateProvider.state('wms.queue_yard_yock_summary', {
            url: '/queue-yard-dock-summary',
            template: '<queue-yard-dock-summary></queue-yard-dock-summary>'
        });
        // RollCage
        $stateProvider.state('wms.chute', {
            url: '/chute',
            template: '<chute></chute>'
        });
        $stateProvider.state('wms.scan_in', {
            url: '/scan-in',
            template: '<scan-in></scan-in>'
        });
        $stateProvider.state('wms.scan_in_rework', {
            url: '/scan-in-rework',
            template: '<scan-in-rework></scan-in-rework>'
        });
        $stateProvider.state('wms.scan_out', {
            url: '/scan-out',
            template: '<scan-out></scan-out>'
        });
        $stateProvider.state('wms.send_rollcage', {
            url: '/send-rollcage',
            template: '<send-rollcage></send-rollcage>'
        });
        $stateProvider.state('wms.film_cutting', {
            url: '/film-cutting',
            template: '<film-cutting></film-cutting>'
        });
        $stateProvider.state('wms.call_full_roll_cage', {
            url: '/call-full-roll-cage',
            template: '<call-full-roll-cage></call-full-roll-cage>'
        });
        $stateProvider.state('wms.rework_roll_cage', {
            url: '/rework-roll-cage',
            template: '<rework-roll-cage></rework-roll-cage>'
        });
        $stateProvider.state('wms.tag_out', {
            url: '/tag-out',
            template: '<tag-out></tag-out>'
        });
        $stateProvider.state('wms.scan_pick_location', {
            url: '/scan-pick-location-summary',
            template: '<scan-pick-location-summary></scan-pick-location-summary>'
        });
        $stateProvider.state('wms.pick_to_light', {
            url: '/pick-to-light',
            template: '<pick-to-light></pick-to-light>'
        });

        $stateProvider.state('wms.task_transfer', {
            url: '/task-transfer',
            template: '<task-transfer></task-transfer>'
        });

        $stateProvider.state('wms.task_transfer_replenish', {
            url: '/task-transfer-replenish',
            template: '<task-transfer-replenish></task-transfer-replenish>'
        });

        $stateProvider.state('wms.return_tote', {
            url: '/return-tote',
            template: '<return-tote></return-tote>'
        });

        $stateProvider.state('wms.scan_pick_qty', {
            url: '/scan-pick-qty-summary',
            template: '<scan-pick-qty-summary></scan-pick-qty-summary>'
        });

        $stateProvider.state('wms.move_to_selective_on_ground', {
            url: '/move-to-selective-on-ground-summary',
            template: '<move-to-selective-on-ground-summary></move-to-selective-on-ground-summary>'
        });
        $stateProvider.state('wms.tracking_loading', {
            url: '/tracking-loading',
            template: '<tracking-loading></tracking-loading>'
        });
        $stateProvider.state('wms.stg_to_dock', {
            url: '/scan-pick-stg-to-dock-summary',
            template: '<scan-pick-stg-to-dock-summary></scan-pick-stg-to-dock-summary>'
        });
        $stateProvider.state('wms.rework_pallet_inspection', {
            url: '/rework-pallet-inspection',
            template: '<rework-pallet-inspection></rework-pallet-inspection>'
        });
        $stateProvider.state('wms.car_inspection_summary', {
            url: '/car-inspection-summary',
            template: '<car-inspection-summary></car-inspection-summary>'
        });
        $stateProvider.state('wms.return_to_wb_summary', {
            url: '/return-towb',
            template: '<return-towb></return-towb>'
        });

        $stateProvider.state('wms.check_qr', {
            url: '/check-qr',
            template: '<check-qr></check-qr>'
        });

        $stateProvider.state('wms.short_ship', {
            url: '/short-ship-summary',
            template: '<short-ship-summary></short-ship-summary>'
        });

        //Check stock mobile
        $stateProvider.state('wms.check_stock_mobile_summary', {
            url: '/check-stock-mobile-summary',
            template: '<check-stock-mobile-summary></check-stock-mobile-summary>'
        });

        //REPORTCHECKSCANROLLCAGE
        $stateProvider.state('wms.report_check_scan_roll_cage_summary', {
            url: '/report_check_scan_roll_cage_summary',
            template: '<report-check-scan-roll-cage-summary></report-check-scan-roll-cage-summary>'
        });

        $stateProvider.state('wms.productv2', {
            url: '/productV2',
            template: '<master-product-v2></master-product-v2>'
        });

        $stateProvider.state('wms.product_form_v2', {
            url: '/product-formV2',
            template: '<product-form-v2></product-form-v2>'
        });

        $stateProvider.state('wms.product_conversion_v2', {
            url: '/product-conversionV2/',
            template: '<master-product-conversion-v2></master-product-conversion-v2>',
        });

        $stateProvider.state('wms.product_conversion_form_v2', {
            url: '/product-conversion-formV2',
            template: '<product-conversion-form-v2></product-conversion-form-v2>'
        });

        $stateProvider.state('wms.trace_picking', {
            url: '/trace-picking-summary',
            template: '<trace-picking-summary></trace-picking-summary>'
        });

        $stateProvider.state('wms.trace_loading', {
            url: '/trace-loading-summary',
            template: '<trace-loading-summary></trace-loading-summary>'
        });

        $stateProvider.state('wms.trace_transfer', {
            url: '/trace-transfer-summary',
            template: '<trace-transfer-summary></trace-transfer-summary>'
        });

        $stateProvider.state('wms.send_rollcage_to_staging', {
            url: '/send-rollcage-to-staging',
            template: '<send-rollcage-to-staging></send-rollcage-to-staging>'
        });

        $stateProvider.state('wms.tranfer_one_zero_four', {
            url: '/tranfer-one-zero-four',
            template: '<tranfer-one-zero-four></tranfer-one-zero-four>'
        });

        $stateProvider.state('wms.gi_wave_summary', {
            url: '/gi-wave-summary',
            template: '<gi-wave-summary></gi-wave-summary>'
        });
        $stateProvider.state('wms.check_wave_gI_summary', {
            url: '/check-wave-gi-summary',
            template: '<check-wave-gi-summary></check-wave-gi-summary>'
        });
        $stateProvider.state('wms.transfer_dynamic_slotting', {
            url: '/tranfer-dynamic-slotting',
            template: '<tranfer-dynamic-slotting></tranfer-dynamic-slotting>'
        });
        $stateProvider.state('wms.round_wave_from_truck_load_summary', {
            url: '/round-wave-from-truck-load-summary',
            template: '<round-wave-from-truck-load-summary></round-wave-from-truck-load-summary>'
        });
        // AUT
        $stateProvider.state('wms.transfer_Ondemand_Summary', {
            url: '/transfer-ondemand-summary',
            template: '<transfer-ondemand-summary></transfer-ondemand-summary>'
        });
        // AUT
        $stateProvider.state('wms.business_unit', {
            url: '/business-unit',
            template: '<master-business-unit></master-business-unit>'
        });

        //nonStandardizedTransactions 
        $stateProvider.state('wms.non_standardized_transactions', {
            url: '/non-standardized-transactions',
            template: '<non-standardized-transactions-summary></non-standardized-transactions-summary>'
        });

        //workOutstanding 
        $stateProvider.state('wms.work_outstanding', {
            url: '/work-outstanding',
            template: '<work-outstanding-summary></work-outstanding-summary>'
        });
        // AUT   checkRollCageDataSummary
        $stateProvider.state('wms.check_roll_cage_data_summary', {
            url: '/check_roll_cage_data_summary',
            template: '<check-roll-cage-data-summary></check-roll-cage-data-summary>'
        });
        //masterdata-plant
        $stateProvider.state('wms.plant', {
            url: '/plant',
            template: '<master-plant></master-plant>'
        });
        //mastersloc
        $stateProvider.state('wms.sloc', {
            url: '/sloc',
            template: '<master-sloc></master-sloc>'
        });

        $stateProvider.state('wms.equipment_status', {
            url: '/equipment_status',
            template: '<equipment-status-summary></equipment-status-summary>'
        });

        $stateProvider.state('wms.log_gr', {
            url: '/log-gr',
            template: '<log-gr></log-gr>'
        });

        $stateProvider.state('wms.log_gi', {
            url: '/log-gi',
            template: '<log-gi></log-gi>'
        });

        $stateProvider.state('wms.log_transfers', {
            url: '/log-transfers',
            template: '<log-transfers></log-transfers>'
        });


        $stateProvider.state('wms.emergency_billing', {
            url: '/emergency_billing',
            template: '<emer-gency-billing-summary></emer-gency-billing-summary>'
        });

        $stateProvider.state('wms.emergency_truckmanifest', {
            url: '/emergency_truckmanifest',
            template: '<emer-gency-truck-manifest-summary></emer-gency-truck-manifest-summary>'
        });

        $stateProvider.state('wms.config_sku', {
            url: '/config_sku_summary',
            template: '<config-sku-summary</config-sku-summary>'
        });

        $stateProvider.state('wms.location_partial', {
            url: '/location-partial',
            template: '<location-partial-summary></location-partial-summary>'
        });

        $stateProvider.state('wms.import_file_transfer_summary', {
            url: '/import_file_transfer_summary',
            template: '<import-file-transfer-summary></import-file-transfer-summary>'
        });

        //ReportRecall
        $stateProvider.state('wms.report_recall_summary', {
            url: '/report_recall_summary',
            template: '<report-recall-summary></report-recall-summary>'
        });

        //PCD (PAT)
        $stateProvider.state('wms.pallet_control_docket_summary', {
            url: '/pallet_control_docket_summary',
            template: '<pallet-control-docket-summary></pallet-control-docket-summary>'
        });

        //Pallet Add
        $stateProvider.state('wms.pallet_add_summary', {
            url: '/pallet_add_summary',
            template: '<pallet-add-summary></pallet-add-summary>'
        });

        //Pallet Borrow-Return
        $stateProvider.state('wms.pallet_borrow_return_summary', {
            url: '/pallet_borrow_return_summary',
            template: '<pallet-borrow-return-summary></pallet-borrow-return-summary>'
        });

        //logsCancle
        $stateProvider.state('wms.log_cancel', {
            url: '/log_cancel',
            template: '<log-cancel></log-cancel>'
        });

        //QTY Flow on Rack
        $stateProvider.state('wms.qty_on_flowrack_carousel_summary', {
            url: '/qty_on_flowrack_carousel_summary',
            template: '<reportqty-onflow-rack-summary></reportqty-onflow-rack-summary>'
        });

        // Report Support

        // checkBalanceAllLocation
        $stateProvider.state('wms.check_balance_all_location', {
            url: '/checkBalanceAllLocation',
            template: '<check_balance_all_location></check_balance_all_location>'
        });
        // checkDimensionAllProduct
        $stateProvider.state('wms.check_dimension_all_product', {
            url: '/checkDimensionAllProduct',
            template: '<check_dimension_all_product></check_dimension_all_product>'
        });
        // checkGiExp
        $stateProvider.state('wms.check_gi_exp', {
            url: '/checkGiExp',
            template: '<check_gi_exp></check_gi_exp>'
        });
        // checkGrPutaway
        $stateProvider.state('wms.check_gr_putaway', {
            url: '/checkGrPutaway',
            template: '<check_gr_putaway></check_gr_putaway>'
        });
        // checkOnGroundRobot
        $stateProvider.state('wms.check_on_ground_robot', {
            url: '/checkOnGroundRobot',
            template: '<check_on_ground_robot></check_on_ground_robot>'
        });
        // checkOrderNotPick
        $stateProvider.state('wms.check_order_not_pick', {
            url: '/checkOrderNotPick',
            template: '<check_order_not_pick></check_order_not_pick>'
        });
        // checkPickTime
        $stateProvider.state('wms.check_pick_time', {
            url: '/checkPickTime',
            template: '<check_pick_time></check_pick_time>'
        });
        // checkPlanGiandGidiff
        $stateProvider.state('wms.check_plan_giand_gidiff', {
            url: '/checkPlanGiandGidiff',
            template: '<check_plan_giand_gidiff></check_plan_giand_gidiff>'
        });
        // checkReplenishByOrder
        $stateProvider.state('wms.check_replenish_by_order', {
            url: '/checkReplenishByOrder',
            template: '<check_replenish_by_order></check_replenish_by_order>'
        });
        // checkReplenishCfrByMax
        $stateProvider.state('wms.check_replenish_cfr_by_max', {
            url: '/checkReplenishCfrByMax',
            template: '<check_replenish_cfr_by_max></check_replenish_cfr_by_max>'
        });
        // ReportCheckReplenishVCByMax
        $stateProvider.state('wms.report_check_replenish_vc_by_max', {
            url: '/ReportCheckReplenishVCByMax',
            template: '<report_check_replenish_vc_by_max></report_check_replenish_vc_by_max>'
        });
        // reportCheckReturnTote
        $stateProvider.state('wms.report_check_return_tote', {
            url: '/reportCheckReturnTote',
            template: '<report_check_return_tote></report_check_return_tote>'
        });
        // reportCheckStockAvb
        $stateProvider.state('wms.report_check_stock_avb', {
            url: '/reportCheckStockAvb',
            template: '<report_check_stock_avb></report_check_stock_avb>'
        });
        // report_check_stock_On_Hand
        $stateProvider.state('wms.report_check_stock_On_Hand', {
            url: '/report_check_stock_On_Hand',
            template: '<report_check_stock_On_Hand></report_check_stock_On_Hand>'
        });
        // report_check_stock_on_hand_partial
        $stateProvider.state('wms.report_check_stock_on_hand_partial', {
            url: '/report_check_stock_on_hand_partial',
            template: '<report_check_stock_on_hand_partial></report_check_stock_on_hand_partial>'
        });
        // report_check_tote_pending_return
        $stateProvider.state('wms.report_check_tote_pending_return', {
            url: '/report_check_tote_pending_return',
            template: '<report_check_tote_pending_return></report_check_tote_pending_return>'
        });
        // report_check_transaction_gi
        $stateProvider.state('wms.report_check_transaction_gi', {
            url: '/report_check_transaction_gi',
            template: '<report_check_transaction_gi></report_check_transaction_gi>'
        });
        // report_check_transaction_gr
        $stateProvider.state('wms.report_check_transaction_gr', {
            url: '/report_check_transaction_gr',
            template: '<report_check_transaction_gr></report_check_transaction_gr>'
        });
        // report_check_transaction_gr
        $stateProvider.state('wms.report_check_transfer', {
            url: '/report_check_transfer',
            template: '<report_check_transfer></report_check_transfer>'
        });
        // report_check_transaction_gr
        $stateProvider.state('wms.report_check_zone_putaway', {
            url: '/report_check_zone_putaway',
            template: '<report_check_zone_putaway></report_check_zone_putaway>'
        });

        // Report Wrong Location
        $stateProvider.state('wms.report_wrong_location_summary', {
            url: '/report_wrong_location_summary',
            template: '<report-wrong-location-summary></report-wrong-location-summary>'
        });

        // Pallets
        $stateProvider.state('wms.return_tote_history', {
            url: '/return_tote_history',
            template: '<return_tote_history></return_tote_history>'
        });

        // $stateProvider.state('wms.history_tote', {
        //     url: '/history_tote',
        //     template: '<history_tote></history_tote>'
        // });

        $stateProvider.state('wms.pallet', {
            url: '/pallet',
            template: '<pallets_summary></pallets_summary>'
        });
        $stateProvider.state('wms.history_pallet', {
            url: '/history_pallet',
            template: '<history_pallets></history_pallets>'
        });
        //borrowing-return
        $stateProvider.state('wms.br_summary', {
            url: '/br_summary',
            template: '<br_summary></br_summary>'
        });

        //add-pallet
        $stateProvider.state('wms.add_pallet_summary', {
            url: '/add_pallet_summary',
            template: '<add_pallet_summary></add_pallet_summary>'
        });

        //pallet-history
        $stateProvider.state('wms.pallet_history_summary', {
            url: '/pallet_history_summary',
            template: '<pallet_history_summary></pallet_history_summary>'
        });

        //sccsmapping
        $stateProvider.state('wms.sccs_mapping_summary', {
            url: '/sccs_mapping_summary',
            template: '<sccs_mapping_summary></sccs_mapping_summary>'
        });

        // replenishondemandSummary
        $stateProvider.state('wms.replenish_on_demand_summary', {
            url: '/replenish-on-demand-summary',
            template: '<replenish-on-demand-summary></replenish-on-demand-summary>'
        });

        //config_piecepick_item_summary
        $stateProvider.state('wms.config_piecepick_item_summary', {
            url: '/config_piecepick_item_summary',
            template: '<config_piecepick_item_summary></config_piecepick_item_summary>'
        });

        //ReportRecall-inbound
        $stateProvider.state('wms.report_recall_inbound_summary', {
            url: '/report_recall_inbound_summary',
            template: '<report-recall-inbound-summary></report-recall-inbound-summary>'
        });

        //ReportRecallOutbound
        $stateProvider.state('wms.report_recall_outbound_summary', {
            url: '/report_recall_outbound_summary',
            template: '<report-recall-outbound-summary></report-recall-outbound-summary>'
        });

        // ReportGIByShipmentDateAndBusinessUnit
        $stateProvider.state('wms.report_gi_by_shipment_date_and_business_unit', {
            url: '/report-gi-by-shipment-date-and-business-unit',
            template: '<report_gi_by_shipment_date_and_business_unit></report_gi_by_shipment_date_and_business_unit>'
        });

        //reportVolumeByShipToPickZone
        $stateProvider.state('wms.report_volume_by_ship_to_pick_zone', {
            url: '/report_volume_by_ship_to_pick_zone',
            template: '<report_volume_by_ship_to_pick_zone></report_volume_by_ship_to_pick_zone>'
        });

        //reportGiByShipmentNoProductId
        $stateProvider.state('wms.report_gi_by_shipment_no_product_id', {
            url: '/report_gi_by_shipment_no_product_id',
            template: '<report_gi_by_shipment_no_product_id></report_gi_by_shipment_no_product_id>'
        });

        //volumeByAppointmentPickZone
        $stateProvider.state('wms.volume_By_Appointment_Pick_Zone', {
            url: '/volume_By_Appointment_Pick_Zone',
            template: '<volume_By_Appointment_Pick_Zone></volume_By_Appointment_Pick_Zone>'
        });

        //volumeByShipmentPickZone
        $stateProvider.state('wms.volume_By_Shipment_Pick_Zone', {
            url: '/volume_By_Shipment_Pick_Zone',
            template: '<volume_By_Shipment_Pick_Zone></volume_By_Shipment_Pick_Zone>'
        });

        //UniversalScarch
        $stateProvider.state('wms.universal_scarch', {
            url: '/universal-scarch',
            template: '<universal-scarch></universal-scarch>'
        });

        //ReportSerialNumber
        $stateProvider.state('wms.report_serial_number_summary', {
            url: '/report-serial-number-summary',
            template: '<report_serial_number-summary></universal-scarch-summary>'
        });

        //summary_cycle_count
        $stateProvider.state('wms.summary_cycle_count', {
            url: '/summary_cycle_count',
            template: '<summary_cycle_count></summary_cycle_count>'
        });

        //on_hand_summary
        $stateProvider.state('wms.on_hand_summary', {
            url: '/on_hand_summary',
            template: '<on_hand_summary></on_hand_summary>'
        });

        //Report_Summmary_Cyclecount
        $stateProvider.state('wms.report_Summary_Cycle_Count_Summary', {
            url: '/report_Summary_Cycle_Count_Summary',
            template: '<report_Summary_Cycle_Count_Summary></report_Summary_Cycle_Count_Summary>'
        });


        $stateProvider.state('wms.scan_pick_export', {
            url: '/scan-pick-export-summary',
            template: '<scan-pick-export-summary></scan-pick-export-summary>'
        });

        $stateProvider.state('wms.scan_pick_labeling_export', {
            url: '/scan-pick-labeling-export-summary',
            template: '<scan-pick-labeling-export-summary></scan-pick-labeling-export-summary>'
        });

        $stateProvider.state('wms.scan_pick_qty_export', {
            url: '/scan-pick-qty-export-summary',
            template: '<scan-pick-qty-export-summary></scan-pick-qty-export-summary>'
        });

        $stateProvider.state('wms.scan_pick_location_export', {
            url: '/scan-pick-location-export-summary',
            template: '<scan-pick-location-export-summary></scan-pick-location-export-summary>'
        });

        $stateProvider.state('wms.tracking_loading_export', {
            url: '/tracking-loading-export',
            template: '<tracking-loading-export></tracking-loading-export>'
        });

        $stateProvider.state('wms.move_to_selective_on_ground_export', {
            url: '/move-to-selective-on-ground-export-summary',
            template: '<move-to-selective-on-ground-export-summary></move-to-selective-on-ground-export-summary>'
        });

        $stateProvider.state('wms.stg_to_dock_export', {
            url: '/scan-pick-stg-to-dock-export-summary',
            template: '<scan-pick-stg-to-dock-export-summary></scan-pick-stg-to-dock-export-summary>'
        });

        //reportShippingMark
        $stateProvider.state('wms.report_shipping_mark', {
            url: '/report_shipping_mark',
            template: '<report_shipping_mark></report_shipping_mark>'
        });

        //reportPackingPlan
        $stateProvider.state('wms.report_packing_plan', {
            url: '/report_packing_plan',
            template: '<report_packing_plan></report_packing_plan>'
        });

        //reportPick
        $stateProvider.state('wms.report_pick', {
            url: '/report_pick',
            template: '<report_pick></report_pick>'
        });

        //reportLaborUtilization
        $stateProvider.state('wms.report_labor_utilization', {
            url: '/report_labor_utilization',
            template: '<report_labor_utilization></report_labor_utilization>'
        });

        //reportLaborIncentiveScheme
        $stateProvider.state('wms.report_labor_incentive_Scheme', {
            url: '/report_labor_incentive_Scheme',
            template: '<report_labor_incentive_Scheme></report_labor_incentive_Scheme>'
        });

        //reportLaborIncentiveScheme
        $stateProvider.state('wms.report_stockby_zone_report_ageging', {
            url: '/report_stockby_zone_report_ageging',
            template: '<report_stockby_zone_report_ageging></report_stockby_zone_report_ageging>'
        });

        $stateProvider.state('wms.report_picking', {
            url: '/report_picking',
            template: '<report_picking></report_picking>'
        });

        $stateProvider.state('wms.report_work_standing', {
            url: '/report_work_standing',
            template: '<report_work_standing></report_work_standing>'
        });

        $stateProvider.state('wms.report_cover_day', {
            url: '/report_cover_day',
            template: '<report_cover_day></report_cover_day>'
        });

        $stateProvider.state('wms.report_putaway', {
            url: '/report_putaway',
            template: '<report_putaway></report_putaway>'
        });

        //reportReceiving
        $stateProvider.state('wms.report_receiving', {
            url: '/report_receiving',
            template: '<report_receiving></report_receiving>'
        });

         //reportShipping
         $stateProvider.state('wms.report_shipping', {
            url: '/report_shipping',
            template: '<report_shipping></report_shipping>'
        });

        $stateProvider.state('wms.report_reconcile_sap', {
            url: '/report-reconcile-sap',
            template: '<report-reconcile-sap></report-reconcile-sap>'
        });

        $stateProvider.state('wms.report_not_movement', {
            url: '/report-not-movement',
            template: '<report-not-movement></report-not-movement>'
        });

        $stateProvider.state('wms.report_movement', {
            url: '/report-movement',
            template: '<report-movement></report-movement>'
        });

        $stateProvider.state('wms.report_picking_performance', {
            url: '/report-picking_performance',
            template: '<report-picking_performance></report-picking_performance>'
        });

         //reportTraceability
         $stateProvider.state('wms.report_traceability', {
            url: '/report_traceability',
            template: '<report_traceability></report_traceability>'
        });

        //reportTraceability
        $stateProvider.state('wms.report_movement_v2', {
            url: '/report_movement_v2',
            template: '<report_movement_v2></report_movement_v2>'
        });

        //report Article Not Movement
        $stateProvider.state('wms.report_article_Not_movement', {
            url: '/report_article_Not_movement',
            template: '<report_article_Not_movement></report_article_Not_movement>'
        });

         //reportSpaceUtilization
         $stateProvider.state('wms.report_sum_space_utilization', {
            url: '/report_sum_space_utilization',
            template: '<report_sum_space_utilization></report_sum_space_utilization>'
        });

        $stateProvider.state('wms.transfer_unpack_summary', {
            url: '/transfer_unpack_summary',
            template: '<transfer-unpack-summary></transfer-unpack-summary>'
        });

        $stateProvider.state('wms.task_unpack_transfer', {
            url: '/task-unpack-transfer',
            template: '<task-unpack-transfer></task-unpack-transfer>'
        });

        $stateProvider.state('wms.unpack_pick_form', {
            url: '/unpackpick-form',
            template: '<unpackpick-form></unpackpick-form>'
        });

        $stateProvider.state('wms.task_unpack', {
            url: '/tranfer-task-unpack-summary',
            template: '<tranfer-task-unpack-summary></tranfer-task-unpack-summary>'
        });

        $stateProvider.state('wms.task_pack', {
            url: '/pack_tranfer_summary',
            template: '<pack-tranfer-summary></pack-tranfer-summary>'
        });

        // StockOnRollcage
        $stateProvider.state('wms.stock_on_rollcage_summary', {
            url: '/stock-on-rollcage-summary',
            template: '<stock-on-rollcage-summary></stock-on-rollcage-summary>'
        });

        $stateProvider.state('wms.rebuild_index_summary', {
            url: '/rebuild-index-summary',
            template: '<rebuild-index-summary></rebuild-index-summary>'
        });

        //transfer export
        $stateProvider.state('wms.transfer_export_summary', {
            url: '/transfer-export-summary',
            template: '<transfer-export-summary></transfer-export-summary>'
        });

        $stateProvider.state('wms.import_file_transfer_export_summary', {
            url: '/import_file_transfer_export_summary',
            template: '<import-file-transfer-export-summary></import-file-transfer-export-summary>'
        });

        //Scan Ref Transfer No
        $stateProvider.state('wms.scan_ref_Transfer_no_export_summary', {
            url: '/scan-ref-transfer-no-export-summary',
            template: '<scan-ref-transfer-no-export-summary></scan-ref-transfer-no-export-summary>'
        });

        $stateProvider.state('wms.transfer_pallet_export_summary', {
            url: '/transfer-pallet-export-summary',
            template: '<transfer-pallet-export-summary></transfer-pallet-export-summary>'
        });

        $stateProvider.state('wms.transfer_status_location_export_summary', {
            url: '/transfer-status-location-export-summary',
            template: '<transfer-status-location-export-summary></transfer-status-location-export-summary>'
        });

        $stateProvider.state('wms.re_print_tag_export', {
            url: '/re-print-tag-export',
            template: '<re-print-tag-export></re-print-tag-export>'
        });

        $stateProvider.state('wms.pick_export_form', {
            url: '/pick-export-form',
            template: '<pick-export-form></pick-export-form>'
        });

        $stateProvider.state('wms.task_transfer_export', {
            url: '/task-transfer-export',
            template: '<task-transfer-export></task-transfer-export>'
        });

        $stateProvider.state('wms.history_close_wave_summary', {
            url: '/history-close-wave-summary',
            template: '<history-close-wave-summary></history-close-wave-summary>'
        });
        
    }

]);