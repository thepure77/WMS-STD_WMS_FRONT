(function () {
    'use strict';
    app.factory("addPalletFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Palletmanage + "pallets",
                urlDropdown: webServiceAPI.Palletmanage + "Dropdown",
                //url: "http://10.106.159.10/AMZ_WMS_ReportAPI/api/ReportLaborPerformance",

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
                    var urlRequest = this.url+ "/printReportCheckZonePutaway";
                    return clientService.popupReport(urlRequest, model);
                },
                ExportExcel: function (model) {
                    var urlRequest = this.url + "/ExportExcel";
                    return clientService.downloadExcel(urlRequest, model);
                },                
                Filter: function(model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.post(urlRequest, model);
                },
                FilterSum: function() {
                    var urlRequest = this.url + "/FilterSum";
                    return clientService.post(urlRequest);
                },
                dropdownVehicleType: function (model) {
                    var urlRequest = this.urlDropdown + "/vehicleTypedropdown";
                    return clientService.post(urlRequest, model);
                },
                dropdownDocumentType: function (model) {
                    var urlRequest = this.urlDropdown + "/documentTypefilter";
                    return clientService.post(urlRequest, model);
                },
                savepallet: function (model) {
                    var urlRequest = this.url + "/Savepallet";
                    return clientService.post(urlRequest, model);
                }, 
                delete: function (model) {
                    var urlRequest = this.url + "/Deletepallet";
                    return clientService.post(urlRequest, model);
                },
                Printpallet: function (model) {
                    var urlRequest = this.url+ "/printPallet";
                    return clientService.popupReport(urlRequest, model);
                },
                ExportExcel: function (model) {
                    var urlRequest = this.url + "/ExportExcel";
                    return clientService.downloadExcel(urlRequest, model);
                },
            }
        });
})();