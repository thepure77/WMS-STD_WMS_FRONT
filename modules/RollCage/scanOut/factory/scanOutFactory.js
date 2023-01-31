(function () {
    'use strict';
    app.factory("scanOutFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Rollcage + "RollCage",


                scanRollCageActiveEmptyChute: function (model) {
                    var urlRequest = this.url + "/findRollCageActiveEmptyChute";
                    return clientService.post(urlRequest, model);
                },
                scanOutQRCode: function (model) {
                    var urlRequest = this.url + "/findQRCodeGoodsIssueTruckloadScanOut";
                    return clientService.post(urlRequest, model);
                },


                // scanRollCageScanIn: function (model) {
                //     var urlRequest = this.url + "/findRollCageScanIn";
                //     return clientService.post(urlRequest, model);
                // },
                // isActiveRollCage: function (model) {
                //     var urlRequest = this.url + "/updateActiveRollCage";
                //     return clientService.post(urlRequest, model);
                // },
                // scanQRCode: function (model) {
                //     var urlRequest = this.url + "/findQRCodeGoodsIssueTruckload";
                //     return clientService.post(urlRequest, model);
                // },
                // // insertOrder: function (model) {
                // //     var urlRequest = this.url + "/insertOrderAndUpdateTagOut";
                // //     return clientService.post(urlRequest, model);
                // // },
                // rebindScanSummary: function (model) {
                //     var urlRequest = this.url + "/findScanSummary";
                //     return clientService.post(urlRequest, model);
                // },

            }
        });

})();