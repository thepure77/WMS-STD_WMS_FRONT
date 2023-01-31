(function () {
    'use strict';
    app.factory("productConversionFactoryPlanGi",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {

            var getData1 ;

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.PlanGI + "PlanGoodsIssue",

                // getId: function (model) {
                //     debugger
                //     var urlRequest = this.url + "/ProductConversionfilter/" + model;
                //     return clientService.post(urlRequest);
                // },
                getId: function (model) {     
                    var urlRequest = this.url + "/ProductConversionfilter";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();