(function () {
    'use strict';
    app.factory("palletsFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Palletmanage + "lentpallets",
                urlDropdown: webServiceAPI.Palletmanage + "Dropdown",
                //url: "http://10.106.159.10/AMZ_WMS_ReportAPI/api/ReportLaborPerformance",

                gettest: function (model) {
                    var urlRequest = this.url + "/gettest";
                    return clientService.post(urlRequest, model);
                },
                get: function (model) {
                    var urlRequest = this.url + "/get2";
                    return clientService.post(urlRequest, model);
                },
                root: function (model) {
                    var urlRequest = this.url + "/root";
                    return clientService.post(urlRequest, model);
                },
                PrintReport: function (model) {
                    var urlRequest = this.url+ "/printReportCheckZonePutaway";
                    return clientService.popupReport(urlRequest, model);
                },
                ExportExcel: function (model) {
                    var urlRequest = this.url + "/ExportExcel";
                    return clientService.downloadExcel(urlRequest, model);
                }, 
                dropdownVehicleType: function (model) {
                    var urlRequest = this.urlDropdown + "/vehicleTypedropdown";
                    return clientService.post(urlRequest, model);
                },
                dropdownDocumentType: function (model) {
                    var urlRequest = this.urlDropdown + "/documentTypefilter";
                    return clientService.post(urlRequest, model);
                },
                saveLentpallet: function (model) {
                    var urlRequest = this.url + "/SaveLentpallet";
                    return clientService.post(urlRequest, model);
                }, 
                Filter: function(model) {
                    var urlRequest = this.url + "/Filter";
                    return clientService.post(urlRequest, model);
                },
                delete: function (model) {
                    var urlRequest = this.url + "/DeleteLentpallet";
                    return clientService.post(urlRequest, model);
                },
                PrintLentpallet: function (model) {
                    var urlRequest = this.url+ "/printLentPallet";
                    return clientService.popupReport(urlRequest, model);
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
            logs.menu_Name = "จัดการวัสดุสำรองคลัง ขาเข้า";
            logs.sub_Menu_Index = "D9EA75A3-2807-4E8F-91BF-5648A5D4BE97"
            //logs.sub_MenuType_Index
            //logs.sub_Menu_Id
            logs.sub_Menu_Name = "ใบสั่งซื้อวัสดุสำรองคลัง";
            logs.operations = operations;
            //logs.ref_Document_Index
            //logs.ref_Document_No
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