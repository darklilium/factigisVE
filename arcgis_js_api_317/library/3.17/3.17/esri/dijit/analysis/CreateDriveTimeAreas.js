// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.17/esri/copyright.txt for details.
//>>built
require({cache:{"url:esri/dijit/analysis/templates/CreateDriveTimeAreas.html":'\x3cdiv class\x3d"esriAnalysis"\x3e\r\n    \x3cdiv data-dojo-type\x3d"dijit/layout/ContentPane" style\x3d"margin-top:0.5em; margin-bottom: 0.5em;"\x3e\r\n      \x3cdiv data-dojo-attach-point\x3d"_hotspotsToolContentTitle" class\x3d"analysisTitle"\x3e\r\n         \x3ctable class\x3d"esriFormTable" \x3e\r\n            \x3ctr\x3e\r\n              \x3ctd class\x3d"esriToolIconTd"\x3e\x3cdiv class\x3d"driveIcon"\x3e\x3c/div\x3e\x3c/td\x3e\r\n              \x3ctd class\x3d"esriAlignLeading esriAnalysisTitle" data-dojo-attach-point\x3d"_toolTitle"\x3e${i18n.createDriveTimeAreas}\x3c/td\x3e\r\n              \x3ctd\x3e\r\n                 \x3cdiv class\x3d"esriFloatTrailing" style\x3d"padding:0;"\x3e\r\n                  \x3cdiv class\x3d"esriFloatLeading"\x3e\r\n                    \x3ca href\x3d"#" class\x3d\'esriFloatLeading helpIcon\' esriHelpTopic\x3d"toolDescription"\x3e\x3c/a\x3e\r\n                  \x3c/div\x3e\r\n                  \x3cdiv class\x3d"esriFloatTrailing"\x3e\r\n                    \x3ca href\x3d"#" data-dojo-attach-point\x3d"_closeBtn" title\x3d"${i18n.close}" class\x3d"esriAnalysisCloseIcon"\x3e\x3c/a\x3e\r\n                  \x3c/div\x3e              \r\n              \x3c/div\x3e  \r\n              \x3c/td\x3e\r\n            \x3c/tr\x3e\r\n         \x3c/table\x3e\r\n      \x3c/div\x3e\r\n      \x3cdiv style\x3d"clear:both; border-bottom: #CCC thin solid; height:1px;width:100%;"\x3e\x3c/div\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv data-dojo-type\x3d"dijit/form/Form" data-dojo-attach-point\x3d"_form" readOnly\x3d"true"\x3e\r\n     \x3ctable class\x3d"esriFormTable"  data-dojo-attach-point\x3d"_driveTimesTable"\x3e\r\n       \x3ctbody\x3e\r\n        \x3ctr data-dojo-attach-point\x3d"_titleRow"\x3e\r\n          \x3ctd colspan\x3d"3" class\x3d"sectionHeader" data-dojo-attach-point\x3d"_driveTimeDescription" \x3e\x3c/td\x3e\r\n        \x3c/tr\x3e\r\n        \x3ctr data-dojo-attach-point\x3d"_analysisLabelRow" style\x3d"display:none;"\x3e\r\n          \x3ctd colspan\x3d"2" style\x3d"padding-bottom:0;"\x3e\r\n            \x3clabel class\x3d"esriFloatLeading  esriTrailingMargin025 esriAnalysisNumberLabel"\x3e${i18n.oneLabel}\x3c/label\x3e\r\n            \x3clabel class\x3d"esriAnalysisStepsLabel"\x3e${i18n.analysisLayerLabel}\x3c/label\x3e\r\n          \x3c/td\x3e\r\n          \x3ctd class\x3d"shortTextInput" style\x3d"padding-bottom:0;"\x3e\r\n            \x3ca href\x3d"#" class\x3d\'esriFloatTrailing helpIcon\' esriHelpTopic\x3d"inputLayer"\x3e\x3c/a\x3e\r\n          \x3c/td\x3e\r\n        \x3c/tr\x3e\r\n        \x3ctr data-dojo-attach-point\x3d"_selectAnalysisRow" style\x3d"display:none;"\x3e\r\n          \x3ctd colspan\x3d"3" style\x3d"padding-top:0;"\x3e\r\n            \x3cselect class\x3d"esriLeadingMargin1 longInput esriLongLabel"  style\x3d"margin-top:1.0em;" data-dojo-type\x3d"dijit/form/Select" data-dojo-attach-point\x3d"_analysisSelect" data-dojo-attach-event\x3d"onChange:_handleAnalysisLayerChange"\x3e\x3c/select\x3e\r\n          \x3c/td\x3e\r\n        \x3c/tr\x3e          \r\n        \x3ctr\x3e\r\n          \x3ctd colspan\x3d"2"\x3e\r\n            \x3clabel data-dojo-attach-point\x3d"_labelOne" class\x3d"esriFloatLeading esriTrailingMargin025 esriAnalysisNumberLabel"\x3e${i18n.oneLabel}\x3c/label\x3e\r\n            \x3clabel data-dojo-attach-point\x3d"_measurelabel" class\x3d"esriAnalysisStepsLabel"\x3e${i18n.measureLabel}\x3c/label\x3e\r\n          \x3c/td\x3e\r\n          \x3ctd class\x3d"shortTextInput"\x3e\r\n            \x3ca href\x3d"#" class\x3d\'esriFloatTrailing helpIcon\' data-dojo-attach-point\x3d"_analysisFieldHelpLink" esriHelpTopic\x3d"MeasurementMethod"\x3e\x3c/a\x3e\r\n          \x3c/td\x3e\r\n        \x3c/tr\x3e\r\n        \x3ctr\x3e\r\n          \x3ctd style\x3d"padding:0.25em;" colspan\x3d"3"\x3e\r\n            \x3cdiv data-dojo-type\x3d"dijit/form/Select" data-dojo-attach-point\x3d"_drivingModeSelect" class\x3d"esriLeadingMargin1 longInput esriLongLabel esriAnalysisDriveMode"\x3e\r\n            \x3c/div\x3e\r\n          \x3c/td\x3e\r\n        \x3c!--\x3ctr\x3e\r\n          \x3ctd style\x3d"padding:0.25em;width:50%"\x3e\r\n            \x3cdiv class\x3d"esriLeadingMargin4 bufferSelector selected" data-dojo-attach-point\x3d"_drivingTime" \x3e\r\n              \x3cdiv class\x3d"bufferIcon esriDrivingTimeIcon"\x3e\x3c/div\x3e\r\n              \x3cdiv\x3e\x3clabel class\x3d"esriFloatLeading esriSelectLabel"\x3e${i18n.drivingTime}\x3c/label\x3e\x3c/div\x3e\r\n            \x3c/div\x3e\r\n          \x3c/td\x3e\r\n          \x3ctd style\x3d"padding:0.25em;width:50%"\x3e\r\n            \x3cdiv class\x3d"bufferSelector" data-dojo-attach-point\x3d"_drivingDistance"\x3e\r\n              \x3cdiv class\x3d"bufferIcon esriDrivingDistanceIcon"\x3e\x3c/div\x3e\r\n              \x3cdiv\x3e\x3clabel class\x3d"esriFloatLeading esriTrailingMargin2 esriSelectLabel"\x3e${i18n.drivingDistance}\x3c/label\x3e\x3c/div\x3e\r\n            \x3c/div\x3e\r\n          \x3c/td\x3e\r\n          \x3ctd\x3e\x3c/td\x3e\r\n        \x3c/tr\x3e--\x3e\r\n        \x3ctr\x3e\r\n          \x3ctd style\x3d"padding-right:0;padding-bottom:0;width:50%;"\x3e\r\n            \x3cinput type\x3d"text" data-dojo-type\x3d"dijit/form/ValidationTextBox" data-dojo-attach-event\x3d"onChange:_handleDistValueChange" data-dojo-props\x3d"intermediateChanges:true,value:\'5\',required:true,missingMessage:\'${i18n.distanceMsg}\'" data-dojo-attach-point\x3d"_breakValuesInput" class\x3d"esriLeadingMargin1"  style\x3d"width:75%;"\x3e\r\n          \x3c/td\x3e\r\n          \x3ctd colspan\x3d"2" style\x3d"padding-left:0.25em;padding-bottom:0;width:50%;"\x3e\r\n            \x3cselect class\x3d"mediumInput esriAnalysisSelect" data-dojo-type\x3d"dijit/form/Select" data-dojo-attach-event\x3d"onChange:_handleDistUnitsChange" data-dojo-attach-point\x3d"_distanceUnitsSelect" style\x3d"width:80%;table-layout:fixed;"\x3e\r\n            \x3c/select\x3e\r\n          \x3c/td\x3e\r\n        \x3c/tr\x3e\r\n        \x3ctr\x3e\r\n          \x3ctd style\x3d"padding:0" colspan\x3d"3"\x3e\r\n            \x3cdiv class\x3d"esriLeadingMargin3"\x3e\r\n              \x3clabel class\x3d"esriSmallLabel"\x3e${i18n.measureHelp}\x3c/label\x3e\r\n            \x3c/div\x3e\r\n          \x3c/td\x3e\r\n        \x3c/tr\x3e\r\n        \x3ctr data-dojo-attach-point\x3d"_useTrafficLabelRow"\x3e\r\n          \x3ctd style\x3d"padding:0" colspan\x3d"3"\x3e\r\n            \x3cdiv style\x3d"width;100%" data-dojo-type\x3d"esri/dijit/analysis/TrafficTime" data-dojo-attach-point\x3d"_trafficTimeWidget"\x3e\x3c/div\x3e\r\n          \x3c/td\x3e\r\n        \x3c/tr\x3e\r\n        \x3ctr\x3e\r\n          \x3ctd colspan\x3d"2"\x3e\r\n            \x3clabel data-dojo-attach-point\x3d"_labelTwo" class\x3d"esriFloatLeading esriTrailingMargin025 esriAnalysisNumberLabel"\x3e${i18n.twoLabel}\x3c/label\x3e\r\n            \x3clabel data-dojo-attach-point\x3d"_arealabel" class\x3d"esriAnalysisStepsLabel"\x3e${i18n.areaLabel}\x3c/label\x3e\r\n          \x3c/td\x3e\r\n          \x3ctd class\x3d"shortTextInput"\x3e\r\n            \x3ca href\x3d"#" class\x3d\'esriFloatTrailing helpIcon\' data-dojo-attach-point\x3d"_analysisFieldHelpLink" esriHelpTopic\x3d"DissolveType"\x3e\x3c/a\x3e\r\n          \x3c/td\x3e\r\n        \x3c/tr\x3e\r\n        \x3ctr\x3e\r\n          \x3ctd style\x3d"padding-top:0;padding-bottom:0;" colspan\x3d"3"\x3e\r\n            \x3ctable style\x3d"width:100%;padding:0.25em;"\x3e\r\n              \x3ctr\x3e\r\n                \x3ctd style\x3d"padding-top:0;"\x3e\r\n                  \x3cdiv style\x3d"width:36px" class\x3d"bufferSelector selected" data-dojo-attach-point\x3d"_Overlap"\x3e\r\n                    \x3cdiv class\x3d"bufferIcon bufferOverlapIcon" style\x3d"margin:5px 10px"\x3e\x3c/div\x3e\r\n                    \x3cdiv style\x3d"width:100%"\x3e\x3clabel class\x3d"esriLeadingMargin025  esriSelectLabel"\x3e${i18n.overlap}\x3c/label\x3e\x3c/div\x3e\r\n                  \x3c/div\x3e\r\n                \x3c/td\x3e\r\n                \x3ctd style\x3d"padding-top:0;"\x3e\r\n                  \x3cdiv style\x3d"width:36px" class\x3d"bufferSelector" data-dojo-attach-point\x3d"_Dissolve"\x3e\r\n                  \x3cdiv class\x3d"bufferIcon bufferDissolveIcon" style\x3d"margin:5px 10px"\x3e\x3c/div\x3e\r\n                  \x3cdiv style\x3d"width:100%"\x3e\x3clabel class\x3d"esriLeadingMargin025  esriSelectLabel"\x3e${i18n.dissolve}\x3c/label\x3e\x3c/div\x3e\r\n                  \x3c/div\x3e\r\n                \x3c/td\x3e\r\n                \x3ctd style\x3d"padding-top:0;"\x3e\r\n                 \x3cdiv style\x3d"width:36px" class\x3d"bufferSelector" data-dojo-attach-point\x3d"_Split"\x3e\r\n                   \x3cdiv class\x3d"bufferIcon esriAnalysisSplitIcon" style\x3d"margin:5px 10px"\x3e\x3c/div\x3e\r\n                   \x3cdiv style\x3d"width:100%"\x3e\x3clabel class\x3d"esriLeadingMargin1  esriSelectLabel"\x3e${i18n.split}\x3c/label\x3e\x3c/div\x3e\r\n                 \x3c/div\x3e\r\n                \x3c/td\x3e        \r\n              \x3c/tr\x3e\r\n            \x3c/table\x3e\r\n          \x3c/td\x3e\r\n        \x3c/tr\x3e\r\n\r\n        \x3ctr\x3e\r\n          \x3ctd colspan\x3d"2"\x3e\r\n            \x3clabel data-dojo-attach-point\x3d"_labelThree" class\x3d"esriFloatLeading esriTrailingMargin025 esriAnalysisNumberLabel"\x3e${i18n.threeLabel}\x3c/label\x3e\r\n            \x3clabel data-dojo-attach-point\x3d"_resultlabel" class\x3d"esriAnalysisStepsLabel"\x3e${i18n.resultLabel}\x3c/label\x3e\r\n          \x3c/td\x3e\r\n          \x3ctd class\x3d"shortTextInput"\x3e\r\n            \x3ca href\x3d"#" class\x3d\'esriFloatTrailing helpIcon\' data-dojo-attach-point\x3d"_analysisFieldHelpLink" esriHelpTopic\x3d"OutputLayer"\x3e\x3c/a\x3e\r\n          \x3c/td\x3e\r\n        \x3c/tr\x3e\r\n        \x3ctr\x3e\r\n          \x3ctd colspan\x3d"3"\x3e\r\n            \x3cinput type\x3d"text" data-dojo-type\x3d"dijit/form/ValidationTextBox" class\x3d"esriLeadingMargin1 esriOutputText" data-dojo-props\x3d"required:true,trim:true" data-dojo-attach-event\x3d"_handleResultLyrInputChange" data-dojo-attach-point\x3d"outputLayerInput"  value\x3d""\x3e\r\n          \x3c/td\x3e\r\n        \x3c/tr\x3e\r\n        \x3ctr\x3e\r\n          \x3ctd colspan\x3d"3"\x3e\r\n             \x3cdiv class\x3d"esriLeadingMargin1" data-dojo-attach-point\x3d"_chooseFolderRow"\x3e\r\n               \x3clabel style\x3d"width:9px;font-size:smaller;"\x3e${i18n.saveResultIn}\x3c/label\x3e\r\n               \x3cinput class\x3d"longInput" data-dojo-attach-point\x3d"_webMapFolderSelect" data-dojo-type\x3d"dijit/form/FilteringSelect" trim\x3d"true" style\x3d"width:60%;"\x3e\x3c/input\x3e\r\n             \x3c/div\x3e              \r\n          \x3c/td\x3e\r\n        \x3c/tr\x3e      \r\n       \x3c/tbody\x3e\r\n      \x3c/table\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv data-dojo-attach-point\x3d"_aggregateToolContentButtons" style\x3d"padding:5px;margin-top:5px;border-top:solid 1px #BBB;"\x3e\r\n      \x3cdiv class\x3d"esriExtentCreditsCtr"\x3e\r\n        \x3ca class\x3d"esriFloatTrailing esriSmallFont"  href\x3d"#" data-dojo-attach-point\x3d"_showCreditsLink" data-dojo-attach-event\x3d"onclick:_handleShowCreditsClick"\x3e${i18n.showCredits}\x3c/a\x3e\r\n       \x3clabel data-dojo-attach-point\x3d"_chooseExtentDiv" class\x3d"esriSelectLabel esriExtentLabel"\x3e\r\n         \x3cinput type\x3d"radio" data-dojo-attach-point\x3d"_useExtentCheck" data-dojo-type\x3d"dijit/form/CheckBox" data-dojo-props\x3d"checked:true" name\x3d"extent" value\x3d"true"/\x3e\r\n           ${i18n.useMapExtent}\r\n       \x3c/label\x3e\r\n      \x3c/div\x3e\r\n      \x3cbutton data-dojo-type\x3d"dijit/form/Button" type\x3d"submit" data-dojo-attach-point\x3d"_saveBtn" class\x3d"esriLeadingMargin4 esriAnalysisSubmitButton" data-dojo-attach-event\x3d"onClick:_handleSaveBtnClick"\x3e\r\n          ${i18n.runAnalysis}\r\n      \x3c/button\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv data-dojo-type\x3d"dijit/Dialog" title\x3d"${i18n.creditTitle}" data-dojo-attach-point\x3d"_usageDialog" style\x3d"width:40em;"\x3e\r\n      \x3cdiv data-dojo-type\x3d"esri/dijit/analysis/CreditEstimator"  data-dojo-attach-point\x3d"_usageForm"\x3e\x3c/div\x3e\r\n    \x3c/div\x3e    \r\n\x3c/div\x3e\r\n'}});
define("esri/dijit/analysis/CreateDriveTimeAreas","require dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/connect dojo/_base/json dojo/has dojo/json dojo/string dojo/dom-style dojo/dom-attr dojo/dom-construct dojo/query dojo/dom-class dojo/number dijit/_WidgetBase dijit/_TemplatedMixin dijit/_WidgetsInTemplateMixin dijit/_OnDijitClickMixin dijit/_FocusMixin dijit/registry dijit/form/Button dijit/form/CheckBox dijit/form/Form dijit/form/Select dijit/form/TextBox dijit/form/ValidationTextBox dijit/layout/ContentPane dijit/form/FilteringSelect ../../kernel ../../lang ./AnalysisBase ./_AnalysisOptions ./CreditEstimator ./utils ./TrafficTime dojo/i18n!../../nls/jsapi dojo/text!./templates/CreateDriveTimeAreas.html".split(" "),
function(r,t,d,k,g,e,u,F,l,q,v,G,H,m,n,w,x,y,z,A,I,J,K,L,M,N,O,P,Q,B,p,C,D,R,f,S,s,E){r=t([w,x,y,z,A,C,D],{declaredClass:"esri.dijit.analysis.CreateDriveTimeAreas",templateString:E,widgetsInTemplate:!0,inputLayer:null,inputType:null,outputLayerName:null,breakValues:null,overlapPolicy:"Overlap",distanceDefaultUnits:"Miles",travelMode:"Driving",i18n:null,toolName:"CreateDriveTimeAreas",helpFileName:"CreateDriveTimeAreas",resultParameter:"DriveTimeAreasLayer",constructor:function(a,b){this._pbConnects=
[];a.containerNode&&(this.container=a.containerNode)},destroy:function(){this.inherited(arguments);k.forEach(this._pbConnects,g.disconnect);delete this._pbConnects},postMixInProperties:function(){this.inherited(arguments);d.mixin(this.i18n,s.bufferTool);d.mixin(this.i18n,s.driveTimes)},postCreate:function(){this.inherited(arguments);m.add(this._form.domNode,"esriSimpleForm");this._breakValuesInput.set("validator",d.hitch(this,this.validateDistance));this.outputLayerInput.set("validator",d.hitch(this,
this.validateServiceName));this.breakValues=[];this.breakValues.push(this._breakValuesInput.get("value"));this._buildUI()},startup:function(){},_onClose:function(a){a&&(this._save(),this.emit("save",{save:!0}));this.emit("close",{save:a})},_toUpperFirstLetter:function(a){return a.slice(0,1).toUpperCase()+a.slice(1)},_handleShowCreditsClick:function(a){a.preventDefault();a={};this._form.validate()&&(a.InputLayer=e.toJson(f.constructAnalysisInputLyrObj(this.inputLayer)),a.BreakValues=e.toJson(this.get("breakValues")),
a.Breakunits=this.get("breakUnits"),a.OverlapPolicy=this.get("overlapPolicy"),this._trafficTimeWidget.get("checked")&&(a.timeOfDay=this._trafficTimeWidget.get("timeOfDay"),"UTC"===this._trafficTimeWidget.get("timeZoneForTimeOfDay")&&(a.timeZoneForTimeOfDay=this._trafficTimeWidget.get("timeZoneForTimeOfDay"))),this.returnFeatureCollection||(a.OutputName=e.toJson({serviceProperties:{name:this.outputLayerInput.get("value")}})),this.showChooseExtent&&this._useExtentCheck.get("checked")&&(a.context=e.toJson({extent:this.map.extent._normalize(!0)})),
this.getCreditsEstimate(this.toolName,a).then(d.hitch(this,function(a){this._usageForm.set("content",a);this._usageDialog.show()})))},_handleSaveBtnClick:function(a){a={};var b={},c;this._form.validate()&&(this._saveBtn.set("disabled",!0),a.InputLayer=e.toJson(f.constructAnalysisInputLyrObj(this.inputLayer)),a.BreakValues=this.get("breakValues"),a.Breakunits=this.get("breakUnits"),a.OverlapPolicy=this.get("overlapPolicy"),c=this._drivingModeSelect.getOptions(this._drivingModeSelect.get("value")),
a.travelMode=c&&e.toJson(c.travelMode),this._trafficTimeWidget.get("checked")&&(a.timeOfDay=this._trafficTimeWidget.get("timeOfDay"),"UTC"===this._trafficTimeWidget.get("timeZoneForTimeOfDay")&&(a.timeZoneForTimeOfDay=this._trafficTimeWidget.get("timeZoneForTimeOfDay"))),this.returnFeatureCollection||(a.OutputName=e.toJson({serviceProperties:{name:this.outputLayerInput.get("value")}})),this.showChooseExtent&&this._useExtentCheck.get("checked")&&(a.context=e.toJson({extent:this.map.extent._normalize(!0)})),
this.returnFeatureCollection&&(c={outSR:this.map.spatialReference},this.showChooseExtent&&this._useExtentCheck.get("checked")&&(c.extent=this.map.extent._normalize(!0)),a.context=e.toJson(c)),b.jobParams=a,b.itemParams={description:l.substitute(this.i18n.itemDescription,{layername:this.inputLayer.name,distance_field:a.Distances||a.Field,units:a.Units}),tags:l.substitute(this.i18n.itemTags,{layername:this.inputLayer.name}),snippet:this.i18n.itemSnippet},this.showSelectFolder&&(b.itemParams.folder=
this.get("folderId")),this.execute(b))},_handleResultLyrInputChange:function(a){this.set("outputLayerName",a)},_handleDistValueChange:function(){this.set("outputLayerName")},_handleDistUnitsChange:function(a){this.set("breakUnits",a);this.set("outputLayerName");this.validateDistance()},_handleDistanceTypeChange:function(a){var b,c;c=this._drivingModeSelect.getOptions(this._drivingModeSelect.get("value"));p.isDefined(c)?(a=c.modei18nKey,b=c.units.toLowerCase(),this.set("travelMode",c.travelMode.name)):
(c=a.split("-"),a=c[0].toLowerCase(),b=c[1]?c[1].toLowerCase():"distance",this.set("travelMode",c[0]));b&&(q.set(this._useTrafficLabelRow,"display","time"===b&&"driving"===a?"":"none"),this._trafficTimeWidget.set("disabled","time"!==b&&"driving"!==a),this._trafficTimeWidget.set("reset","time"!==b&&"driving"!==a));"time"===b?(this._distanceUnitsSelect.removeOption(this._distanceUnitsSelect.getOptions()),this._distanceUnitsSelect.addOption([{value:"Seconds",label:this.i18n.seconds},{value:"Minutes",
label:this.i18n.minutes,selected:"selected"},{value:"Hours",label:this.i18n.hours}]),this.set("breakUnits",this._distanceUnitsSelect.get("value"))):(this.get("distanceDefaultUnits")&&this.set("breakUnits",this.get("distanceDefaultUnits")),this._distanceUnitsSelect.removeOption(this._distanceUnitsSelect.getOptions()),this._distanceUnitsSelect.addOption([{value:"Miles",label:this.i18n.miles},{value:"Yards",label:this.i18n.yards},{value:"Feet",label:this.i18n.feet},{type:"separator"},{value:"Kilometers",
label:this.i18n.kilometers},{value:"Meters",label:this.i18n.meters}]),this._distanceUnitsSelect.set("value",this.breakUnits));this.set("outputLayerName");this.validateDistance()},_handleOverlapPolicyChange:function(a,b){this.set("overlapPolicy",b);m.remove(this._Overlap,"selected");m.remove(this._Dissolve,"selected");m.remove(this._Split,"selected");m.add(a,"selected")},_save:function(){},_buildUI:function(){var a=!0;q.set(this._showCreditsLink,"display",!0===this.showCredits?"block":"none");f.initHelpLinks(this.domNode,
this.showHelp);this.get("showSelectAnalysisLayer")&&(!this.get("inputLayer")&&this.get("inputLayers")&&this.set("inputLayer",this.inputLayers[0]),f.populateAnalysisLayers(this,"inputLayer","inputLayers"));f.addReadyToUseLayerOption(this,[this._analysisSelect]);this.outputLayerName&&(this.outputLayerInput.set("value",this.outputLayerName),a=!1);q.set(this._chooseFolderRow,"display",!0===this.showSelectFolder?"block":"none");this.showSelectFolder&&this.getFolderStore().then(d.hitch(this,function(a){this.folderStore=
a;f.setupFoldersUI({folderStore:this.folderStore,folderId:this.folderId,folderName:this.folderName,folderSelect:this._webMapFolderSelect,username:this.portalUser?this.portalUser.username:""})}));this.distanceDefaultUnits&&this._distanceUnitsSelect.set("value",this.distanceDefaultUnits);q.set(this._chooseExtentDiv,"display",!0===this.showChooseExtent?"inline-block":"none");f.populateTravelModes({selectWidget:this._drivingModeSelect,widget:this,separator:"-",selectDefaultMode:!0});this._handleDistanceTypeChange("Driving-Time");
this.inputLayer&&this._updateAnalysisLayerUI(a);this._loadConnections()},_updateAnalysisLayerUI:function(a){this.inputLayer&&(v.set(this._driveTimeDescription,"innerHTML",l.substitute(this.i18n.toolDefine,{layername:this.inputLayer.name})),a&&this.set("outputLayerName"))},_handleAnalysisLayerChange:function(a){"browse"===a?(a=this._browsedlg.browseItems.get("query"),a.custom=['tags:"point"'],this._browsedlg.browseItems.set("query",a),this._browsedlg.show()):"browselayers"===a?(this.showGeoAnalyticsParams&&
(a=this._browseLyrsdlg.browseItems.get("query"),a.types.push('type:"Big Data File Share"'),this._browseLyrsdlg.browseItems.set("query",a)),this._browseLyrsdlg.browseItems.plugIn.geometryTypes=["esriGeometryPoint"],this._browseLyrsdlg.show()):(this.inputLayer=this.inputLayers[a],this.outputLayerName=null,this._updateAnalysisLayerUI(!0))},_handleBrowseItemsSelect:function(a){a&&a.selection&&f.addAnalysisReadyLayer({item:a.selection,layers:this.inputLayers,layersSelect:this._analysisSelect,browseDialog:this._browsedlg,
widget:this}).always(d.hitch(this,this._updateAnalysisLayerUI,!0))},validateTime:function(){},validateDistance:function(){var a=this,b,c=[],h,e,g;this.set("breakValues");g=f.getMaxInputByMode({type:this._drivingModeSelect.get("value").replace("-",""),units:this._distanceUnitsSelect.get("value")});b=d.trim(this._breakValuesInput.get("value")).split(" ");if(0===b.length)return!1;k.forEach(b,function(b){b=n.parse(b);if(isNaN(b)||b>g)return c.push(0),!1;h=n.format(b,{locale:"root"});p.isDefined(h)?p.isDefined(h)||
(h=n.format(b,{locale:"en-us"})):h=n.format(b,{locale:"en"});p.isDefined(h)&&(e=d.trim(h).match(/\D/g));e&&k.forEach(e,function(b){"."===b||","===b?c.push(1):"-"===b&&"polygon"===a.inputType?c.push(1):c.push(0)})});return-1!==k.indexOf(c,0)?(this._breakValuesInput.focus(),!1):!0},_loadConnections:function(){this.on("start",d.hitch(this,"_onClose",!0));this._connect(this._closeBtn,"onclick",d.hitch(this,"_onClose",!1));g.connect(this._drivingModeSelect,"onChange",d.hitch(this,"_handleDistanceTypeChange"));
g.connect(this._Overlap,"onclick",d.hitch(this,"_handleOverlapPolicyChange",this._Overlap,"Overlap"));g.connect(this._Dissolve,"onclick",d.hitch(this,"_handleOverlapPolicyChange",this._Dissolve,"Dissolve"));g.connect(this._Split,"onclick",d.hitch(this,"_handleOverlapPolicyChange",this._Split,"Split"))},_setAnalysisGpServerAttr:function(a){a&&(this.analysisGpServer=a,this.set("toolServiceUrl",this.analysisGpServer+"/"+this.toolName))},_setInputLayerAttr:function(a){p.isDefined(a)&&"esriGeometryPoint"===
a.geometryType&&(this.inputLayer=a)},_getInputLayerAttr:function(){return this.inputLayer},_setInputLayersAttr:function(a){this.inputLayers=a},_setOverlapPolicyAttr:function(a){this.overlapPolicy=a},_getOverlapPolicyAttr:function(){return this.overlapPolicy},_setBreakValuesAttr:function(a){a&&(this.breakValues=a);a=d.trim(this._breakValuesInput.get("value")).split(" ");var b=[];k.forEach(a,function(a){b.push(n.parse(a))});this.breakValues=b},_getBreakValuesAttr:function(){return this.breakValues},
_setDisableRunAnalysisAttr:function(a){this._saveBtn.set("disabled",a)},_getTravelModeAttr:function(){return this.travelMode},_setTravelModeAttr:function(a){this._set("travelMode",a)},validateServiceName:function(a){return f.validateServiceName(a,{textInput:this.outputLayerInput})},_setBreakUnitsAttr:function(a){this.breakUnits=a},_getBreakUnitsAttr:function(){return this.breakUnits},_setDistanceDefaultUnitsAttr:function(a){this.distanceDefaultUnits=a},_getDistanceDefaultUnitsAttr:function(){return this.distanceDefaultUnits},
_setOutputLayerNameAttr:function(a){var b,c,d;c=[this.i18n.seconds,this.i18n.minutes,this.i18n.hours,this.i18n.miles,this.i18n.meters,this.i18n.kilometers,this.i18n.feet,this.i18n.yards];d=this._distanceUnitsSelect.getOptions(this._distanceUnitsSelect.get("value")).label;this._drivingModeSelect.getOptions(this._drivingModeSelect.get("value"));b=this.i18n.other;a?(this.outputLayerName=a,this.outputLayerInput.set("value",a)):this._breakValuesInput&&(!this.outputLayerName&&this.inputLayer?this.outputLayerName=
l.substitute(this.i18n.outputModeLayerName,{mode:b,layername:this.inputLayer.name,breakValues:this._breakValuesInput.get("value"),breakUnits:d}):(this.outputLayerName=this.outputLayerInput.get("value"),a=this.outputLayerName.substr(0,this.outputLayerName.indexOf(" ")),a!==b&&(this.outputLayerName=this.outputLayerName.replace(a,b)),-1!==this.outputLayerName.lastIndexOf("(")&&(b=this.outputLayerName.substring(0,this.outputLayerName.lastIndexOf("(")),a=l.trim(this.outputLayerName.substring(this.outputLayerName.lastIndexOf(" "),
this.outputLayerName.lastIndexOf(")"))),-1!==k.indexOf(c,a)&&(this.outputLayerName=l.substitute(b+"(${breakValues} ${breakUnits})",{breakValues:this._breakValuesInput.get("value"),breakUnits:d})))),this.outputLayerInput.set("value",this.outputLayerName))},_connect:function(a,b,c){this._pbConnects.push(g.connect(a,b,c))}});u("extend-esri")&&d.setObject("dijit.analysis.CreateDriveTimeAreas",r,B);return r});