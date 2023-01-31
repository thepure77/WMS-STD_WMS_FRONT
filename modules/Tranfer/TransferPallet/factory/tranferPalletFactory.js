(function () {
    'use strict';
    app.factory("tranferPalletFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
            var getData1 ;
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GT + "TransferPallet",
                urlLogsRequest: webServiceAPI.LogsUser + "Logs/insertLogsRequest",
                urlBinBalance: webServiceAPI.BinBalance,

                
                setParam: function (model){
                    getData1 = model;
                },
                getParam: function (){
                    return getData1;
                },
                filter: function (model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.get(urlRequest, model);
                },
                groupProduct: function (model) {
                    var urlRequest = this.url + "/GroupProduct";
                    return clientService.post(urlRequest, model);
                },                     
                scanLocation: function (model) {
                    var urlRequest = this.url + "/ScanLocation" ;
                    return clientService.post(urlRequest, model);
                },                     
                scanLpnNo: function (model) {
                    var urlRequest = this.url + "/ScanLpnNo" ;
                    return clientService.post(urlRequest, model);
                },   
                scanTransferNo : function (model) {
                    var urlRequest = this.url + "/filterTransferItem" ;
                    return clientService.post(urlRequest, model);
                },                   
                CheckBinBalance: function (model) {
                    var urlRequest = this.url + "/CheckBinBalance";
                    return clientService.post(urlRequest, model);
                },                    
                Save: function (model) {
                    var urlRequest = this.url + "/Confirm";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },  
                SumQty: function (model) {
                    var urlRequest = this.url + "/SumQty";
                    return clientService.post(urlRequest, model);
                },        
                checkProductLocation: function (model) {
                    var urlRequest = this.urlBinBalance + "Binbalance/checkProductLocation";
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
            logs.menu_Index = "2244C514-9000-4362-A8EA-D1F80214DD0F";
            //logs.menuType_Index
            //logs.menu_Id
            logs.menu_Name = "ระบบจัดการภายในคลังพัสดุ";
            logs.sub_Menu_Index = "2CE9DCF3-FF96-4821-B172-7EF609397CD8"
            //logs.sub_MenuType_Index
            //logs.sub_Menu_Id
            logs.sub_Menu_Name = "สแกน โอนย้ายพาเรท";
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