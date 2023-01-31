(function () {
    'use strict';
    app.factory("callFullRollCageFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Rollcage  + "CallFullRollCage",

                scanLocation: function (model) {
                    var urlRequest = this.url + "/ScanLocation" ;
                    return clientService.post(urlRequest, model);
                },
                scanEmptyLocation: function (model) {
                    var urlRequest = this.url + "/scanEmptyLocation" ;
                    return clientService.post(urlRequest, model);
                },
                Scanshipment: function (model) {
                    var urlRequest = this.url + "/Scanshipment" ;
                    return clientService.post(urlRequest, model);
                },   
                CallRollCage: function (model) {
                    var urlRequest = this.url + "/CallRollCage" ;
                    return clientService.post(urlRequest, model);
                },
                Scantagout: function (model) {
                    var urlRequest = this.url + "/Scantagout" ;
                    return clientService.post(urlRequest, model);
                },  
                movePallet: function (model) {
                    var urlRequest = this.url + "/movePallet" ;
                    return clientService.post(urlRequest, model);
                },  
                updateActiveRollCageBuff: function (model) {
                    var urlRequest = this.url + "/updateActiveRollCageBuff" ;
                    return clientService.post(urlRequest, model);
                },  
                Check_unscan_out_Rollcage: function (model) {
                    var urlRequest = this.url + "/Check_unscan_out_Rollcage" ;
                    return clientService.post(urlRequest, model);
                },
                checkfromcallfullRollcage: function (model) {
                    var urlRequest = this.url + "/checkfromcallfullRollcage" ;
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();   