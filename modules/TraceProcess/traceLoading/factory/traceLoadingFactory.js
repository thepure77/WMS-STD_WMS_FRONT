(function () {
    'use strict';
    app.factory("traceLoadingFactory",
        function (webServiceAPI, clientService) {
            return {
                get: clientService.get,
                post: clientService.post,
                // url: webServiceAPI.Load + "TruckLoad",
                url: webServiceAPI.Report + "TruckLoad",
                urlAutoComplete: webServiceAPI.Load + "AutoLoad",
                searchFilter: function (model) {
                    var urlRequest = this.url + "/printOutTraceLoading"
                    return clientService.post(urlRequest, model);
                },
                dropdowndock: function (model) {
                    var urlRequest = this.urlAutoComplete + "/dockfilter";
                    return clientService.post(urlRequest, model);
                },
                Rollcagedock: function (model) {
                    var urlRequest = this.urlAutoComplete + "/Rollcagefilter";
                    return clientService.post(urlRequest, model);
                },
                Appointtimefilter: function (model) {
                    var urlRequest = this.urlAutoComplete + "/Appointtimefilter";
                    return clientService.post(urlRequest, model);
                },
                Export: function (model) {
                    var urlRequest = this.url + "/ExcelOutTraceLoading"
                    return clientService.post(urlRequest, model);
                },
                
            }

        });
})();