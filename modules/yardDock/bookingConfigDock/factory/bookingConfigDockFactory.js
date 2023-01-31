(function () {
    'use strict';
    app.factory("bookingConfignDockFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {
            var data
            return {
                get: clientService.get,
                post: clientService.post,
                // url: webServiceAPI.Master + "WorkArea",
                url: webServiceAPI.YardDock + "dockQouta",
                set: function (model) {
                    data = model;
                },
                get: function () {
                    return data
                },
                
                filter: function (model) {
                    var urlRequest = this.url + "/list";
                    return clientService.post(urlRequest, model);
                },
                SaveChanges: function (model) {
                    var urlRequest = this.url + "/save";
                    return clientService.post(urlRequest, model);
                },
                getDelete: function (model) {
                    var urlRequest = this.url + "/Delete";
                    return clientService.post(urlRequest, model);
                },
                find: function (model) {
                    var urlRequest = this.url + "/get";
                    return clientService.post(urlRequest, model);
                },
                FilterIntervalTime: function (model) {
                    var urlRequest = this.url + "/list_interval";
                    return clientService.post(urlRequest, model);
                },
                FilterDock: function (model) {
                    var urlRequest = this.url + "/list_dock";
                    return clientService.post(urlRequest, model);
                },
                FilterWarehouse: function (model) {
                    var urlRequest = this.url + "/list_warehouse";
                    return clientService.post(urlRequest, model);
                },
                FilterDock_search: function (model) {
                    var urlRequest = this.url + "/list_dock_search";
                    return clientService.post(urlRequest, model);
                }
                
            }
        });

})();