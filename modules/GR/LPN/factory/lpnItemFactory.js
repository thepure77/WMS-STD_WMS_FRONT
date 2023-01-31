app.factory("lpnItemFactory", function(webServiceAPI, clientService) {
    return {
        get: clientService.get,
        post: clientService.post,
        url: webServiceAPI.GR + "LPNItem",
        urlLogsRequest: webServiceAPI.LogsUser + "Logs/insertLogsRequest",

        filterTagItem: function(model) {
            var urlRequest = this.url + "/FilterTagItem";
            return clientService.post(urlRequest, model);
        },
        confirmTagItemLocation: function(model) {
            var urlRequest = this.url + "/ConfirmTagItemLocation";

            var resultModel = logsRequest(model.operations,urlRequest,model);
            clientService.post(this.urlLogsRequest, resultModel);

            return clientService.post(urlRequest, model);
        },
        printTag: function(model) {
            var urlRequest = this.url + "/PrintTag";

            var resultModel = logsRequest(model.operations,urlRequest,model);
            clientService.post(this.urlLogsRequest, resultModel);

            return clientService.popupReport(urlRequest, model);
        },
        deleteTagItem: function(model) {
            var urlRequest = this.url + "/DeleteTagItem";

            var resultModel = logsRequest(model.operations,urlRequest,model);
            clientService.post(this.urlLogsRequest, resultModel);

            return clientService.popupReport(urlRequest, model);
        },
        sugesstionLocation: function(model) {
            var urlRequest = this.url + "/SugesstionLocation";

            // var resultModel = logsRequest(model.operations,urlRequest,model);
            // clientService.post(this.urlLogsRequest, resultModel);

            return clientService.posts(urlRequest, model);
        },
        PrintTagA5: function(model) {
            var urlRequest = this.url + "/PrintTagA5";

            var resultModel = logsRequest(model.operations,urlRequest,model);
            clientService.post(this.urlLogsRequest, resultModel);

            return clientService.popupReport(urlRequest, model);
        },
        PrintTagA3: function(model) {
            var urlRequest = this.url + "/PrintTagA3";

            var resultModel = logsRequest(model.operations,urlRequest,model);
            clientService.post(this.urlLogsRequest, resultModel);

            return clientService.popupReport(urlRequest, model);
        },
        PrintTagA2: function(model) {
            var urlRequest = this.url + "/PrintTagA2";

            var resultModel = logsRequest(model.operations,urlRequest,model);
            clientService.post(this.urlLogsRequest, resultModel);

            return clientService.popupReport(urlRequest, model);
        },
        PrintReportTagPutaway: function (model) {
            var urlRequest = this.url + "/ReportTagPutaway";
        
            // var resultModel = logsRequest(model.operations,urlRequest,model);
            // clientService.post(this.urlLogsRequest, resultModel);
        
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
    logs.menu_Name = "จัดการสินค้า ขาเข้า";
    logs.sub_Menu_Index = "066919AC-50DE-411C-8339-DD3065648A4E"
    //logs.sub_MenuType_Index
    //logs.sub_Menu_Id
    logs.sub_Menu_Name = "การสร้างป้ายกำกับสินค้า";
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