(function () {
    'use strict';
    app.factory("sendRollcageToStagingFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Rollcage  + "CallFullRollCage",

                checkRollcage: function (model) {
                    var urlRequest = this.url + "/checkRollcage" ;
                    return clientService.post(urlRequest, model);
                },
                movePallet: function (model) {
                    var urlRequest = this.url + "/movestaging" ;
                    return clientService.post(urlRequest, model);
                },
                scanEmptyLocation: function (model) {
                    var urlRequest = this.url + "/scanEmptyLocation_staging" ;
                    return clientService.post(urlRequest, model);
                },
                
            }
        });

})();   