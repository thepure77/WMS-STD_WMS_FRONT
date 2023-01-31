(function () {
    'use strict';
    app.factory("onHandSummaryFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {
            var data
            return {
                get: clientService.get,
                post: clientService.post,
                //url2: webServiceAPI.Master + "onHandSummary",
                url: webServiceAPI.Palletmanage + "onhandsummary",
                urlDropdown: webServiceAPI.Palletmanage + "Dropdown",
                set: function(model) {
                    data = model;
                },
                get: function() {
                   return data
                },
                filter: function (model) {
                    var urlRequest = this.url+"/Filter";
                    return clientService.post(urlRequest, model);
                },                
                Export: function (model) {
                    var urlRequest = this.url+ "/Export";
                    return clientService.post(urlRequest, model);
                },
                dropdownVendor: function (model) {
                    var urlRequest = this.urlDropdown + "/vendordropdown";
                    return clientService.post(urlRequest, model);
                }, 
                ExportReport: function (model) {
                    var urlRequest = this.url + "/ExportExcel";
                    return clientService.downloadExcel(urlRequest, model);
                }   
            }
        });

})();