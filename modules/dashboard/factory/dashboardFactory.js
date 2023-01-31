(function () {
    'use strict';
    app.factory("dashboardFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Dashboard,
                GRGIStat: function (start,end) {
                    var urlRequest = this.url + "GRGIStat/" + start + "/" + end;
                    return clientService.get(urlRequest);
                },
                Utilization: function () {
                    var urlRequest = this.url + "Utilization";
                    return clientService.get(urlRequest);
                },
                ContainerStat: function (start,end) {
                    var urlRequest = this.url + "ContainerStat/" + start + "/" + end;
                    return clientService.get(urlRequest);
                },
                pickProduct: function (model) {
                    var urlRequest = this.url + "/pickProduct";
                    return clientService.post(urlRequest, model);
                },
                deletePickProduct: function (model) {
                    var urlRequest = this.url + "/deletePickProduct";
                    return clientService.post(urlRequest, model);
                },
                runwave: function (model) {
                    var urlRequest = this.url + "/runwave";
                    return clientService.post(urlRequest, model);
                },
                CutSlots: function (model) {
                    var urlRequest = this.url + "/CutSlots";
                    return clientService.post(urlRequest, model);
                },


                dropdownDocumentType: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownDocumentType";
                    return clientService.post(urlRequest, model);
                },
                dropdownDocumentTypeWave: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownDocumentTypeWave";
                    return clientService.post(urlRequest, model);
                },
                dropdownStatus: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownStatus";
                    return clientService.post(urlRequest, model);
                },
                PopupGIRunWave: function (model) {
                    var urlRequest = this.url + "/PopupGIRunWave";
                    return clientService.post(urlRequest, model);
                },
                updateStatusAddData: function (model) {
                    var urlRequest = this.url + "/updateStatusAddData";
                    return clientService.post(urlRequest, model);
                },
                confirmStatus: function (model) {
                    var urlRequest = this.url + "/ConfirmStatus";
                    return clientService.post(urlRequest, model);
                },
                deleteDocument: function (model) {
                    var urlRequest = this.url + "/DeleteDocument";
                    return clientService.post(urlRequest, model);
                },
            }
        });
})();
