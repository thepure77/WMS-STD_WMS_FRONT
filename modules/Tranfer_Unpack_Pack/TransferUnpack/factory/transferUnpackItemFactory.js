app.factory("transferUnpackItemFactory", function (webServiceAPI, clientService) {
    return {
        get: clientService.get,
        post: clientService.post,
        url: webServiceAPI.GT + "TransferItem",
        urlMaster: webServiceAPI.Master,
        urlBinBalance: webServiceAPI.BinBalance,

        getGoodsTransferItem: function (model,ischkQI = false) {
            var urlRequest = this.url + "/getGoodsTransferItem" + "/" + model+"/"+ischkQI;
            return clientService.get(urlRequest);
        },
        addNewLocation: function (model) {
            var urlRequest = this.url+ "/addNewLocation";
            return clientService.post(urlRequest, model);
        },
        checkLocation: function (model) {
            var urlRequest = this.urlBinBalance + "Binbalance/checkLocation";
            return clientService.post(urlRequest, model);
        },
    }
});