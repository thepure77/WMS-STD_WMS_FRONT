(function () {
    'use strict';
    app.factory("emerGencyTruckManifestFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService,logsFactory) {

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Load + "EmergencyTruckmanifest",

               
                filter: function (model){
                    var urlRequest = this.url+ "/filter";
                    return clientService.post(urlRequest, model);
                }, 
                
                printOutTruckMenifest: function (model) {
                    var urlRequest = this.url + "/EmergencyTruckMenifest";
                    return clientService.popupReport(urlRequest, model);
                },
            }
        });

})();