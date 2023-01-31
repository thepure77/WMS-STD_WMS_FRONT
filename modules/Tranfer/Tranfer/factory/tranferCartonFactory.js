(function () {
    'use strict';
    app.factory("tranferCartonFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Transfer + "TransferCarton",
                filter: function (model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.get(urlRequest, model);
                },                    
                scanCTNNo: function (model) {
                    var urlRequest = this.url + "/scanCartonNo";
                    return clientService.post(urlRequest, model);
                }, 
                Save: function (model) {
                    var urlRequest = this.url + "/SaveData";
                    return clientService.post(urlRequest, model);
                },    
                CheckCartonList: function (model) {
                    var urlRequest = this.url + "/CheckCarton";
                    return clientService.post(urlRequest, model);
                },                    
                scanTagNo: function (model) {
                    var urlRequest = this.url + "/ScanTagNo" + "/" + model;
                    return clientService.post(urlRequest);
                },  
                SumQty: function (model) {
                    var urlRequest = this.url + "/SumQty";
                    return clientService.post(urlRequest, model);
                },
                            
            }
        });

})();