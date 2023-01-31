/**
 * @license Mr.Dhitipong Hongsawat
 * License: MIT
 */
'use strict'


/**
 * @ngdoc service
 * @name dpMessageBox
 * @description
 *
 * The `dpMessageBox` directeve provides support for common
 * of assistive technologies, such as screen readers.
 *
 *
 * ## Usage
 *
 * Below is a more detailed breakdown of the attributes handled by ngAria:
 * | Parameter              | Description                                                                   |
 * |------------------------|----------------------------------------------------------------------------------------|
 * | ok                     | text,button ok.          |
 * | cancel                 | text,button cancel.      |
 * | title                  | text,titlebar.           |
 * | message                | text,message.            |
 *
 * ##Example
 * Using dpMessageBox with Confirm Event:
 * ConfirmBox    
      dpMessageBox.Confirm({ok:'Yes',cancel:'No',title:'Information',message:'Confirm ?'})
            .then(function ok(){
            
            },function cancel(){
            
            });

* Alert    
      dpMessageBox.Alert({ok:'Yes',title:'Information',message:'Warining !!!'})
            .then(function yes(){
            
            },function close(){
            
            });
 */


app.factory('dpMessageBox', ['$http', '$q', 'dpDialog',
    function ($http, $q, dialog) {
        return {
            confirm: function (param) {
                var deferred = $q.defer();

                //                 var contentArr = [];
                //                 $scope.msg = param.messageNewLine.split(',');

                dialog.confirm({
                    'Ok': param.ok,
                    'Cancel': param.cancel,
                    'Titile': param.title,
                    'Content': param.message,
                    'ContentNewLine': param.messageNewLine,
                    'onOk': function () {
                        $('body').removeClass('modal-open');
                        $('div[uib-modal-backdrop="modal-backdrop"]').remove();
                        $('div[uib-modal-window="modal-window"]').remove();
                        deferred.resolve({ 'action': true });
                    },
                    'onCancel': function () {
                        $('body').removeClass('modal-open');
                        $('div[uib-modal-backdrop="modal-backdrop"]').remove();
                        $('div[uib-modal-window="modal-window"]').remove();
                        deferred.reject({ 'action': false });
                    }
                });
                return deferred.promise;
            },
            alert: function (param) {

                var deferred = $q.defer();
                dialog.alert({
                    'Ok': param.ok,
                    'Cancel': param.cancel,
                    'Titile': param.title,
                    'Content': param.message,
                    'ContentNewLine': param.messageNewLine,
                    'onOk': function () {
                        $('body').removeClass('modal-open');
                        $('div[uib-modal-backdrop="modal-backdrop"]').remove();
                        $('div[uib-modal-window="modal-window"]').remove();
                        deferred.resolve({ 'action': true });
                    },
                    'onCancel': function () {
                        $('body').removeClass('modal-open');
                        $('div[uib-modal-backdrop="modal-backdrop"]').remove();
                        $('div[uib-modal-window="modal-window"]').remove();
                        deferred.reject({ 'action': false });
                    }
                });
                return deferred.promise;
            }
        };
    }
]);


