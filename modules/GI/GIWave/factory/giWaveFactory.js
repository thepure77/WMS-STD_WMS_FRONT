(function () {
    'use strict';
    app.factory("giWaveFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {
            var getData1;
            var getDataitem;
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GI_Auto + "GoodIssue",
                urlDropdown: webServiceAPI.PlanGI + "DropdownPlanGoodsIssue",
                urlPlanGI: webServiceAPI.PlanGI + "PlanGoodsIssue",
                urlTO: webServiceAPI.GI_Auto + "MakeTagOut",
                urlWCS: webServiceAPI.WCSV2 + "WMS",
                urlWCS_TEMP: webServiceAPI.WCS_TEMP + "WMS",
                urlLogsRequest: webServiceAPI.LogsUser + "Logs/insertLogsRequest",
                
                dropdownRound: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownRound";
                    return clientService.post(urlRequest, model);
                },
                filter: function (model) {
                    var urlRequest = this.urlPlanGI + "/fillterWave";
                    return clientService.post(urlRequest, model);
                },
                CheckbyWave: function (model) {
                    var urlRequest = this.url + "/CheckbyWave";
                    return clientService.post(urlRequest, model);
                },
                RunWaveByRound: function (model) {
                    var urlRequest = this.url + "/RunWaveByRound";
                    return clientService.post(urlRequest, model);
                },
                Make_tagout_V3: function (model) {
                    var urlRequest = this.urlTO + "/maketagOut_no_V3";
                    return clientService.post(urlRequest, model);
                },
                autoTaskByRound: function (model) {
                    var urlRequest = this.url + "/autoTaskByRound";
                    return clientService.post(urlRequest, model);
                },
                autoWaveByRound: function (model) {
                    var urlRequest = this.url + "/autoWaveByRound";
                    return clientService.post(urlRequest, model);
                },
                gen_picking_plan: function (model) {
                    var urlRequest = this.url + "/Update_pickingplan";
                    return clientService.post(urlRequest, model);
                },
                gen_wcs: function (model) {
                    var urlRequest = this.urlWCS + "/PREPARE_WAVE";
                    return clientService.post(urlRequest, model);
                },
                gen_wcs_repair: function (model) {
                    var urlRequest = this.urlWCS + "/REPAIR_PREPARE_WAVE";
                    return clientService.post(urlRequest, model);
                },
                gen_wcs_TEMP: function (model) {
                    var urlRequest = this.urlWCS_TEMP + "/WMS_WAVE";
                    return clientService.post(urlRequest, model);
                },
                gen_wcs_TEMP: function (model) {
                    var urlRequest = this.urlWCS_TEMP + "/WMS_WAVE";
                    return clientService.post(urlRequest, model);
                },
                checktagGi: function (model) {
                    var urlRequest = this.url + "/ChecktagGi";
                    return clientService.post(urlRequest, model);
                },
                checktagByGi: function (model) {
                    var urlRequest = this.url + "/ChecktagByGi";
                    return clientService.post(urlRequest, model);
                },
                updatebinbalance: function (model) {
                    var urlRequest = this.url + "/Updatebinbalance";
                    return clientService.post(urlRequest, model);
                },
                deletegoodsIssueitemlocation: function (model) {
                    var urlRequest = this.url + "/DeletegoodsIssueitemlocation";
                    return clientService.post(urlRequest, model);
                },
                savelogsRequest: function (model) {
                    
                    var resultModel = logsRequest(model.operations,"",model);
                    return clientService.post(this.urlLogsRequest, resultModel);
                },
            }
        });

        function logsRequest(operations,urlRequest,model)
        {
            var userLogin = JSON.parse(localStorage.userlogin);
            var logs = {};
            //logs.log_Index
            //logs.userGroup_Index
            //logs.userGroup_Id
            logs.userGroup_Name = localStorage['userGroupName'];
            logs.user_Index = userLogin.user_Index;
            logs.user_Id = userLogin.user_Id;
            logs.user_Name = userLogin.user_Name;
            logs.first_Name = userLogin.first_Name;
            logs.last_Name = userLogin.last_Name;
            logs.menu_Index = "17573B0A-4042-45A5-9C01-69189E1966C4";
            //logs.menuType_Index
            //logs.menu_Id
            logs.menu_Name = "จัดการสินค้า ขาออก";
            logs.sub_Menu_Index = "DAC9CC95-A736-4C33-807C-6A655305408B"
            //logs.sub_MenuType_Index
            //logs.sub_Menu_Id
            logs.sub_Menu_Name = "Run Wave";
            logs.operations = operations;
            //logs.ref_Document_Index
            //logs.ref_Document_No
            logs.udf_1 = "Labor";
            // if(model.log_udf_1 != undefined){
            //     logs.udf_1 = model.log_udf_1;
            // }
            if(model.log_udf_2 != undefined){
                logs.udf_2 = model.log_udf_2;
            }
            if(model.log_udf_3 != undefined){
                logs.udf_3 = model.log_udf_3;
            }
            if(model.log_udf_4 != undefined){
                logs.udf_4 = model.log_udf_4;
            }
            if(model.log_udf_5 != undefined){
                logs.udf_5 = model.log_udf_5;
            }
            logs.request_URL = urlRequest;
            logs.request_Body = JSON.stringify(model);
            //logs.isActive
            //logs.isDelete
            //logs.isSystem
            //logsFactory.SaveLogsRequest(logs).then(function (res) {

            //})
            return logs;
        };
})();
