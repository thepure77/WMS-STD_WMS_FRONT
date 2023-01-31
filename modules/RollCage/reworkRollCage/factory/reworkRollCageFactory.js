(function () {
    'use strict';
    app.factory("reworkRollCageFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
            var getData1;
            var getDefault;
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Rollcage  + "ReworkRollCage",

                setParam: function (model) {
                    getData1 = model;
                },
                getParam: function () {
                    return getData1;
                },
                scanLocation: function (model) {
                    var urlRequest = this.url + "/ScanLocation" ;
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
                
            }
        });

})();   