(function () {
    'use strict';
    app.factory("sendRollcageFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Rollcage + "RollCage",
                urlMaster: webServiceAPI.Master + "Location",

                scanRollCage: function (model) {
                    var urlRequest = this.url + "/findRollCage";
                    return clientService.post(urlRequest, model);
                },

                scanRollCageBUF: function (model) {
                    var urlRequest = this.url + "/findRollCageBUF";
                    return clientService.post(urlRequest, model);
                },
                // scanRollCageScanIn: function (model) {
                //     var urlRequest = this.url + "/findRollCageScanIn";
                //     return clientService.post(urlRequest, model);
                // },
                scanRollCageActiveEmptyChute: function (model) {
                    var urlRequest = this.url + "/findRollCageActiveEmptyChute";
                    return clientService.post(urlRequest, model);
                },
                scanLocation: function (model) {
                    var urlRequest = this.url + "/findFullChute";
                    return clientService.post(urlRequest, model);
                },
                checkLocation: function (model) {
                    var urlRequest = this.urlMaster + "/GetLocationV2" ;
                    return clientService.post(urlRequest, model);
                },
                suggestionStagingArea: function (model) {
                    var urlRequest = this.url + "/findSuggestionStagingArea";
                    return clientService.post(urlRequest, model);
                },
                // isActiveRollCage: function (model) {
                //     var urlRequest = this.url + "/updateActiveRollCage";
                //     return clientService.post(urlRequest, model);
                // },
                sendToStagingArea: function (model) {
                    //var urlRequest = this.url + "/updateLocationRollCage";
                    var urlRequest = this.url + "/sendRollCageToStaging";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();