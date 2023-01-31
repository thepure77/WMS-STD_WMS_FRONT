(function () {
    'use strict';
    app.factory("bkYardDockFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {
            var getData;
            var getDefault;
            
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.YardDock + "appointment",
                urlMS: webServiceAPI.Master + "vehicletype",
                urlPO: webServiceAPI.PO + "PurchaseOrder",
                urlPOitem: webServiceAPI.PO + "PurchaseOrderItem",

                getId: function (model) {
                    var urlRequest = this.urlPO + "/findbyYard/" + model;
                    return clientService.get(urlRequest);
                },
                GetByPurchaseOrderItemId: function (id) {
                    var urlRequest = this.urlPOitem + "/GetByPurchaseOrderItemId" + "/" + id;
                    return clientService.get(urlRequest);
                },
                filterVT: function (model) {
                    var urlRequest = this.urlMS + "/filter";
                    return clientService.post(urlRequest, model);
                },
                filter: function (model) {
                    var urlRequest = this.url + "/list";
                    return clientService.post(urlRequest, model);
                },
                getData: function (model) {
                    var urlRequest = this.url + "/get";
                    return clientService.post(urlRequest, model);
                },
                SaveChanges: function (model) {
                    var urlRequest = this.url + "/save";
                    return clientService.post(urlRequest, model);
                },
                getDelete: function (model) {
                    var urlRequest = this.url + "/Delete";
                    return clientService.post(urlRequest, model);
                },
                getApprove: function (model) {
                    var urlRequest = this.url + "/Approve";
                    return clientService.post(urlRequest, model);
                },
                add: function (model) {
                    var urlRequest = this.url;
                    return clientService.post(urlRequest, model);
                },
                FilterWarehouse: function (model) {
                    var urlRequest = this.url+ "/list_warehouse";
                    return clientService.post(urlRequest, model);
                },
                ListDockQouta: function (model){
                    var urlRequest = this.url+ "/list_dockqouta";
                    return clientService.post(urlRequest, model);
                },
                ListDockQoutareassign: function (model){
                    var urlRequest = this.url+ "/list_dockqouta_reAssign";
                    return clientService.post(urlRequest, model);
                },
                ListDockForAppointmentreAssign: function (model){
                    var urlRequest = this.url+ "/ListDockForAppointmentreAssign";
                    return clientService.post(urlRequest, model);
                },
                deleteItems: function (model){
                    var urlRequest = this.url+ "/delete_item";
                    return clientService.post(urlRequest, model);
                },
                getItems: function (model){
                    var urlRequest = this.url+ "/get_item";
                    return clientService.post(urlRequest, model);
                },
                saveItems: function (model){
                    var urlRequest = this.url+ "/save_item";
                    return clientService.post(urlRequest, model);
                },
                SaveAppointment_ReAssign: function (model){
                    var urlRequest = this.url+ "/SaveAppointment_ReAssign";
                    return clientService.post(urlRequest, model);
                },
                PrintOutAppointment: function (model) {
                    var urlRequest = this.url + "/ReportPrintOutAppointment";
                    return clientService.popupReport(urlRequest, model);
                },
                activityType: function (model){
                    var urlRequest = this.url+ "/list_documentType";
                    return clientService.post(urlRequest, model);
                },
                saveDetails: function (model){
                    var urlRequest = this.url+ "/save_detail";
                    return clientService.post(urlRequest, model);
                },
                deleteDetails: function (model){
                    var urlRequest = this.url+ "/delete_detail";
                    return clientService.post(urlRequest, model);
                },
                FilterDock: function (model){
                    var urlRequest = this.url+ "/list_dock";
                    return clientService.post(urlRequest, model);
                },
                ListBlockTime: function (model){
                    var urlRequest = this.url+ "/ListBlockTime";
                    return clientService.post(urlRequest, model);
                },
                setParam: function (model){
                    getData = model;
                },
                
                getParam: function (){
                    return getData;
                },
                
            }
        });

})();