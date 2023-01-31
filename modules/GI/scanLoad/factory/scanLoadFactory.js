(function () {
    'use strict';
    app.factory("scanLoadFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Load + "TruckLoad",

                scanLoadNo: function (model) {   
                    var urlRequest = this.url + "/scanLoadNo";
                    return clientService.post(urlRequest, model);
                },
                filterPlanSN: function (model) {   
                    var urlRequest = this.url + "/filterPlanSN";
                    return clientService.post(urlRequest, model);
                },
                scanSoNo: function (model) {   
                    var urlRequest = this.url + "/scanSoNo";
                    return clientService.post(urlRequest, model);
                },
                confirmScan: function (model) {   
                    var urlRequest = this.url + "/confirmScan";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();