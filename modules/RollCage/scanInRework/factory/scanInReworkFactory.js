(function () {
    'use strict';
    app.factory("scanInReworkFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Rollcage + "RollCage",

                scanRollCageScanIn: function (model) {
                    var urlRequest = this.url + "/findRollCageScanIn";
                    return clientService.post(urlRequest, model);
                },
                scanRollCageActiveEmptyChute: function (model) {
                    var urlRequest = this.url + "/findRollCageActiveEmptyChute";
                    return clientService.post(urlRequest, model);
                },
                scanRollCageActiveReworkChute: function (model) {
                    var urlRequest = this.url + "/findRollCageActiveReworkChute";
                    return clientService.post(urlRequest, model);
                },
                isActiveRollCage: function (model) {
                    var urlRequest = this.url + "/updateActiveRollCage";
                    return clientService.post(urlRequest, model);
                },
                scanQRCode: function (model) {
                    var urlRequest = this.url + "/findQRCodeGoodsIssueTruckload";
                    return clientService.post(urlRequest, model);
                },
                scanQRCodeOrder: function (model) {
                    var urlRequest = this.url + "/scanQRCodeOrder";
                    return clientService.post(urlRequest, model);
                },
                // insertOrder: function (model) {
                //     var urlRequest = this.url + "/insertOrderAndUpdateTagOut";
                //     return clientService.post(urlRequest, model);
                // },
                rebindScanSummary: function (model) {
                    var urlRequest = this.url + "/findScanSummary";
                    return clientService.post(urlRequest, model);
                },
                findScanSummary: function (model) {
                    var urlRequest = this.url + "/findQRScanSummary";
                    return clientService.post(urlRequest, model);
                },
                findQRCodeDataTruckload: function (model) {
                    var urlRequest = this.url + "/findQRCodeDataTruckload";
                    return clientService.post(urlRequest, model);
                },

            }
        });

})();