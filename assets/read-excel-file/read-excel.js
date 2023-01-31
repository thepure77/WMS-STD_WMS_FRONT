'use strict'
app.directive("readExcel", function () {
    return {
        require: 'ngModel',
        scope: { ngModel: "=" },
        link: function (scope, element, attrs, ngModelCtrl) {

            var X = XLSX;

            // get actibutes id
            var drop = element[0].id;

            function fixdata(data) {
                var o = "", l = 0, w = 10240;
                for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
                o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
                return o;
            }

            function to_json(workbook) {
                var result = {};
                workbook.SheetNames.forEach(function (sheetName) {
                    var roa = X.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                    if (roa.length > 0) {
                        result[sheetName] = roa;
                    }
                });

                return result;
            }

            function process_wb(wb) {
                var output = JSON.stringify(to_json(wb), 2, 2);

                // set data into model
                ngModelCtrl.$modelValue = output;
                scope.ngModel = output;
            }

            // handle drop event
            function handleDrop(e) {
                e.stopPropagation();
                e.preventDefault();


                var files = e.dataTransfer.files;
                var f = files[0];
                {
                    var reader = new FileReader();
                    var name = f.name;
                    reader.onload = function (e) {
                        var data = e.target.result;

                        var arr = fixdata(data);

                        wb = X.read(btoa(arr), { type: 'base64' });

                        process_wb(wb);
                    };

                    reader.readAsArrayBuffer(f);
                }
            }


            // handle drop dragover
            function handleDragover(e) {
                e.stopPropagation();
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
            }

            element.bind('drop', function (e) {
                e.preventDefault();
                console.log(event.dataTransfer.files[0]);
                var f = event.dataTransfer.files[0];
                e.stopPropagation();

                {
                    var reader = new FileReader();
                    var name = f.name;
                    reader.onload = function (e) {
                        var data = e.target.result;

                        var arr = fixdata(data);

                        wb = X.read(btoa(arr), { type: 'base64' });

                        process_wb(wb);
                    };

                    reader.readAsArrayBuffer(f);
                }
            });

            element.bind('click', function (e) {
                console.log('click');
            });

        }
    }
})
