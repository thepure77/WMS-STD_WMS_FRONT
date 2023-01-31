(function () {
    'use strict';
    app.factory("report8Factory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Report + "Report8",
                urldropdown: webServiceAPI.GT + "Transfer",
                urldropdown2: webServiceAPI.Report + "DropdownReport",
                gettest: function (model) {
                    var urlRequest = this.url + "/gettest";
                    return clientService.post(urlRequest, model);
                },
                get: function (model) {
                    var urlRequest = this.url + "/get2";
                    return clientService.post(urlRequest, model);
                },
                root: function (model) {
                    var urlRequest = this.url + "/root";
                    return clientService.post(urlRequest, model);
                },
                PrintReport: function (model) {
                    var urlRequest = this.url+ "/PrintReport8";
                    return clientService.popupReport(urlRequest, model);
                },
                ExportExcel: function (model) {
                    var urlRequest = this.url + "/ExportExcel";
                    return clientService.downloadExcel(urlRequest, model);
                },
                dropdownDocumentType: function (model) {
                    var urlRequest = this.urldropdown + "/dropdownDocumentType";
                    return clientService.post(urlRequest, model);
                },
                dropdownLocationType: function (model) {
                    var urlRequest = this.urldropdown2 + "/dropdownLocationType";
                    return clientService.post(urlRequest, model);
                },
            }
        });
})();