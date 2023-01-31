//import '../../assets/img/vwm/rack-bar.png';
var vwModule = angular.module('virtualWarehouseModule', []);

import 'phaser/dist/phaser';
import preview from './preview2/vwpreview';
import manage from './manage/vwmanage';
import topViewRackProperty from './manage/component/topViewRackProperty';
import topViewFloorProperty from './manage/component/topViewFloorProperty';
import topViewLabelProperty from './manage/component/topViewLabelProperty';
import sideViewRackProperty from './manage/component/sideViewRackProperty';
import sideViewFloorProperty from './manage/component/sideViewFloorProperty';
require('./preview2/factory/vw.preview.factory')(vwModule);

require('./manage/factory/vw.manage.top.factory')(vwModule);
require('./manage/factory/vw.manage.factory')(vwModule);

vwModule.component('virtualWarehousePreview', preview());
vwModule.component('virtualWarehouseManage', manage());
vwModule.component('topViewRackProperty', topViewRackProperty());
vwModule.component('topViewFloorProperty', topViewFloorProperty());
vwModule.component('topViewLabelProperty', topViewLabelProperty());
vwModule.component('sideViewRackProperty', sideViewRackProperty());
vwModule.component('sideViewFloorProperty', sideViewFloorProperty());

export default vwModule.name;