(function () {
    'use strict';
    app.factory("roundWaveFromTruckLoadFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {

            return {
                get: clientService.get,
                post: clientService.post,
                urlDropdown: webServiceAPI.PlanGI + "DropdownPlanGoodsIssue",
                urlGI: webServiceAPI.GI_Auto + "RoundWave",
               
                dropdownRound: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownRound";
                    return clientService.post(urlRequest, model);
                },
                dropdownTime: function (model) {
                    var urlRequest = this.urlGI + "/Appointtimefilter";
                    return clientService.post(urlRequest, model);
                },
                filter: function (model) {
                    var urlRequest = this.urlGI + "/filter";
                    return clientService.post(urlRequest, model);
                },
                Update_Round: function (model) {
                    var urlRequest = this.urlGI + "/Update_Round";

                    var resultModel = logsRequest(model.operations,urlRequest,model);
                    clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },
                Delete_Round: function (model) {
                    var urlRequest = this.urlGI + "/Delete_Round";
                    return clientService.post(urlRequest, model);
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
            logs.menu_Index = "AB361CA7-1431-4478-9BF1-11BF2A55693B";
            //logs.menuType_Index
            //logs.menu_Id
            logs.menu_Name = "จัดการสินค้า ขาเข้า";
            logs.sub_Menu_Index = "764CB119-C3A8-4011-B64C-CE63533C7F66"
            //logs.sub_MenuType_Index
            //logs.sub_Menu_Id
            logs.sub_Menu_Name = "Round Wave";
            logs.operations = operations;
            //logs.ref_Document_Index
            //logs.ref_Document_No
            logs.udf_1 = "Labor";
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