(function () {
    'use strict';
    app.factory("productFactoryV2",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
            var data
            return {
                get: clientService.get,
                post: clientService.post,
                urlmaster:  webServiceAPI.Master,
                url: webServiceAPI.Master + "Product",
                url2: webServiceAPI.Master_V2 + "Product",
                set: function(model) {
                    data = model;
                },
                get: function() {
                   return data
                },
                filter: function(model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.post(urlRequest, model);
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
                Export: function (model) {
                    var urlRequest = this.url2+ "/Export";
                    return clientService.post(urlRequest, model);
                },   
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
                // popupSearch: function (model) {
                //     var urlRequest = this.url+ "/popupSearch";
                //     return clientService.post(urlRequest, model);
                // },
                dropdownbusinessUnit: function (model) {
                    var urlRequest = this.urlmaster + "BusinessUnit/filter";
                    return clientService.post(urlRequest, model);
                },

                dropdownMasterType: function (model) {
                    var urlRequest = this.urlmaster + "MasterType/filter";
                    return clientService.post(urlRequest, model);
                },

                dropdownTempCondition: function (model) {
                    var urlRequest = this.urlmaster + "TempCondition/filter";
                    return clientService.post(urlRequest, model);
                },

                dropdownFireClass: function (model) {
                    var urlRequest = this.urlmaster + "FireClass/filter";
                    return clientService.post(urlRequest, model);
                },

                dropdownMaterialClass: function (model) {
                    var urlRequest = this.urlmaster + "MaterialClass/filter";
                    return clientService.post(urlRequest, model);
                },

                dropdownMovingCondition: function (model) {
                    var urlRequest = this.urlmaster + "MovingCondition/filter";
                    return clientService.post(urlRequest, model);
                },

                dropdownProductHierarchy5: function (model) {
                    var urlRequest = this.urlmaster + "ProductHierarchy5/filter";
                    return clientService.post(urlRequest, model);
                },

                dropdownProductCategory: function (model) {
                    var urlRequest = this.urlmaster + "ProductCategory/filter";
                    return clientService.post(urlRequest, model);
                },

                dropdowntypeProduct: function(model){
                    var urlRequest = this.urlmaster + "TypeProduct/filter";
                    return clientService.post(urlRequest, model);
                }
            }
        });

})();