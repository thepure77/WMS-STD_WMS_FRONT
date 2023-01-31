app.directive("imgUpload", function($http, $compile) {
    return {
        restrict: 'E',
        scope: {
            acModel: '=ngModel',
            method: "@",
            api: '=?',
            result: '=?',
            resultgr: '=?',
            msg: '=?',
        },
        templateUrl: 'widgets/uploadImg/view.html',
        link: function($scope, elem, attrs, dpMessageBox) {
            var formData = new FormData();
            var dpMessageBox = $scope.msg;
            $scope.previewData = $scope.acModel || [];

            function previewFile(file) {
                var reader = new FileReader();
                var obj = new FormData().append('file', file);
                reader.onload = function(data) {
                    var src = data.target.result;
                    var str = data.target.result;
                    var base64 = str.substring(23);
                    var size = ((file.size / (1024 * 1024)) > 1) ? (file.size / (1024 * 1024)) + ' mB' : (file.size / 1024) + ' kB';
                    $scope.$apply(function() {
                        $scope.previewData.push({
                            'name': file.name,
                            'size': size,
                            'type': file.type,
                            'src': src,
                            'data': obj,
                            'base64': base64
                        });
                        $scope.acModel = $scope.previewData;
                    });
                    console.log($scope.previewData);
                }
                reader.readAsDataURL(file);
            }

            function uploadFile(e, type) {
                e.preventDefault();
                var files = "";
                if (type == "formControl") {
                    files = e.target.files;
                } else if (type === "drop") {
                    files = e.originalEvent.dataTransfer.files;
                }
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    if (file.type.indexOf("image") !== -1 && file.type != "image/png") {
                        previewFile(file);
                    } else {
                        alert(file.name + " is not supported");
                    }
                }
            }
            elem.find('.fileUpload').bind('change', function(e) {
                uploadFile(e, 'formControl');
            });

            elem.find('.dropzone').bind("click", function(e) {
                $compile(elem.find('.fileUpload'))($scope).trigger('click');
            });

            elem.find('.dropzone').bind("dragover", function(e) {
                e.preventDefault();
            });

            elem.find('.dropzone').bind("drop", function(e) {
                uploadFile(e, 'drop');
            });
            $scope.upload = function(obj) {
                var Result = obj;
                var apiUrl = $scope.api;
                Result.truckLoad_Index = $scope.result.truckLoad_Index;
                Result.create_By = $scope.result.create_By;
                return $http.post(apiUrl, Result).then(function(response) {
                    if (response.status == 400) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Error',
                            message: response.data.Message
                        })
                    } else {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Success',
                            message: response.data.message
                        })
                        var index = $scope.previewData.indexOf(obj);
                        $scope.previewData.splice(index, 1);
                    }
                });
            }

            $scope.remove = function(data) {
                var index = $scope.previewData.indexOf(data);
                $scope.previewData.splice(index, 1);

                $scope.acModel = $scope.previewData;
            }
        }
    }
});