app.service("dpDialog", ['$uibModal', 'ngAuthSettings',
    function ($uibModal, ngAuthSettings) {
        var _title = "";

        var _textYes = "MESSAGE_YES";
        var _textNo = "MESSAGE_NO";


        // param
        // Content = text
        // Ok = text
        // Cancel = text
        // Titile = text 
        // onOk =function
        this.alert = function (param) {
            var okBtn = _textYes;
            var noBtn = _textNo;
            var content = "";
            var contentNewLine = [];
            var callback;
            var noCallback;
            var title;


            if (param.Ok)
                okBtn = param.Ok;
            if (param.Cancel)
                noBtn = param.Cancel;
            if (param.Content)
                content = param.Content;
            if (param.ContentNewLine)
                contentNewLine = param.ContentNewLine;
            if (param.Titile)
                title = param.Titile;
            if (param.onOk)
                callback = param.onOk;
            if (param.onCancel)
                noCallback = param.onCancel;

            ShowAlertWithTitle(callback, content, contentNewLine, okBtn, title, noCallback);
        }

        // param
        // Content = text
        // Ok = text
        // Cancel = text
        // Titile = text 
        // onOk =function
        // onCancel  =function
        this.confirm = function (param) {
            var okBtn = _textYes;
            var noBtn = _textNo;
            var content = "";
            var contentNewLine = [];
            var okCallback;
            var noCallback;
            var title;

            if (param.Ok)
                okBtn = param.Ok;
            if (param.Cancel)
                noBtn = param.Cancel;
            if (param.Content)
                content = param.Content;
            if (param.Titile)
                title = param.Titile;
            if (param.ContentNewLine)
                contentNewLine = param.ContentNewLine;
            if (param.onOk)
                okCallback = param.onOk;
            if (param.onCancel)
                noCallback = param.onCancel;
            ShowConfirmWithTitle(okCallback, noCallback, content, contentNewLine, okBtn, noBtn, title);
        }

        this.MessageBox = function (callback, content, contentNewLine, okBtn, title, onCancel) {

            if (content == undefined)
                content = "";
            if (okBtn == undefined || okBtn == "")
                okBtn = _textYes;
            ShowAlertWithTitle(callback, content, contentNewLine, okBtn, title, onCancel);

        }

        this.ConfirmBox = function (okCallback, content, contentNewLine, okBtn, noBtn, title, noCallback) {
            if (content == undefined)
                content = "";
            if (okBtn == undefined || okBtn == "")
                okBtn = _textYes;
            if (noBtn == undefined || noBtn == "")
                noBtn = _textNo;
            ShowConfirmWithTitle(okCallback, noCallback, content, contentNewLine, okBtn, noBtn, title);
        }

        // Local Function 
        function ShowAlertWithTitle(callback, content, contentNewLine, okBtn, title, onCancel) {
            var windowAnimation = 'animated zoomIn dp-dialog';
            var modalInstance = $uibModal.open({
                animation: true,
                windowClass: windowAnimation,
                backdrop: 'static',
                templateUrl: "assets/dpDialog/contents/template.html",
                controller: ['$scope', '$uibModalInstance', 'ngAuthSettings', function ($scope, $uibModalInstance, ngAuthSettings) {
                    $scope.ClientDirective = ngAuthSettings.ClientDirective;
                    $scope.Items = {};
                    $scope.Config = {};



                    if (title == undefined) {
                        $scope.Config.Title = false;
                    } else {
                        $scope.Config.Title = true;
                    }
                    $scope.Config.Confirm = false;
                    $scope.Config.MessageBox = true;

                    $scope.Items.title = title;
                    $scope.Items.content = content;
                    $scope.Items.contentNewLine = contentNewLine;
                    $scope.Items.Yes = okBtn;

                    $scope.ok = function () {
                        $uibModalInstance.close();
                        if (callback)
                            callback();
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                        if (onCancel)
                            onCancel();
                    };
                }],
                link: function (scope, el, attrs) {

                },
                // size: 'sm',
                resolve: {

                }
            });
        };

        function ShowConfirmWithTitle(okCallback, noCallback, content, contentNewLine, okBtn, noBtn, title) {
            var windowAnimation = 'animated zoomIn dp-dialog';
            var modalInstance = $uibModal.open({
                animation: true,
                windowClass: windowAnimation,
                backdrop: 'static',
                templateUrl: "assets/dpDialog/contents/template.html",

                locals: {

                },
                controller: ['$scope', '$uibModalInstance', 'ngAuthSettings', function ($scope, $uibModalInstance, ngAuthSettings) {
                    $scope.ClientDirective = ngAuthSettings.ClientDirective;

                    $scope.Items = {};
                    $scope.Config = {};

                    if (title == undefined) {
                        $scope.Config.Title = false;
                    } else {
                        $scope.Config.Title = true;
                    }
                    $scope.Config.Confirm = true;
                    $scope.Config.MessageBox = false;

                    $scope.Items.title = title;
                    $scope.Items.content = content;
                    $scope.Items.contentNewLine = contentNewLine;
                    $scope.Items.Yes = okBtn;
                    $scope.Items.No = noBtn;


                    $scope.ok = function () {
                        $uibModalInstance.close();
                        if (okCallback)
                            okCallback();
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                        if (noCallback)
                            noCallback();
                    };
                }],
                link: function (scope, el, attrs) {

                },
                // size: 'sm',
                resolve: {

                }
            });
        };
    }
]);