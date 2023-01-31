(function () {
    'use strict';
    app.factory("tracePickingFactory",
        function (webServiceAPI, clientService) {
            return {
                get: clientService.get,
                post: clientService.post,
                // url: webServiceAPI.Load + "TruckLoad",
                url: webServiceAPI.Report + "TruckLoad",
                searchFilter: function (model) {
                    var urlRequest = this.url + "/printOutTracePicking"
                    return clientService.post(urlRequest, model);
                },
                ExcelOutTracePick: function (model) {
                    var urlRequest = this.url + "/ExcelOutTracePick"
                    return clientService.post(urlRequest, model);
                },
            }

        });
})();