(function () {
    'use strict';
    app.factory("productConversionBarcodeFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
            var data
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master + "ProductConversionBarcode",
                url2: webServiceAPI.Master_V2 + "ProductConversionBarcode",
                set: function (model) {
                    data = model;
                },
                get: function () {
                    return data
                },
                filter: function(model) {
                    var urlRequest = this.url2 + "/filter";
                    return clientService.post(urlRequest, model);
                },
                find: function(model) {
                    var urlRequest = this.url + "/find/" + model;
                    return clientService.get(urlRequest);
                },
                SaveChanges: function (model) {
                    var urlRequest = this.url+ "/SaveChanges";
                    return clientService.post(urlRequest, model);
                },
                getDelete: function (model) {
                    var urlRequest = this.url+ "/Delete";
                    return clientService.post(urlRequest, model);
                },
                ExportExcel: function(model) {
                    var urlRequest = this.url2 + "/Export";
                    return clientService.post(urlRequest, model);
                }

                // filter: function (model) {
                //     var urlRequest = this.url;
                //     return clientService.get(urlRequest, model);
                // },
                // getId: function (model) {
                //     var urlRequest = this.url + "/" + model;
                //     return clientService.get(urlRequest);
                // },
                // getDelete: function (model) {
                //     var urlRequest = this.url + "/" + model;
                //     return clientService.delete(urlRequest);
                // },
                // add: function (model) {                        
                //     var urlRequest = this.url;
                //     return clientService.post(urlRequest, model);
                // },
                // edit: function (model) {                        
                //     var urlRequest = this.url;
                //     return clientService.post(urlRequest, model);
                // },
                // search: function (model) {
                //     var urlRequest = this.url+ "/search";
                //     return clientService.post(urlRequest, model);
                // }, 
                // scanBarcode: function (model) {
                //     var urlRequest = this.url + "/ScanBarcode";
                //     return clientService.post(urlRequest, model);
                // },                    
                // scanProductCon: function (model) {
                //     var urlRequest = this.url + "/ScanProductCVBarcode" + "/" + model;
                //     return clientService.post(urlRequest);
                // },    
            }
        });

})();