(function () {
  "use strict";
  app.component("bkYardDockForm", {
    controllerAs: "$vm",
    templateUrl: function (
      $element,
      $attrs,
      /*ngAuthSettings,*/ $window,
      commonService
    ) {
      return "modules/yardDock/bookingYardDock/component/bkYardDockForm.html";
    },
    bindings: {
      onShow: "=?",
      searchResultModel: "=?",
      filterModel: "=?",
      delegates: "=?",
      invokes: "=?",
      config: "=?",
    },
    controller: function (
      $scope,
      $q,
      $filter,
      $state,
      pageLoading,
      $window,
      dpMessageBox,
      localStorageService,
      masterVehicleTypeFactory,
      bkYardDockFactory,
      webServiceAPI
    ) {
      var $vm = this;
      $scope.getCheck = false;
      $scope.onShow = false;
      var defer = {};
      var viewModel = bkYardDockFactory;
      var viewModelVehicleType = masterVehicleTypeFactory;
      $scope.Cancel = true;
      $scope.update = false;
      $scope.update_By = "";
      $vm.onShow = function (param) {
        defer = $q.defer();
        $scope.onShow = true;
        //Update
        if (param != undefined) {
          pageLoading.show();
          $scope.criteria = {};
          $scope.criteria.appointment_Index = param.appointment_Index;
          $scope.create = true;
          viewModel.getData($scope.criteria).then(function (res) {

            pageLoading.hide();
            $scope.action = "EDIT";
            $scope.dayOfWeek = {};
            $scope.docks = {};
            $scope.fromData = res.data;
            $scope.appointmentItem = res.data.items;
            if ($scope.appointmentItem.length > 0) {
              angular.forEach($scope.appointmentItem, function (value, key) {
                if (value.documentType_Index != undefined) {
                  const _documenttype = $scope.activityModel.filter(
                    (elem) =>
                      elem.documentType_Index == value.documentType_Index
                  );
                  if (_documenttype.length > 0) {
                    value.documentType_Name =
                      _documenttype[0].documentType_Name;
                  }
                }
              });
            }
            $scope.update = true;
            $scope.models.appointment_Date = getToday();
          });
        } else {
          $scope.action = "NEW";
          $scope.update_By = "";
          $scope.update = false;
          $scope.create = true;
          $scope.appointmentItem = [];
          $scope.models.appointment_Date = getToday();
          filterWareHouse();
          $scope.fromData = {};
          $scope.dayOfWeek = {};
          $scope.docks = {};
        }
        return defer.promise;
      };

      function getToday() {
        var today = new Date();

        var mm = today.getMonth() + 1;
        var yyyy = today.getUTCFullYear();
        var dd = today.getDate();

        if (dd < 10) dd = "0" + dd;
        if (mm < 10) mm = "0" + mm;

        return yyyy.toString() + mm.toString() + dd.toString();
      }

      $scope.menu = [
        {
          step: "1",
          active: "active",
          completed: "",
        },
        {
          step: "2",
          active: "",
          completed: "",
        },
        {
          step: "3",
          active: "",
          completed: "",
        },
      ];

      $scope.changeStep = function (index) {
        $scope.step = index;
        $scope.menu.forEach((c) => {
          c.active = "";
          c.completed = "";
        });

        for (var i = 0; i < $scope.menu.length; i++) {
          $scope.menu_width = index * 26;
          if (i <= $scope.step) {
            if (i == $scope.step) {
              $scope.menu[i].active = "active";
              $scope.menu[i].completed = "";
            } else {
              $scope.menu[i].completed = "completed";
              $scope.menu[i].active = "";
            }
          }
        }
      };

      $scope.editItem = function (param) {
        var sentItem = {};
        $scope.itemModels.onShow = !$scope.itemModels.onShow;
        sentItem.appointmentItem_Index = param.appointmentItem_Index;
        $scope.receivefromEdit = param;

        viewModel.getItems(param).then(
          function success(res) {
            debugger
            if (res.data != undefined) {
              angular.forEach($scope.appointmentItem, function (value, key) {
                if (
                  value.appointmentItem_Index == res.data.appointmentItem_Index
                ) {
                  value.details = res.data.details;
                }
              });

              if ($scope.itemModels.delegates.set) {
                var model = {};
                model = res.data;
                model.status_h = $scope.fromData.document_status
                model.action = "EDIT";
                model.vehecleType = $scope.vehicleType;
                $scope.itemModels.delegates.set(model);
              }
            }
          },
          function error(res) { }
        );
      };

      $scope.previous = function () {
        for (var i = 0; i < $scope.menu.length; i++) {
          if ($scope.menu[i].active == "active") {
            $scope.menu[i].active = "";
            $scope.menu[i].completed = "";

            i--;
            $scope.menu[i].active = "active";
            $scope.menu[i].completed = "";
            $scope.menu_name = $scope.menu[i].name;
          }
        }
      };

      $scope.next = function () {
        for (var i = 0; i < $scope.menu.length; i++) {
          if ($scope.menu[i].active == "active") {
            $scope.menu[i].active = "";
            $scope.menu[i].completed = "completed";

            i++;
            $scope.menu[i].active = "active";
            $scope.menu_name = $scope.menu[i].name;
          }
        }
      };

      $scope.saveSuccess = "ํYes"; // status flow not complete
      $scope.previous = function () {
        for (var i = 0; i < $scope.menu.length; i++) {
          if ($scope.menu[i].active == "active") {
            $scope.menu[i].active = "";
            $scope.menu[i].completed = "";

            i--;
            $scope.menu[i].active = "active";
            $scope.menu[i].completed = "";
            $scope.menu_name = $scope.menu[i].name;
          }
        }
      };

      $scope.ProductStock = [];
      $scope.showDocks = false;

      $scope.searchFilter = function () {
        if ($scope.filterWarehouse.model != undefined) {
          $scope.models.wareHouse_Index = $scope.filterWarehouse.model.wareHouse_Index;
        }

        if ($scope.activityModel.model != undefined) {
          $scope.models.documentType_Index = $scope.activityModel.model.documentType_Index;
        }

        if ($scope.dropdownTypeCar.model != undefined) {
          $scope.models.vehicleType_Index = $scope.dropdownTypeCar.model.vehicleType_Index;
        } else {
          $scope.models.vehicleType_Index = undefined;
        }
        var sentData = $scope.models;
        if (sentData.select_Warehouse != undefined) {
          sentData.wareHouse_Index = sentData.select_Warehouse.wareHouse_Index;
        }

        var date = angular.copy(sentData.appointment_Date);
        if (sentData.appointment_Date != null) {

          var ds = convertDateFilter(sentData.appointment_Date);
          sentData.appointment_Date = ds;
        }
        //Validate
        var checkLanguage = checkedlang();
        var messagebox = {};

        if (checkLanguage.name == "TH") {
          messagebox.warehouse = "กรุณาเลือกคลังสินค้า !";
          messagebox.activityModel = "กรุณาเลือกกิจกรรม !";
          messagebox.date = "วันที่ต้องไม่เป็นค่าว่าง !";
          messagebox.alert = "แจ้งเตือน";
        } else {
          messagebox.warehouse = "Please Input Warehouse";
          messagebox.activityModel = "Please Input activity";
          messagebox.date = "Date is not Null !";
          messagebox.alert = "Information";
        }
        if (sentData.wareHouse_Index == undefined || sentData.appointment_Date == "") {
          dpMessageBox.alert({
            ok: "Close",
            title: messagebox.alert,
            message: messagebox.warehouse,
          });
          $scope.models.appointment_Date = getToday();
          return "";
        }
        if (sentData.documentType_Index == undefined) {
          dpMessageBox.alert({
            ok: "Close",
            title: messagebox.alert,
            message: messagebox.activityModel,
          });
          $scope.models.appointment_Date = getToday();
          return "";
        }
        if (
          sentData.appointment_Date == undefined || sentData.appointment_Date == "") {
          dpMessageBox.alert({
            ok: "Close",
            title: messagebox.alert,
            message: messagebox.date,
          });
          $scope.models.appointment_Date = getToday();
          return "";
        }

        pageLoading.show();
        $scope.docks = {};
        viewModel.ListDockQouta(sentData).then(
          function success(res) {
            pageLoading.hide();
            debugger
            if (res.data.length != 0) {
              $scope.showDocks = true;
              $scope.models.appointment_Date = date;
              angular.forEach(res.data, function (value, key) {

                let appDate = value.appointment_Date;
                var d = value.appointment_Date;
                var month = d.substr(5, 2);
                var day = d.substr(8, 2);
                let _getDay = getDays(value.appointment_Date);
                let _getMonth = getMonth(value.appointment_Date);
                value.appointment_Date =
                  _getDay + "." + " " + day + " " + _getMonth;
                var _appDate = formatDate(appDate);
                value.appointDate = _appDate;

                angular.forEach(value.items, function (valueitem, key2) {
                  if (valueitem.seq == undefined) {
                    var TimeOn = valueitem.times;
                    const resultsTimeOn = TimeOn.filter((TimeOn) => {
                      return TimeOn.time_Start == valueitem.time;
                    });
                    valueitem.seq_S = resultsTimeOn[0];

                    var TimeEnd = valueitem.times;
                    const resultsTimeEnd = TimeEnd.filter((TimeEnd) => {
                      return TimeEnd.time_End == valueitem.time_End;
                    });
                    valueitem.seq_E = resultsTimeEnd[0];
                  }

                  var intervalTimeOn = valueitem.times;
                  const resultsIntervalTimeOn = intervalTimeOn.filter(
                    (intervalTimeOn) => {
                      return intervalTimeOn.seq >= valueitem.seq_S.seq;
                    }
                  );

                  valueitem.times = resultsIntervalTimeOn;

                  var intervalTimeEnd = valueitem.times;
                  const resultsIntervalTimeEnd = intervalTimeEnd.filter(
                    (intervalTimeEnd) => {
                      return intervalTimeEnd.seq <= valueitem.seq_E.seq;
                    }
                  );
                  valueitem.times = resultsIntervalTimeEnd;
                });

              });

              var filterdate = res.data;
              const resultsfilterdate = filterdate.filter(
                (filterdate) => {
                  return filterdate.items.length != 0;
                }
              );
              if (resultsfilterdate.length == 0) {
                dpMessageBox.alert({
                  ok: "Close",
                  title: "error",
                  message: "ไม่พบข้อมูล",
                });
              }

              $scope.dayOfWeek = res.data;
            }
          },
          function error(param) {
            dpMessageBox.alert({
              ok: "Close",
              title: "error",
              message: param.Message.Message,
            });
            $scope.models.appointment_Date = getToday();
          }
        );
      };

      $scope.saveSelectDate = {};
      $scope.checkEnable = [];
      $scope.setTempItem = function (param) {
        $scope.docks = param.items;
        $scope.getReceive = param;
        $scope.appointmentDate = param.appointDate;
        $scope.wareHouseList = {};
        $scope.wareHouseList.wareHouse_Id = param.wareHouse_Id;
        $scope.wareHouseList.wareHouse_Index = param.wareHouse_Index;
        $scope.wareHouseList.wareHouse_Name = param.wareHouse_Name;

        if ($scope.appointmentItem != undefined) {
          // case edit
          if ($scope.appointmentItem.length > 0) {
            angular.forEach($scope.appointmentItem, function (value, key) {
              const _findDay = $scope.dayOfWeek.find(
                (elem) => elem.appointDate == param.appointDate
              );
              const _findDock = _findDay.items.find(
                (elem) => elem.dock_Index == value.dock_Index
              );
              if (_findDock != undefined) {
                for (let r = 0; r < _findDock.times.length; r++) {
                  if (
                    _findDock.times[r].dockQoutaInterval_Index ==
                    value.dockQoutaInterval_Index
                  ) {
                    if ($scope.action != "EDIT") {
                      var checkAction = formatDate(value.appointment_Date);
                      if (checkAction == "NaNNaNNaN") {
                        var date = convertDateFilter(value.appointment_Date);
                        value.appointment_Date = date;
                      } else {
                        var format = formatDate(value.appointment_Date);
                        var date = convertDateFilter(format);
                        value.appointment_Date = date;
                      }
                      _findDock.times[r].isEnable = false;
                    }
                  }
                }
              }
            });
          } else {
            // case swapDate
            if ($scope.dayOfWeek != null) {
              angular.forEach(param.items, function (value, key) {
                angular.forEach(value.times, function (value2, key2) {
                  if (value2.selected == "checking") {
                    if (value.selected == "checking") {
                      $scope.userSelected[index - key] = {};
                      $scope.userSelected[index - key].datarow = value2;
                      $scope.userSelected[
                        index - key
                      ].datarow.appointment_Date = param.appointmentDate;
                      $scope.userSelected[index - key].datarow.dock_Id =
                        value.dock_Id;
                      $scope.userSelected[index - key].datarow.dock_Index =
                        value.dock_Index;
                      $scope.userSelected[index - key].datarow.dock_Name =
                        value.dock_Name;
                      if (isEnable != false) {
                        value.checked = checked;
                      } else {
                        value.checked = "noCheck";
                      }
                    } else {
                      $scope.userSelected[index] = {};
                      $scope.userSelected[index].datarow = value2;
                      $scope.userSelected[index].datarow.appointment_Date =
                        param.appointmentDate;
                      $scope.userSelected[index].datarow.dock_Id =
                        value.dock_Id;
                      $scope.userSelected[index].datarow.dock_Index =
                        value.dock_Index;
                      $scope.userSelected[index].datarow.dock_Name =
                        value.dock_Name;
                      if (isEnable != false) {
                        value.checked = checked;
                      } else {
                        value.checked = "noCheck";
                      }
                      value.selected = checked;
                    }

                    if ($scope.wareHouseList != undefined) {
                      datarow.wareHouse_Id = $scope.wareHouseList.wareHouse_Id;
                      datarow.wareHouse_Index =
                        $scope.wareHouseList.wareHouse_Index;
                      datarow.wareHouse_Name =
                        $scope.wareHouseList.wareHouse_Name;
                    }
                  }
                });
              });
            }
          }
        }
      };
      $scope.FilterVehicleType = function () {
        pageLoading.show();
        $scope.criteria = {};
        viewModel.filterVT($scope.criteria).then(function (res) {
          pageLoading.hide();
          $scope.vehicleType = res.data.itemsVehicleType;
        });
      };

      $scope.vehicleTypeModel = function () {
        $scope.criteria = {}
        viewModelVehicleType.filter($scope.criteria).then(function (res) {

          $scope.dropdownTypeCar = res.data.itemsVehicleType;
        });
      }


      function filterWareHouse() {
        $scope.criteria = {};

        viewModel.FilterWarehouse($scope.criteria).then(function (res) {
          $scope.filterWarehouse = res.data;
          var filterWarehouse = $scope.filterWarehouse;
          const resultsfilterWarehouse = filterWarehouse.filter((filterWarehouse) => {
            return (
              filterWarehouse.wareHouse_Index == "b0ad4e8f-a7b1-4952-bac7-1a9482baba79"
            );
          });
          $scope.filterWarehouse.model = resultsfilterWarehouse[0];
        });

      }

      function filterDock() {
        $scope.criteria = {};
        viewModel.FilterDock($scope.criteria).then(
          function (res) {
            $scope.dropdownListDocks = res.data;
            $scope.dropdownListDocks.forEach((c) => {
              c.dock_Name = c.dock_Name;
            });
          },
          function error(res) {
            $scope.response = "M_ERROR";
            if (res.Message.data != null) {
              $scope.message = res.Message.data.Message;
            } else {
              $scope.message = "Data not found";
            }
          }
        );
      }
      $scope.itemModels = {
        onShow: false,
        config: {
          title: "Route",
        },
        invokes: {
          set: function (param, indexHeader) { },
          add: function (param) {

            $scope.itemModels.onShow = !$scope.itemModels.onShow;
            $scope.criteria = {};
            $scope.criteria = param;
            $scope.SaveItem($scope.criteria);
          },
        },
      };

      $scope.dropdownYard = {};
      $scope.dropdownFacility = {};

      $scope.triggerSearch = function () {
        pageLoading.show();
        viewModel.filter($scope.filterModel).then(function (res) {
          pageLoading.hide();
          $vm.searchResultModel = res.data.itemsItemStatus;
        });
      };

      $scope.SaveItem = function (param) {
        pageLoading.show();
        if ($scope.update_By != "") {
          param.update_By = $scope.update_By;
        } else {
          param.create_By = localStorageService.get("userTokenStorage");
        }
        param.appointmentItem_Index =
          $scope.receivefromEdit.appointmentItem_Index;

        viewModel.saveItems(param).then(function (res) {
          debugger
          if (!res.data.resultIsUse) {
            dpMessageBox.alert({
              ok: "Close",
              title: "แจ้งเตือน",
              message: res.data.resultMsg,
            });
            return "";
          }
          $scope.criteria.appointment_Time = undefined;
          $scope.criteria.status = undefined;


          viewModel.getData($scope.criteria).then(function (res) {
            pageLoading.hide();
            $scope.dayOfWeek = {};
            $scope.docks = {};
            $scope.fromData = res.data;

            $scope.appointmentItem = res.data.items;

            dpMessageBox.alert({
              ok: "Close",
              title: "messagebox",
              message: "แก้ไขสำเร็จ",
            });

          });
        });
      };

      //Add ข้อมูล
      $scope.SaveAdd = function () {
        debugger
        var model = $scope.fromData;
        $scope.wareHouseList = {};

        if ($scope.dropdownTypeCar.model != undefined) {
          model.vehicleType_Index = $scope.dropdownTypeCar.model.vehicleType_Index;

        }

        model.items = $scope.Items;
        if ($scope.action == "EDIT") {
          model.update_By = localStorageService.get("userTokenStorage");
          model.create_By = "";
        } else {
          model.update_By = "";
          model.create_By = localStorageService.get("userTokenStorage");
        }

        var checkLanguage = checkedlang();
        var messagebox = {};

        if (checkLanguage.name == "TH") {
          messagebox.text = "คุณต้องการบันทึกข้อมูลใช่หรือไม่";
          messagebox.alert = "ไม่สามารถบันทึกได้";
          messagebox.list = "กรุณาเลือกช่วงเวลาก่อนบันทึก";
          messagebox.listmore = "สามารถเลือกได้แค 1 ช่วเวลา";
          messagebox.isgroup = "กรุณาเลือกรายการ";
          messagebox.information = "แจ้งเตือน";
          messagebox.error = "เกิดข้อผิดพลาด";
        } else {
          messagebox.text = "Do you want to Save ?";
          messagebox.alert = "Can not Save !";
          messagebox.list = "Please select Range of Time";
          messagebox.listmore = "Please select 1 Range of Time";
          messagebox.isgroup = "Please select Group";
          messagebox.information = "Information";
          messagebox.error = "Error";
        }
        // Validate
        if (model.items.length <= 0) {
          dpMessageBox.alert({
            ok: "Close",
            title: messagebox.alert,
            message: messagebox.list,
          });

          $scope.models.appointment_Date = getToday();
          return "";
        }

        if ($scope.activityModel.model == undefined) {
          dpMessageBox.alert({
            ok: "Close",
            title: messagebox.alert,
            message: messagebox.list,
          });

          $scope.models.appointment_Date = getToday();
          return "";
        } else {
          model.documentType_Index = $scope.activityModel.model.documentType_Index;
          model.documentType_Id = $scope.activityModel.model.documentType_Id;
          model.documentType_Name = $scope.activityModel.model.documentType_Name;
        }
        model.IsGroup = true;

        dpMessageBox.confirm({
          ok: "Yes",
          cancel: "No",
          title: messagebox.information,
          message: messagebox.text,
        }).then(function () {
          pageLoading.show();
          Add(model).then(
            function success(res) {
              pageLoading.hide();
              if (res.data != undefined) {
                $scope.getBookingAppointment(res.data);
              }
              if (res.data == undefined) {
                dpMessageBox.alert({
                  ok: "Close",
                  title: messagebox.information,
                  message: messagebox.alert,
                });
                $scope.searchFilter();
              }
              $scope.activityModel.model = "";
            },
            function error(param) {
              dpMessageBox.alert({
                ok: "Close",
                title: messagebox.error,
                message: messagebox.alert,
              });
              $scope.back();
            }
          );
        }, function error(param) { $scope.searchFilter(); });
      };
      $scope.back = function () {
        $scope.appointment_No = "";
        $scope.userSelected = [];
        $scope.dtChoose = [];
        $scope.docks = {};
        $scope.models = {};
        defer.resolve("1");
      };

      $scope.clearItem = function () {
        $scope.userSelected = [];
      };

      // Get Appointment No
      $scope.fromData = {};
      $scope.getBookingAppointment = function (param) {
        pageLoading.show();
        $scope.criteria = {};
        $scope.criteria.appointment_Index = param;
        var checkLanguage = checkedlang();
        var messagebox = {};

        if (checkLanguage.name == "TH") {
          messagebox.text = "บันทึกเวลาเสร็จสิ้น";
          messagebox.alert = "แจ้งเตือน";
        } else {
          messagebox.text = "Save Success";
          messagebox.alert = "Information";
        }
        viewModel.getData($scope.criteria).then(function (res) {
          pageLoading.hide();
          $scope.fromData = {};
          $scope.fromData = res.data;
          $scope.appointmentItem = res.data.items;

          dpMessageBox.alert({
            ok: "Close",
            title: messagebox.alert,
            message: messagebox.text,
          });
          return "";
        });
      };

      $scope.userSelected = [];
      $scope.userSelected2 = [];
      $scope.selectItem = function (
        id,
        isEnable,
        index,
        checked,
        datarow,
        items,
        appointmentDate
      ) {
        if ($scope.dayOfWeek != undefined) {
          const findDay = $scope.dayOfWeek.find(
            (elem) => elem.appointDate == appointmentDate
          );
          const findDock = findDay.items.find(
            (elem) => elem.dock_Index == items.dock_Index
          );
          angular.forEach(findDock.times, function (value, key) {
            if (value.dockQoutaInterval_Index == id) {
              $scope.userSelected[index] = {};
              $scope.userSelected[index].datarow = datarow;
              datarow.appointment_Date = appointmentDate;
              datarow.dock_Id = items.dock_Id;
              datarow.dock_Index = items.dock_Index;
              datarow.dock_Name = items.dock_Name;
              if ($scope.wareHouseList != undefined) {
                datarow.wareHouse_Id = $scope.wareHouseList.wareHouse_Id;
                datarow.wareHouse_Index = $scope.wareHouseList.wareHouse_Index;
                datarow.wareHouse_Name = $scope.wareHouseList.wareHouse_Name;
              }
              if (isEnable != false) {
                value.checked = checked;
                value.selected = checked;
              } else {
                value.checked = "noCheck";
              }
            }
          });
        }
      };
      $scope.action = {};
      $scope.selectAC = function (param) {
        if (param != 1 && param != undefined) {
          $scope.fromData.documentType_Id = param.documentType_Id;
          $scope.fromData.documentType_Index = param.documentType_Index;
          $scope.fromData.documentType_Name = param.documentType_Name;
        } else {
          $scope.fromData.documentType_Id = "";
          $scope.fromData.documentType_Index = "";
          $scope.fromData.documentType_Name = "";
        }
      };

      $scope.selectDock = function (param) {
        if (param != null && param != undefined) {
          $scope.models.dock_Id = param.dock_Id;
          $scope.models.dock_Index = param.dock_Index;
          $scope.models.dock_Name = param.dock_Name;
        } else {
          $scope.models.dock_Id = "";
          $scope.models.dock_Index = "";
          $scope.models.dock_Name = "";
        }
      };

      $scope.sentItems = function (param) {
        debugger
        if (param != undefined) {
          $scope.fromData.IsGroup = true;
          $scope.SaveAdd();
        } else {
          if ($scope.Items.length > 0) {
            resetSelect($scope.Items);
          }
          $scope.activityTypes();
        }
      };

      $scope.selectItems = function (param) {
        if (param != null && param != 0) {
        } else {
        }
      };

      function resetSelect(param) {
        angular.forEach($scope.Items, function (value, key) {
          const findDock = $scope.docks.find(
            (elem) => elem.dock_Index == value.dock_Index
          );
          if (findDock != undefined) {
            for (let r = 0; r < findDock.times.length; r++) {
              if (
                findDock.times[r].dockQoutaInterval_Index ==
                value.dockQoutaInterval_Index
              ) {
                findDock.times[r].isEnable = true;
                findDock.times[r].checked = "noCheck";
              }
            }
          }
        });
        for (let index = 0; index < $scope.Items.length; index++) {
          if (
            $scope.Items[index].inserted == 1 &&
            $scope.Items[index].isEnable == true
          ) {
            $scope.Items.splice([index], 1);
            index--;
          }
        }
      }
      $scope.dtChoose = [];

      $scope.chooseItem = function () {
        debugger
        angular.forEach($scope.docks, function (value, key) {
          angular.forEach(value.times, function (value2, key2) {
            if (value2.selected == "checking") {
              var newDatarow = {};
              if ($scope.dtChoose.length <= 0) {
                if (value2.dockQoutaInterval_Index != null) {
                  newDatarow.dockQoutaInterval_Index =
                    value2.dockQoutaInterval_Index;
                  newDatarow.isEnable = value2.isEnable;
                  newDatarow.seq = value2.seq;
                  newDatarow.appointment_Date = value2.appointment_Date;
                  newDatarow.appointment_Time = value2.time;
                  newDatarow.time_End = value2.time_End;
                  newDatarow.time_Start = value2.time_Start;
                  newDatarow.dock_Id = value2.dock_Id;
                  newDatarow.dock_Index = value2.dock_Index;
                  newDatarow.dock_Name = value2.dock_Name;
                  newDatarow.wareHouse_Id = value2.wareHouse_Id;
                  newDatarow.wareHouse_Index = value2.wareHouse_Index;
                  newDatarow.wareHouse_Name = value2.wareHouse_Name;
                }
                newDatarow.inserted = 1;
                newDatarow.tab = 1;
                if ($scope.action == "EDIT") {
                  if ($scope.appointmentItem != undefined) {
                    $scope.appointmentItem.push(newDatarow);
                  }
                } else {
                  $scope.dtChoose.push(newDatarow);
                }
              } else {
                if (
                  $scope.dtChoose.filter(
                    (elem) =>
                      elem.dockQoutaInterval_Index ==
                      value2.dockQoutaInterval_Index && elem.inserted == 1
                  ).length <= 0
                ) {
                  if (
                    value2.dockQoutaInterval_Index != null ||
                    value2.dockQoutaInterval_Index != undefined
                  ) {
                    newDatarow.dockQoutaInterval_Index =
                      value2.dockQoutaInterval_Index;
                    newDatarow.isEnable = value2.isEnable;
                    newDatarow.seq = value2.seq;
                    newDatarow.appointment_Date = value2.appointment_Date;
                    newDatarow.appointment_Time = value2.time;
                    newDatarow.time_End = value2.time_End;
                    newDatarow.time_Start = value2.time_Start;
                    newDatarow.dock_Id = value2.dock_Id;
                    newDatarow.dock_Index = value2.dock_Index;
                    newDatarow.dock_Name = value2.dock_Name;

                    newDatarow.wareHouse_Id = value2.wareHouse_Id;
                    newDatarow.wareHouse_Index = value2.wareHouse_Index;
                    newDatarow.wareHouse_Name = value2.wareHouse_Name;
                  }
                  newDatarow.inserted = 1;
                  newDatarow.tab = 1;
                  if ($scope.action == "EDIT") {
                    if ($scope.appointmentItem != undefined) {
                      $scope.appointmentItem.push(newDatarow);
                    }
                  } else {
                    $scope.dtChoose.push(newDatarow);
                  }
                }
              }
            }
          });
        });
        $scope.Items = {};
        if ($scope.action == "EDIT") {
          $scope.Items = $scope.appointmentItem;
        } else {
          $scope.Items = $scope.dtChoose;
        }

        if ($scope.Items.length > 0) {
          angular.forEach($scope.Items, function (value, key) {
            // มีการสร้างใหม่
            if (value.inserted == 1 && value.isEnable == true) {
              // $scope.userSelected.dockQoutaInterval_Index = value.dockQoutaInterval_Index
              const findDock = $scope.docks.find(
                (elem) => elem.dock_Index == value.dock_Index
              );
              if (findDock != undefined) {
                for (let r = 0; r < findDock.times.length; r++) {
                  if (
                    findDock.times[r].dockQoutaInterval_Index ==
                    value.dockQoutaInterval_Index
                  ) {
                    var date = convertDateFilter(value.appointment_Date);
                    value.appointment_Date = date;
                    findDock.times[r].isEnable = false;
                  }
                }
              } else {
                const _findDay = $scope.dayOfWeek.find(
                  (elem) => elem.appointDate == value.appointment_Date
                );
                const _findDock = _findDay.items.find(
                  (elem) => elem.dock_Index == value.dock_Index
                );
                if (_findDock != undefined) {
                  for (let r = 0; r < _findDock.times.length; r++) {
                    if (
                      _findDock.times[r].dockQoutaInterval_Index ==
                      value.dockQoutaInterval_Index
                    ) {
                      var date = convertDateFilter(value.appointment_Date);
                      value.appointment_Date = date;
                      _findDock.times[r].isEnable = false;
                    }
                  }
                }
              }
            }
            // มีค่าที่มาจากการ Getdata
            else {
              if (
                value.appointmentItem_Index != undefined &&
                value.appointment_Index != undefined
              ) {
                var checkAction = formatDate(value.appointment_Date);
                if (checkAction == "NaNNaNNaN") {
                  var date = convertDateFilter(value.appointment_Date);
                  value.appointment_Date = date;
                } else {
                  var format = formatDate(value.appointment_Date);
                  var date = convertDateFilter(format);
                  value.appointment_Date = date;
                }
              }
            }
          });
        }
        $scope.userSelected = [];
        $scope.dtChoose = [];
        $scope.SaveAdd();
      };

      $scope.deleteItem = function (param) {
        var criteria = {};
        criteria.group_Index = param.group_Index;
        criteria.appointment_Index = param.appointment_Index;
        criteria.appointmentItem_Index = param.appointmentItem_Index;
        criteria.isRemove = true;
        var checkLanguage = checkedlang();
        var messagebox = {};

        if (checkLanguage.name == "TH") {
          messagebox.text = "คุณต้องการลบข้อมูลใช่หรือไม่";
          messagebox.success = "ลบข้อมูลเสร็จสิ้น";
          messagebox.alert = "แจ้งเตือน";
        } else {
          messagebox.text = "Do you want to Delete ?";
          messagebox.success = "Delete Success";
          messagebox.alert = "Information";
        }
        dpMessageBox
          .confirm({
            ok: "Yes",
            cancel: "No",
            title: messagebox.alert,
            message: messagebox.text,
          })
          .then(function () {
            pageLoading.show();
            viewModel.deleteItems(criteria).then(function (res) {
              pageLoading.hide();
              viewModel.getData(criteria).then(function (res) {
                pageLoading.hide();
                $scope.action = "EDIT";
                $scope.dayOfWeek = {};
                $scope.docks = {};
                $scope.fromData = res.data;
                $scope.appointmentItem = res.data.items;
                if ($scope.appointmentItem.length > 0) {
                  angular.forEach($scope.appointmentItem, function (
                    value,
                    key
                  ) {
                    if (value.documentType_Index != undefined) {
                      const _documenttype = $scope.activityModel.filter(
                        (elem) =>
                          elem.documentType_Index == value.documentType_Index
                      );
                      if (_documenttype.length > 0) {
                        value.documentType_Name =
                          _documenttype[0].documentType_Name;
                      }
                    }
                  });
                }
                $scope.update = true;
                $scope.models.appointment_Date = getToday();
              });

              if (res.data == "") {
                dpMessageBox.alert({
                  ok: "Close",
                  title: messagebox.alert,
                  message: messagebox.success,
                });
              }

              criteria.appointment_Date = param.appointment_Date;
              criteria.dock_Index = param.dock_Index;
              criteria.wareHouse_Index = param.wareHouse_Index;
              viewModel.ListDockQouta(criteria).then(function (res1) {
                $scope.docks = [];
                if (res1.data.length != 0) {
                  $scope.showDocks = true;
                  $scope.models.appointment_Date = getToday();
                  angular.forEach(res1.data, function (value, key) {
                    let appDate = value.appointment_Date;
                    var d = value.appointment_Date;
                    var month = d.substr(5, 2);
                    var day = d.substr(8, 2);
                    let _getDay = getDays(value.appointment_Date);
                    let _getMonth = getMonth(value.appointment_Date);
                    value.appointment_Date =
                      _getDay + "." + " " + day + " " + _getMonth;
                    var _appDate = formatDate(appDate);
                    value.appointDate = _appDate;
                  });

                  $scope.dayOfWeek = res1.data;
                }
              });

              viewModel.getData($scope.criteria).then(function (res) {
                pageLoading.hide();
                $scope.dayOfWeek = {};
                $scope.docks = {};
                $scope.fromData = res.data;

                $scope.appointmentItem = res.data.items;
              });
            });
          });
      };

      function Add(param) {
        var deferred = $q.defer();
        viewModel.SaveChanges(param).then(
          function success(results) {
            deferred.resolve(results);
          },
          function error(response) {
            deferred.resolve(response);
          }
        );
        return deferred.promise;
      }

      $scope.buttons = {
        add: true,
        update: false,
        back: true,
      };

      //API AutoComplete
      $scope.url = {
        Master: webServiceAPI.Master,
        PlanGR: webServiceAPI.PlanGR,
      };

      function formatDate(date) {
        var d = new Date(date),
          month = "" + (d.getMonth() + 1),
          day = "" + d.getDate(),
          year = d.getFullYear();

        if (month.length < 2) month = "0" + month;
        if (day.length < 2) day = "0" + day;

        return [year, month, day].join("");
      }

      function FormatNumberLength(num, length) {
        var r = "" + num;
        while (r.length < length) {
          r = "0" + r;
        }
        return r;
      }

      $scope.activityTypes = function () {
        var criteria = {};
        viewModel.activityType(criteria).then(
          function success(res) {
            $scope.activityModel = res.data;
            $scope.activityModel.forEach((c) => {
              c.documentType_Name = c.documentType_Name;
            });
          },
          function error(res) { }
        );
      };

      $scope.selectSort = [
        {
          value: "PlanGoodsReceive_No",
          display: "เลขที่ใบสั่งซื้อสินค้า	",
        },
        {
          value: "PlanGoodsReceive_Date",
          display: "วันที่ใบสั่งซื้อสินค้า	",
        },
        {
          value: "DocumentType_Name",
          display: "ทะเบียนประเภทเอกสาร	",
        },
        {
          value: "ProcessStatus_Name",
          display: "สถานะ",
        },
        {
          value: "Create_By",
          display: "ผู้ใช้งาน",
        },
      ];
      function getDays(date) {
        var d = date;
        var year = d.substr(0, 4);
        var month = d.substr(5, 2);
        var day = d.substr(8, 2);
        var dateFormat = moment(
          year + "-" + FormatNumberLength(month, 2) + "-" + day
        );
        var dayOfWeek = dateFormat.isoWeekday() - 1;
        var weekday = new Array(7);
        weekday[0] = "Mon";
        weekday[1] = "Tue";
        weekday[2] = "Wed";
        weekday[3] = "Thu";
        weekday[4] = "Fri";
        weekday[5] = "Sat";
        weekday[6] = "Sun";

        return weekday[dayOfWeek];
      }

      function getMonth(date) {
        var d = date;
        var year = d.substr(0, 4);
        var month = d.substr(5, 2);
        var day = d.substr(8, 2);
        var dateFormat = moment(
          year + "-" + FormatNumberLength(month, 2) + "-" + day
        );
        var dayOfMonth = dateFormat.month();
        var month = new Array(11);
        month[0] = "Jan.";
        month[1] = "Feb.";
        month[2] = "Mar.";
        month[3] = "Apr.";
        month[4] = "May";
        month[5] = "June";
        month[6] = "July";
        month[7] = "Aug.";
        month[8] = "Sep.";
        month[9] = "Oct.";
        month[10] = "Nov.";
        month[11] = "Dec.";

        return month[dayOfMonth];
      }

      function checkedlang() {
        $scope.switLang = {};
        if ($window.localStorage["LANGUAGE"] == "th") {
          $scope.switLang.name = "TH";
        } else {
          $scope.switLang.name = "EN";
        }
        return $scope.switLang;
      }

      function getTime() {
        var Minute = new Date().getMinutes();
        var Hour = new Date().getHours();
        if (Minute < 10) Minute = "0" + Minute;

        return Hour.toString() + ":" + Minute.toString() + ":00";
      }

      function convertDateFilter(param) {
        var year = param.substring(0, 4);
        var month = param.substring(4, 6);
        var day = param.substring(6, 8);
        var a = year + "-" + month + "-" + day + "T23:59:59Z";
        return a;
      }

      function convertDate(param) {
        var year = param.substring(0, 4);
        var month = param.substring(4, 6);
        var day = param.substring(6, 8);
        month = parseInt(month) - 1;
        var a = new Date(year, month, day);
        return a;
      }

      var init = function () {
        $scope.userName = localStorageService.get("userTokenStorage");
        $scope.models = {};
        $scope.models.time_Start = getTime();
        $scope.models.time_End = getTime();
        $scope.models.appointment_Date = getToday();
        filterWareHouse();
        filterDock();
        $scope.activityTypes();
        $scope.FilterVehicleType();
        $scope.vehicleTypeModel();

      };

      init();
    },
  });
})();
