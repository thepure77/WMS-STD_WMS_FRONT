(function () {
    'use strict';
    app.factory("expectedFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GI + "Expeated",
                ScanSoNo: function (model) {   
                    var urlRequest = this.url + "/ScanSoNo";
                    return clientService.post(urlRequest, model);
                }, 
                cartonQty: function (model) {              
                    var urlRequest = this.url + "/GetExpectedRF";
                    return clientService.post(urlRequest, model);
                },
                getExpectedRF: function (id) {
                    var urlRequest = this.url + "/GetExpectedRF" + "/" + id;
                    return clientService.get(urlRequest);
                }
            }
        });

})();