(function () {
    'use strict';
    app.factory("productConversionFactoryV2",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {

            var data ;

            return {
                get: clientService.get,
                post: clientService.post,
                urlProductConversionBarcode: webServiceAPI.Master + "ProductConversionBarcode",
                url: webServiceAPI.Master + "ProductConversion",
                url2: webServiceAPI.Master_V2 + "ProductConversion",
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
                filterProductConversionBarcode: function (model,model2,stringKey) {
                    var urlRequest = this.urlProductConversionBarcode + "/filterProductConversionBarcode/" + model+"/"+model2+"/"+stringKey;
                    return clientService.get(urlRequest);
                },
                find: function(model) {
                    var urlRequest = this.url + "/find/" + model;
                    return clientService.get(urlRequest);
                },
                SaveChanges: function (model) {
                    var urlRequest = this.url+ "/SaveChangesV2";
                    return clientService.post(urlRequest, model);
                },
                getDelete: function (model) {
                    var urlRequest = this.url+ "/Delete";
                    return clientService.post(urlRequest, model);
                },
                getDeleteProductConversionBarcode: function (model) {
                    var urlRequest = this.urlProductConversionBarcode + "/Delete";
                    return clientService.post(urlRequest, model);
                },
                filterV2: function(model) {
                    var urlRequest = this.url + "/filterV2";
                    return clientService.post(urlRequest, model);
                },
                dropdownVolume: function(model) {
                    var urlRequest = webServiceAPI.Master + "Volume/volumedropdown";
                    return clientService.post(urlRequest, model);
                },
                dropdownWeight: function(model) {
                    var urlRequest = webServiceAPI.Master + "Weight/weightdropdown";
                    return clientService.post(urlRequest, model);
                },
                ExportExcel: function(model) {
                    var urlRequest = this.url2 + "/Export";
                    return clientService.post(urlRequest, model);
                }
                
                
                // filter: function (model) {
                //     var urlRequest = this.url + "/filter";
                //     return clientService.get(urlRequest);
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
                // getIndex: function (model) {
                //     var urlRequest = this.url + "/" + model;
                //     return clientService.post(urlRequest);
                // },
                // setParam: function (model){
                //     getData1 = model;
                // },
                // getParam: function (){
                //     return getData1;
                // },     
                // productConversionPopupSearch: function (model) {
                //     var urlRequest = this.url+ "/productConversionPopupSearch";
                //     return clientService.post(urlRequest, model);
                // },
            }
        });

})();