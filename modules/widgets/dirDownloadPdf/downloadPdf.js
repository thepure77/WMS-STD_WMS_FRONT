// jQuery needed, uses Bootstrap classes, adjust the path of templateUrl
app.directive('pdfDownload', function () {
    return {
        templateUrl: 'modules/ModuleOms/widgets/dirDownloadPdf/downloadPdf.html',
        scope: {
            pdfUrl: '=ngModel'
        },
        link: function (scope, element, attr) {
        }
    }

});
