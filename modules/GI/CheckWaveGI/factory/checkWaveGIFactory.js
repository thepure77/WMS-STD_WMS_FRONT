(function () {
    'use strict';
    app.factory("checkWaveGIFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {
            var getData1;
            var getDataitem;
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GI_Auto + "GoodIssue",
                urlRC: webServiceAPI.Rollcage + "CheckRollcage",
                urlWCS: webServiceAPI.WCS + "Wave",
                
                checkWaveWCS: function (model) {
                    var urlRequest = this.url + "/checkWaveWCS";
                    return clientService.post(urlRequest, model);
                },

                Check_Rollcage_Staging: function (model) {
                    var urlRequest = this.urlRC + "/Check_Rollcage_Staging";
                    return clientService.post(urlRequest, model);
                },

                Get_Wave_WIP: function (model) {
                    var urlRequest = this.urlWCS + "/Get_Wave_WIP";
                    return clientService.post(urlRequest, model);
                },

                Complete_Wave: function (model) {
                    var urlRequest = this.urlWCS + "/UPDATE_WMS_TBL_IF_WMS_WAVE_STATUS_CLOSE";
                    return clientService.post(urlRequest, model);
                }
            }
        });
})();
