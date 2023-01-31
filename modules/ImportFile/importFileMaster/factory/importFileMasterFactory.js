(function () {
    'use strict';
    app.factory("importFileMasterFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {
            var data
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Interface+ "ImportFileMaster",
                set: function (model) {
                    data = model;
                },
                get: function () {
                    return data
                },
                validateVendor: function (model) {
                    var urlRequest = this.url + "/validateVendor";
                    return clientService.post(urlRequest, model);
                },
                confirmVendor: function (model) {
                    var urlRequest = this.url + "/confirmVendor";
                    return clientService.post(urlRequest, model);
                },
                validateArticle: function (model) {
                    var urlRequest = this.url + "/validateArticle";
                    return clientService.post(urlRequest, model);
                },
                confirmArticle: function (model) {
                    var urlRequest = this.url + "/confirmArticle";
                    return clientService.post(urlRequest, model);
                },
                validateArticleConvertion: function (model) {
                    var urlRequest = this.url + "/validateArticleConvertion";
                    return clientService.post(urlRequest, model);
                },
                confirmArticleConvertion: function (model) {
                    var urlRequest = this.url + "/confirmArticleConvertion";
                    return clientService.post(urlRequest, model);
                },
                validateArticleConvertionBarcode: function (model) {
                    var urlRequest = this.url + "/validateArticleConvertionBarcode";
                    return clientService.post(urlRequest, model);
                },
                confirmArticleConvertionBarcode: function (model) {
                    var urlRequest = this.url + "/confirmArticleConvertionBarcode";
                    return clientService.post(urlRequest, model);
                }
            }
        });

})();