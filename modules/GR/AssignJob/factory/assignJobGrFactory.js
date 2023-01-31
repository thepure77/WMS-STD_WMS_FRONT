(function () {
    'use strict';
    app.factory("assignJobGrFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
            var getData1 ;
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GR + "AssignJob",
                urlDropdown: webServiceAPI.GR + "DropdownGoodsReceive",
                urlLogsRequest: webServiceAPI.LogsUser + "Logs/insertLogsRequest",

                assign: function (model){
                    var urlRequest = this.url+ "/assign";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },     
                taskfilter: function (model){
                    var urlRequest = this.url+ "/taskfilter";
                    return clientService.post(urlRequest, model);
                },   
                confirmTask: function (model){
                    var urlRequest = this.url+ "/confirmTask";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                }, 
                taskPopup: function (model){
                    var urlRequest = this.url+ "/taskPopup";
                    return clientService.post(urlRequest, model);
                }, 
                dropdownUser: function (model){
                    var urlRequest = this.urlDropdown+ "/dropdownUser";
                    return clientService.post(urlRequest, model);
                }, 
                deleteTask: function (model) {
                    debugger
                    var urlRequest = this.url+ "/deleteTask";
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
            logs.sub_Menu_Index = "FB5BDD9B-DFB1-418E-9329-08387FF73F27"
            //logs.sub_MenuType_Index
            //logs.sub_Menu_Id
            logs.sub_Menu_Name = "การมอบหมายงาน";
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