(function () {
    'use strict';
    app.factory("returnTowbFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GI  + "ReturnToWB",
                urlT: webServiceAPI.GT + "TransferStatusLocation",


                scanorder: function (model) {
                    var urlRequest = this.url + "/scanorder";
                    return clientService.post(urlRequest, model);
                },
                scanLocation: function (model) {
                    var urlRequest = this.url + "/ScanLocaton" ;
                    return clientService.post(urlRequest, model);
                },  
                saveorderlocation: function (model) {
                    var urlRequest = this.url + "/saveorderlocation";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();