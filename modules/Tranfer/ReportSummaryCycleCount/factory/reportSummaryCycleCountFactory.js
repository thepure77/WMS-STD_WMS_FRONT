(function () {
    'use strict';
    app.factory("reportSummaryCycleCountFactory",
    function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
        var getData1 = {};
        var getDefault;
        return {
            get: clientService.get,
            post: clientService.post,
            url: webServiceAPI.Cyclecount + "Cyclecount",
            urlDropdown: webServiceAPI.Cyclecount + "DropdownCyclecount",
            urlLogsRequest: webServiceAPI.LogsUser + "Logs/insertLogsRequest",

            filter: function (model) {
                var urlRequest = this.url + "/filterSummary";
                return clientService.post(urlRequest, model);
            },
            BinBalanceSearch: function (model) {
                var urlRequest = this.url + "/BinBalanceSearch";
                return clientService.post(urlRequest, model);
            },

            /////////////////////////////////////////////////////
            // filter: function (model) {
            //     var urlRequest = this.url + "/filter";
            //     return clientService.post(urlRequest, model);
            // },
            find: function (model) {   
                var urlRequest = this.url + "/find/" + model;
                return clientService.get(urlRequest);
            },
            getDelete: function (model) {                    
                var urlRequest = this.url + "/delete";

                // var resultModel = logsRequest(model.operations,urlRequest,model);
                // clientService.post(this.urlLogsRequest, resultModel);

                return clientService.post(urlRequest,model);
            },
            dropdownDocumentType: function (model) {
                var urlRequest = this.urlDropdown + "/dropdownDocumentType";
                return clientService.post(urlRequest, model);
            },
            dropdownStatus: function (model) {
                var urlRequest = this.urlDropdown + "/DropdownProcess";
                return clientService.post(urlRequest, model);
            },
            BinSearch: function (model) {
                var urlRequest = this.url + "/BinSearch";
                return clientService.post(urlRequest, model);
            },
            SaveCycleCount: function (model) {   
                var urlRequest = this.url + "/SaveCycleCount";

                // var resultModel = logsRequest(model.operations,urlRequest,model);
                // clientService.post(this.urlLogsRequest, resultModel);

                return clientService.post(urlRequest, model);
            },
            PrintOutCycleCount: function (model) {   
                var urlRequest = this.url + "/PrintOutCycleCount";

                // var resultModel = logsRequest(model.operations,urlRequest,model);
                // clientService.post(this.urlLogsRequest, resultModel);

                return clientService.popupReport(urlRequest, model);
            },
            popupProductfilter: function (model) {
                var urlRequest = this.url + "/popupProductfilter";
                return clientService.post(urlRequest, model);
            },
            popupZonefilter: function (model) {
                var urlRequest = this.url + "/popupZonefilter";
                return clientService.post(urlRequest, model);
            },
            ExportCycleCountDetail: function(model) {
                var urlRequest = this.url+ "/ExportCycleCountDetail";
                return clientService.downloadExcel(urlRequest, model);
            },
            confirmStatus: function (model) {                    
                var urlRequest = this.url + "/confirmStatus";

                // var resultModel = logsRequest(model.operations,urlRequest,model);
                // clientService.post(this.urlLogsRequest, resultModel);

                return clientService.post(urlRequest,model);
            },
            confirm: function (model) {                    
                var urlRequest = this.url + "/Confirm";

                return clientService.post(urlRequest,model);
            },
            adjustStock: function (model) {                    
                var urlRequest = this.url + "/adjustStock";

                return clientService.post(urlRequest,model);
            },
            ExportPDF_SummaryCyclecount: function (model) {
                var urlRequest = this.url + "/ReportSummaryPrintCycleCount";
                return clientService.downloadPDF(urlRequest, model);
            },
            ExportExcel: function (model) {
                var urlRequest = this.url + "/ReportSummaryPrintCycleCount";
                return clientService.downloadExcel2(urlRequest, model);
            },

            setParam: function (model) {
                getData1 = model;
            },
            getParam: function () {
                return getData1;
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
        logs.menu_Index = "2244C514-9000-4362-A8EA-D1F80214DD0F";
        //logs.menuType_Index
        //logs.menu_Id
        logs.menu_Name = "ระบบจัดการภายในคลังพัสดุ";
        logs.sub_Menu_Index = "A3BF0818-2A62-4B70-915D-D1619DCC1628"
        //logs.sub_MenuType_Index
        //logs.sub_Menu_Id
        logs.sub_Menu_Name = "การตรวจนับสินค้า";
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