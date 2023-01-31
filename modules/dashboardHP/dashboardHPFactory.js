(function () {
    'use strict';
    app.factory("dashboardHPFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Dashboard + "GetDateDashboardHP/",
                GetBashboard1: function (date) {
                    var urlRequest = this.url + "GetBashboard1/" + date;
                    return clientService.get(urlRequest);
                },
                GetBashboard2: function (date) {
                    var urlRequest = this.url + "GetBashboard2/" + date;
                    return clientService.get(urlRequest);
                },
                GetBashboard3: function (date) {
                    var urlRequest = this.url + "GetBashboard3/" + date;
                    return clientService.get(urlRequest);
                },
                GetBashboard4: function (date) {
                    var urlRequest = this.url + "GetBashboard4/" + date;
                    return clientService.get(urlRequest);
                },
                GetBashboard5: function (date) {
                    var urlRequest = this.url + "GetBashboard5/" + date;
                    return clientService.get(urlRequest);
                },
                GetBashboard6: function (date) {
                    var urlRequest = this.url + "GetBashboard6/" + date;
                    return clientService.get(urlRequest);
                },
                GetBashboard7: function (date) {
                    var urlRequest = this.url + "GetBashboard7/" + date;
                    return clientService.get(urlRequest);
                },
                GetBashboard8: function (date) {
                    var urlRequest = this.url + "GetBashboard8/" + date;
                    return clientService.get(urlRequest);
                },
                GetBashboard9: function (date) {
                    var urlRequest = this.url + "GetBashboard9/" + date;
                    return clientService.get(urlRequest);
                },
                GetBashboard10: function (date) {
                    var urlRequest = this.url + "GetBashboard10/" + date;
                    return clientService.get(urlRequest);
                },
                GetBashboard11: function (date) {
                    var urlRequest = this.url + "GetBashboard11/" + date;
                    return clientService.get(urlRequest);
                },
                GetBashboard12: function (date) {
                    var urlRequest = this.url + "GetBashboard12/" + date;
                    return clientService.get(urlRequest);
                },
                GetBashboard13: function (date) {
                    var urlRequest = this.url + "GetBashboard13/" + date;
                    return clientService.get(urlRequest);
                },
                GetBashboard14: function (date) {
                    var urlRequest = this.url + "GetBashboard14/" + date;
                    return clientService.get(urlRequest);
                },
                GetBashboard15: function (date) {
                    var urlRequest = this.url + "GetBashboard15/" + date;
                    return clientService.get(urlRequest);
                }
            }
        });
})();
