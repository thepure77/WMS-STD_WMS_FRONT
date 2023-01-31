(function () {
    'use strict';
    app.factory("statusGradeFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Transfer + "LPN",
                filter: function (model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.get(urlRequest, model);
                },
                edit: function (model) {                        
                    var urlRequest = this.url;
                    return clientService.post(urlRequest, model);
                },  
                ScanBarcode: function (model) {
                    var urlRequest = this.url + "/ScanBarcode";
                    return clientService.post(urlRequest, model);
                },  
                confirmScan: function (model) {
                    var urlRequest = this.url + "/Confirm";
                    return clientService.post(urlRequest, model);
                },  
                SumQty: function (model) {
                    var urlRequest = this.url + "/SumQty";
                    return clientService.post(urlRequest, model);
                },
                
            }
        });

})();