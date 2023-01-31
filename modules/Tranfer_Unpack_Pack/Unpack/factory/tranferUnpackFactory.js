(function () {
    'use strict';
    app.factory("tranferUnpackFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                urlTransfer: webServiceAPI.GT + "TransferUnpack",
                urlGoodIssue: webServiceAPI.GI + "GoodIssue",
                urlGoodsReceive: webServiceAPI.GR + "goodsReceive",
                urlBinbalance: webServiceAPI.BinBalance + "PickBinbalance",
                urlDropdown: webServiceAPI.GR + "DropdownGoodsReceive",
                urlLPN: webServiceAPI.GR + "LPN",
                urlLPNItem: webServiceAPI.GR + "LPNItem",
                urlPutaway: webServiceAPI.Putaway + "Putaway",
                urlScanReceive: webServiceAPI.GR  + "ScanReceive",
                urlUnback: webServiceAPI.OMSUNPACK  + "UnpackControllers",
                urlTransferStatusLocation: webServiceAPI.GT + "TransferStatusLocation",

                filterTaskUnpack: function (model) {
                    // var urlRequest = this.url + "/filter";
                    var urlRequest = this.urlTransfer + "/FilterGoodsTransferUnPack";
                    return clientService.post(urlRequest, model);
                },
                filterbinbalance_unpack: function (model) {
                    var urlRequest = this.urlBinbalance + "/filterbinbalance_unpack";
                    return clientService.post(urlRequest, model);
                },
                goodsissueHeader: function (model) {
                    var urlRequest = this.urlUnback + "/Unpack";
                    return clientService.post(urlRequest, model);
                },
                scanUPCUnpack: function (model) {
                    var urlRequest = this.urlScanReceive + "/scanUPCUnpack";
                    return clientService.post(urlRequest, model);
                },
                scanLocation: function (model) {
                    var urlRequest = this.urlTransfer + "/ScanLocation" ;
                    return clientService.post(urlRequest, model);
                },




                dropdownProductconversion: function (model) {
                    var urlRequest = this.urlBinbalance + "/dropdownProductconversion";
                    return clientService.post(urlRequest, model);
                },
                dropdownDocumentType: function (model) {
                    var urlRequest = this.urlTransfer + "/dropdownDocumentType";
                    return clientService.post(urlRequest, model);
                },
                
                updateStatusAddData: function (model) {
                    var urlRequest = this.urlGoodIssue + "/updateStatusAddData";
                    return clientService.post(urlRequest, model);
                },
                add: function (model) {
                    var urlRequest = this.urlGoodsReceive + "/Create";
                    return clientService.post(urlRequest, model);
                },
                makeAllGr: function (model) {
                    var urlRequest = this.urlGoodsReceive + "/makeAllGr";
                    return clientService.post(urlRequest, model);
                },
                GoodsReceiveConfirmUnPack: function (model) {
                    var urlRequest = this.urlGoodsReceive + "/GoodsReceiveConfirmUnPack";
                    return clientService.post(urlRequest, model);
                },
                dropdownWeight: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownWeight";
                    return clientService.post(urlRequest, model);
                },
                dropdownItemStatus: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownItemStatus";
                    return clientService.post(urlRequest, model);
                },
                dropdownVolume: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownVolume";
                    return clientService.post(urlRequest, model);
                },
                dropdownProductconversion: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownProductconversion";
                    return clientService.post(urlRequest, model);
                },
                getByGoodReceiveId: function (id) {
                    var urlRequest = this.urlLPN + "/GetByGoodReceiveId" + "/" + id;
                    return clientService.get(urlRequest);
                },
                createTagItems: function (model) {
                    var urlRequest = this.urlLPN+ "/CreateTagItems";
                    return clientService.post(urlRequest, model);
                },
                filterTagItem: function(model) {
                    var urlRequest = this.urlLPNItem + "/FilterTagItem";
                    return clientService.post(urlRequest, model);
                },
                confirmTagItemLocation: function(model) {
                    var urlRequest = this.urlLPNItem + "/ConfirmTagItemLocation";
                    return clientService.post(urlRequest, model);
                },
                // filterTaskunPack: function (model) {
                //     var urlRequest = this.urlPutaway + "/filterTaskunPack";
                //     return clientService.post(urlRequest, model);
                // },
                scanPutaway: function (model) {
                    var urlRequest = this.urlPutaway + "/scanPutaway";
                    return clientService.post(urlRequest, model);
                },
                pickProduct: function (model) {
                    var urlRequest = this.urlGoodIssue + "/pickProduct";
                    return clientService.post(urlRequest, model);
                },
                deletePickProduct: function (model) {
                    var urlRequest = this.urlGoodIssue + "/deletePickProduct";
                    return clientService.post(urlRequest, model);
                },
                
                
                
            }
        });
})();