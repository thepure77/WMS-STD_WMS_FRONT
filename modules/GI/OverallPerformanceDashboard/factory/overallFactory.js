(function () {
    'use strict';
    app.factory("overallFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Dashboard + "OverallPerformance",
                overallPerformanceSearch: function (model) {
                    var urlRequest = this.url + "/OverallPerformanceSearch";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();