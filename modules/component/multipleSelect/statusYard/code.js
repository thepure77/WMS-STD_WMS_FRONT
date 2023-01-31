angular.module('ui.multiselect', [])

//from bootstrap-ui typeahead parser
.factory('optionParser', ['$parse', function($parse) {

    //                      00000111000000000000022200000000000000003333333333333330000000000044000
    var TYPEAHEAD_REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+(.*)$/;

    return {
        parse: function(input) {

            var match = input.match(TYPEAHEAD_REGEXP),
                modelMapper, viewMapper, source;
            if (!match) {
                throw new Error(
                    "Expected typeahead specification in form of '_modelValue_ (as _label_)? for _item_ in _collection_'" +
                    " but got '" + input + "'.");
            }

            return {
                itemName: match[3],
                source: $parse(match[4]),
                viewMapper: $parse(match[2] || match[1]),
                modelMapper: $parse(match[1])
            };
        }
    };
}])
'use strict'
app.directive('statusYard', ['$parse', '$document', '$compile', 'optionParser',

    function($parse, $document, $compile, optionParser) {
        return {
            restrict: 'E',
            require: 'ngModel',

            link: function(originalScope, element, attrs, modelCtrl) {
                var exp = attrs.options,
                    parsedResult = optionParser.parse(exp),
                    isMultiple = attrs.multiple == "true" ? true : false,
                    required = false,
                    scope = originalScope.$new(),
                    changeHandler = attrs.change || anguler.noop;

                scope.items = [];
                scope.header = 'Select';
                scope.multiple = isMultiple;
                scope.disabled = false;

                originalScope.$on('$destroy', function() {
                    scope.$destroy();
                });

                var popUpEl = angular.element('<pc-select-multiselect-popup-yard></pc-select-multiselect-popup-yard>');

                //required validator
                if (attrs.required || attrs.ngRequired) {
                    required = true;
                }
                attrs.$observe('required', function(newVal) {
                    required = newVal;
                });

                //watch disabled state
                scope.$watch(function() {
                    return $parse(attrs.disabled)(originalScope);
                }, function(newVal) {
                    scope.disabled = newVal;
                });

                //watch single/multiple state for dynamically change single to multiple
                scope.$watch(function() {
                    return $parse(attrs.multiple)(originalScope);
                }, function(newVal) {
                    isMultiple = newVal || false;
                });

                //watch option changes for options that are populated dynamically
                scope.$watch(function() {
                    return parsedResult.source(originalScope);
                }, function(newVal) {
                    if (angular.isDefined(newVal))
                        parseModel();
                });

                scope.$watch("checked", function() {
                    var string = scope.$eval(attrs.checked);
                    if (string != undefined) {
                        if (Array.isArray(string)) {
                            if (scope.items.length > 0) {
                                scope.items.forEach(c => {
                                    for (var i = 0; i < string.length; i++) {
                                        if (c.label == string[i].name) {
                                            c.checked = true
                                        }
                                    }
                                });
                            }
                        } else {
                            if (scope.items.length > 0) {
                                scope.items.forEach(c => {
                                    if (c.label == string.name) {
                                        scope.header = string.name;
                                        c.checked = true
                                    }
                                });
                            }
                        }
                    }
                });

                //watch model change
                scope.$watch(function() {
                    return modelCtrl.$modelValue;
                }, function(newVal, oldVal) {
                    //when directive initialize, newVal usually undefined. Also, if model value already set in the controller
                    //for preselected list then we need to mark checked in our scope item. But we don't want to do this every time
                    //model changes. We need to do this only if it is done outside directive scope, from controller, for example.
                    if (angular.isDefined(newVal)) {
                        markChecked(newVal);
                        scope.$eval(changeHandler);
                    }
                    getHeaderText();
                    modelCtrl.$setValidity('required', scope.valid());
                }, true);

                function parseModel() {

                    scope.items.length = 0;
                    var model = parsedResult.source(originalScope);
                    for (var i = 0; i < model.length; i++) {
                        var local = {};
                        local[parsedResult.itemName] = model[i];
                        scope.items.push({
                            label: parsedResult.viewMapper(local),
                            model: model[i],
                            checked: false
                        });
                    }
                }

                parseModel();

                element.append($compile(popUpEl)(scope));

                function getHeaderText() {

                    var string = scope.$eval(attrs.checked);
                    var text = "";
                    if (string != undefined) {
                        if (string.name != undefined) {
                            text = string.name;
                        } else if (string.group != undefined) {
                            text = string.group;
                        }
                    }

                    if (!modelCtrl.$modelValue || !modelCtrl.$modelValue.length) return scope.header = text;
                    if (isMultiple) {
                        var header = "";
                        if (modelCtrl.$modelValue.length < 4) {
                            for (var i = 0; i < modelCtrl.$modelValue.length; i++) {
                                if (modelCtrl.$modelValue[i].name != undefined && modelCtrl.$modelValue[i].name != '') {
                                    if (i == 0) {
                                        header = modelCtrl.$modelValue[i].name
                                    } else {
                                        header = header + ' , ' + modelCtrl.$modelValue[i].name
                                    }
                                }
                            }
                            scope.header = header;
                        } else {
                            scope.header = modelCtrl.$modelValue.length + ' ' + 'selected';
                        }
                    } else {
                        var local = {};
                        local[parsedResult.itemName] = modelCtrl.$modelValue;
                        scope.header = parsedResult.viewMapper(local);
                    }
                }

                scope.valid = function validModel() {
                    if (!required) return true;
                    var value = modelCtrl.$modelValue;
                    return (angular.isArray(value) && value.length > 0) || (!angular.isArray(value) && value != null);
                };

                function selectSingle(item) {
                    if (item.checked) {
                        scope.uncheckAll();
                    } else {
                        scope.uncheckAll();
                        item.checked = !item.checked;
                    }
                    setModelValue(false);
                }

                function selectMultiple(item) {
                    item.checked = !item.checked;
                    setModelValue(true);
                }

                function setModelValue(isMultiple) {
                    var value;
                    var string = scope.$eval(attrs.checked);
                    if (isMultiple) {
                        value = [];
                        angular.forEach(scope.items, function(item) {
                            if (item.checked) value.push(item.model);
                        })
                    } else {
                        angular.forEach(scope.items, function(item) {
                            if (item.checked) {
                                value = item.model;
                                return false;
                            }
                        })
                    }
                    // if (string != undefined) {
                    //     if (Array.isArray(string)) {
                    //         for(var i = 0;i < value.length; i++){
                    //             for (var j = 0; j < string.length; j++) {
                    //                 if (value[i].fuel == string[j].fuel) {
                    //                     value[i].fuel = string[i].fuel,
                    //                     value[i].name = string[i].name,
                    //                     value[i].routePrice = string[i].routePrice,
                    //                     value[i].type =string[i].type,
                    //                     value[i].truckType =string[i].truckType,
                    //                     value[i].Quotation = string[i].Quotation,
                    //                     value[i].code =string[i].code
                    //                 }
                    //             }
                    //         }
                    //     }
                    //     modelCtrl.$setViewValue(value);
                    // }else{
                    modelCtrl.$setViewValue(value);
                    // }
                }

                function markChecked(newVal) {
                    if (!angular.isArray(newVal)) {
                        angular.forEach(scope.items, function(item) {
                            if (angular.equals(item.model, newVal)) {
                                item.checked = true;
                                return false;
                            }
                        });
                    } else {
                        angular.forEach(newVal, function(i) {
                            angular.forEach(scope.items, function(item) {
                                if (angular.equals(item.model, i)) {
                                    item.checked = true;
                                }
                            });
                        });
                    }
                }

                scope.checkAll = function() {
                    if (!isMultiple) return;
                    angular.forEach(scope.items, function(item) {
                        item.checked = true;
                    });
                    setModelValue(true);
                };

                scope.checkAllV2 = function() {
                    angular.forEach(scope.items, function(item) {
                        item.checked = !item.checked ? true : false;
                        scope.checkvalue = item.checked
                    });
                    setModelValue(true);
                };

                scope.uncheckAll = function() {
                    angular.forEach(scope.items, function(item) {
                        item.checked = false;
                    });
                    setModelValue(true);
                };

                scope.select = function(item) {
                    if (isMultiple === false) {
                        selectSingle(item);
                        scope.toggleSelect();
                    } else {
                        selectMultiple(item);
                    }
                }
            }
        };
    }
])

.directive('pcSelectMultiselectPopupYard', ['$document', function($document) {
    return {
        restrict: 'E',
        scope: false,
        replace: true,
        templateUrl: 'modules/component/multipleSelect/statusYard/view.html',
        link: function(scope, element, attrs) {

            scope.isVisible = false;

            scope.toggleSelect = function() {
                if (element.hasClass('open')) {
                    element.removeClass('open');
                    $document.unbind('click', clickHandler);
                } else {
                    element.addClass('open');
                    scope.focus();
                    $document.bind('click', clickHandler);
                }
            };

            function clickHandler(event) {
                if (elementMatchesAnyInArray(event.target, element.find(event.target.tagName)))
                    return;
                element.removeClass('open');
                $document.unbind('click', clickHandler);
                scope.$digest();
            }

            scope.focus = function focus() {
                var searchBox = element.find('input')[0];
                searchBox.focus();
            }

            var elementMatchesAnyInArray = function(element, elementArray) {
                for (var i = 0; i < elementArray.length; i++)
                    if (element == elementArray[i])
                        return true;
                return false;
            }
        }
    }
}]);