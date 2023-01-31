(function () {
    'use strict';
    app.factory("filmCuttingFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Rollcage  + "FilmCutting",


                scantag_no: function (model) {
                    var urlRequest = this.url + "/findtag";
                    return clientService.post(urlRequest, model);
                },
                cuttingPallet: function (model) {
                    var urlRequest = this.url + "/cuttingPallet";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();