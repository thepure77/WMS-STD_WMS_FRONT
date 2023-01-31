(function () {
    'use strict';
    app.factory("pickingOrderFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Dashboard + "PickingPerformance",
                pickingPerformanceSearch: function (model) {
                    var urlRequest = this.url + "/PickingPerformanceSearch";
                    return clientService.post(urlRequest, model);
                },

                RoundList: function (model) {
                    var urlRequest = this.url + "/RoundList";
                    return clientService.get(urlRequest);
                },

                pickingPerformanceExpressSearch: function (model) {
                    var urlRequest = this.url + "/PickingPerformanceExpressSearch";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();