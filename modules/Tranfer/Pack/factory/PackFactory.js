(function () {
    'use strict';
    app.factory("packFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GR  + "goodsReceive",
                urlScanReceive: webServiceAPI.GR  + "ScanReceive",
                urlDropdown: webServiceAPI.GR + "DropdownGoodsReceive",

                dropdownDocumentType: function (model) {
                    var urlRequest = this.urlScanReceive + "/dropdownDocumentType";
                    return clientService.post(urlRequest, model);
                },
                scanDN: function (model) {
                    var urlRequest = this.urlScanReceive + "/scanDN";
                    return clientService.post(urlRequest, model);
                },
                scanGR: function (model) {
                    var urlRequest = this.urlScanReceive + "/scanGR";
                    return clientService.post(urlRequest, model);
                },
                scanUPC: function (model) {
                    var urlRequest = this.urlScanReceive + "/scanUPC";
                    return clientService.post(urlRequest, model);
                },
                dropdownItemStatus: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownItemStatus";
                    return clientService.post(urlRequest, model);
                },
                dropdownProductconversion: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownProductconversion";
                    return clientService.post(urlRequest, model);
                },
                dropdownVolume: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownVolume";
                    return clientService.post(urlRequest, model);
                },
                saveReceive: function (model) {
                    var urlRequest = this.urlScanReceive + "/saveReceive";
                    return clientService.post(urlRequest, model);
                },
                filterGRItem: function (model) {
                    var urlRequest = this.urlScanReceive + "/filterGRItem";
                    return clientService.post(urlRequest, model);
                },
                deleteItem: function (model) {   
                    var urlRequest = this.urlScanReceive + "/deleteItem";
                    return clientService.post(urlRequest, model);
                },
                
            }
        });

})();