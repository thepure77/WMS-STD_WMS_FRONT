(function () {
    'use strict';
    app.factory("PickToLightFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GI  + "PickToLight",
                urlWCS: webServiceAPI.WCS  + "ToteController",

                scantag_no: function (model) {
                    var urlRequest = this.url + "/ScantagOutitem";
                    return clientService.post(urlRequest, model);
                },
                scanBarcode_no: function (model) {
                    var urlRequest = this.url + "/scanBarcode_no";
                    return clientService.post(urlRequest, model);
                },
                confirmPicktoLight: function (model) {
                    var urlRequest = this.url + "/confirmPicktoLight";
                    return clientService.post(urlRequest, model);
                },
                DetailScanPicktolight: function (model) {
                    var urlRequest = this.url + "/DetailScanPicktolight";
                    return clientService.post(urlRequest, model);
                },
                Check_Tote: function (model) {
                    var urlRequest = this.urlWCS + "/Check_Tote";
                    return clientService.post(urlRequest, model);
                },
               
            }
        });

})();