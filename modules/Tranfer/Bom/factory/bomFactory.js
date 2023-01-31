(function () {
    'use strict';
    app.factory("bomFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.BOM + "Bom",
                urlTest: webServiceAPI.PlanGR + "DropdownPlanGoodsReceive",

                FilterSearch: function (model){
                    var urlRequest = this.url+ "/filter";
                    return clientService.post(urlRequest, model);
                }, 
                filterPopup: function (model) {  
                    var urlRequest = this.url + "/filterPopup";
                    return clientService.post(urlRequest,model);                    
                },   
                getId: function (model) {
                    var urlRequest = this.url + "/find/" + model;
                    return clientService.get(urlRequest);
                },
                getDelete: function (model) {                    
                    var urlRequest = this.url + "/delete";
                    return clientService.post(urlRequest,model);
                },
                add: function (model) {   
                    var urlRequest = this.url + "/createOrUpdate";
                    return clientService.post(urlRequest, model);
                },
                confirmStatus: function (model) {
                    var urlRequest = this.url + "/confirmStatus";
                    return clientService.post(urlRequest,model);
                },             
                closeDocument: function (model) {    
                                    
                    var urlRequest = this.url + "/closeDocument" + "/";
                    return clientService.post(urlRequest,model);
                },    
                updateUserAssign: function (model) {
                    var urlRequest = this.url+ "/updateUserAssign";
                    return clientService.post(urlRequest, model);
                },        
                deleteUserAssign: function (model) {
                    var urlRequest = this.url + "/deleteUserAssign";
                    return clientService.post(urlRequest, model);
                },
                CheckDocumentStatus: function (model) {
                    var urlRequest = this.url + "/checkDocumentStatus/";
                    return clientService.post(urlRequest, model);
                }, 
                PlanGoodsIssuePopup: function (model) {
                    var urlRequest = this.url + "/popupPlanGoodsIssuefilter";
                    return clientService.post(urlRequest, model);
                },
                dropdownDocumentType: function (model) {
                    var urlRequest = this.url + "/dropdownDocumentType";
                    return clientService.post(urlRequest, model);
                },
                dropdownStatus: function (model) {
                    var urlRequest = this.url + "/dropdownStatus";
                    return clientService.post(urlRequest, model);
                },
                dropdownwarehouse: function (model) {
                    var urlRequest = this.url + "/dropdownwarehouse";
                    return clientService.post(urlRequest, model);
                },
                dropdownProductconversion: function (model) {
                    var urlRequest = this.url + "/dropdownProductconversion";
                    return clientService.post(urlRequest, model);
                },
                dropdownItemStatus: function (model) {
                    var urlRequest = this.url + "/dropdownItemStatus";
                    return clientService.post(urlRequest, model);
                },
                dropdownTypeCar: function (model) {
                    var urlRequest = this.urlTest + "/dropdownTypeCar";
                    return clientService.post(urlRequest, model);
                },
                dropdownRound: function (model) {
                    var urlRequest = this.urlTest + "/dropdownRound";
                    return clientService.post(urlRequest, model);
                },
                dropdownTransport: function (model) {
                    var urlRequest = this.urlTest + "/dropdownTransport";
                    return clientService.post(urlRequest, model);
                },
                dropdownWeight: function (model) {
                    var urlRequest = this.url + "/dropdownWeight";
                    return clientService.post(urlRequest, model);
                },

                dropdownVolume: function (model) {
                    var urlRequest = this.url + "/dropdownVolume";
                    return clientService.post(urlRequest, model);
                },



                PrintBOM: function (model) {
                    var urlRequest = this.url+ "/PrintBOM";
                    return clientService.popupReport(urlRequest, model);
                },


                getItemId: function (model) {
                    var urlRequest = this.url + "/findItem/" + model;
                    return clientService.get(urlRequest);
                },

                
                AutoProductBOMItem: function (model){
                    var urlRequest = this.url+ "/AutoProductBOMItem";
                    return clientService.post(urlRequest, model);
                }, 
                popupBomItemfilter: function (model){
                    var urlRequest = this.url+ "/popupBomItemfilter";
                    return clientService.post(urlRequest, model);
                }, 


                PrintOutBOM: function (model) {
                    var urlRequest = this.url+ "/PrintOutBOM";
                    return clientService.popupReport(urlRequest, model);
                },


            }
        });
})();