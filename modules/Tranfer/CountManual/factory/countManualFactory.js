(function () {
    'use strict';
    app.factory("countManualFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Cyclecount + "CountManual",
                scanLoc: function (model) {                    
                    var urlRequest = this.url + "/scanLoc";
                    return clientService.post(urlRequest, model);
                },
                scanLpn: function (model) {                    
                    var urlRequest = this.url + "/scanLpn";
                    return clientService.post(urlRequest, model);
                },
                SaveCycleCount: function (model) {   
                    var urlRequest = this.url + "/SaveCycleCount";
                    return clientService.post(urlRequest, model);
                },
            }
        });
})();

