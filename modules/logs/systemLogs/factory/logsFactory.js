(function () {
    'use strict';
    app.factory("logsFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.LogsUser + "Logs",

                SaveLogs: function (model) {
                    var urlRequest = this.url+ "/insertLogs";
                    return clientService.post(urlRequest, model);
                },

                SaveLogsRequest: function (model) {
                    var urlRequest = this.url+ "/insertLogsRequest";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();