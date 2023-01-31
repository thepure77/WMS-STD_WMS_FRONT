(function () {
    'use strict';
    app.factory("claimFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.OMS + "Claim",

                FilterSearch: function (model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.post(urlRequest, model);
                },
                getId: function (model) {
                    var urlRequest = this.url + "/find/" + model;
                    return clientService.get(urlRequest);
                },
                add: function (model) {   
                    var urlRequest = this.url + "/createOrUpdate";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },
                dropdownDocumentType: function (model) {
                    var urlRequest = this.url + "/dropdownDocumentType";
                    return clientService.post(urlRequest, model);
                },
                confirmStatus: function (model) {
                    var urlRequest = this.url + "/confirmStatus";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest,model);
                },
                closeDocument: function (model) {
                    var urlRequest = this.url + "/closeDocument" + "/";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },
                getDelete: function (model) {
                    var urlRequest = this.url + "/delete";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },    
                updateUserAssign: function (model) {
                    var urlRequest = this.url+ "/updateUserAssign";
                    return clientService.post(urlRequest, model);
                },
                cancel: function (model) {    
                    var urlRequest = this.url + "/cancel" + "/";

                    var resultModel = logsRequest(model.operations,urlRequest,model);
                    clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest,model);
                },
                checkProduct: function (model) {
                    var urlRequest = this.url+ "/checkProduct";
                    return clientService.popupReport(urlRequest, model);
                },
                dropdownProductconversion: function (model) {
                    var urlRequest = this.url + "/dropdownProductconversion";
                    return clientService.post(urlRequest, model);
                }
            }
        });
})();