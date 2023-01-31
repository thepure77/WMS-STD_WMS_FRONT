(function () {
    'use strict';
    app.factory("reportWrongLocationFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
            var getData ;
            return {
                get: clientService.get,
                post: clientService.post,
                // url: webServiceAPI.GT + "Transfer",
                url: webServiceAPI.Report + "ViewStockCartonFlow",
                url1: webServiceAPI.Report + "WrongLocation",

                
                // ExportExcel: function(model) {
                //     var urlRequest = this.url+ "/ExportViewSt";
                //     return clientService.post(urlRequest, model);
                // },

                filterViewWrongLocation: function (model) {
                    var urlRequest = this.url1 + "/filterViewWrongLocation";
                    return clientService.post(urlRequest, model);
                },

                // getLocationType: function (model) {
                //     var urlRequest = this.url+ "/getLocationTypeFlowCa";
                //     return clientService.post(urlRequest, model);
                // },

                // getLocationType: function (model) { filterStockCartonFlow
                //     var urlRequest = this.url1+ "/getLocationType";
                //     return clientService.post(urlRequest, model);
                // },



                setParam: function (model) {
                    getData = model;
                },
                getParam: function () {
                    return getData;
                },   
            }
        });

})();