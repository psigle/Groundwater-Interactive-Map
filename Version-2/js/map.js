var map;
      require([
            "esri/map",
            "application/bootstrapmap",
            "esri/dijit/Scalebar",
            "dojo/parser",
            "esri/geometry/webMercatorUtils",
            "esri/dijit/HomeButton",
            "esri/dijit/LocateButton",
            "esri/layers/ArcGISDynamicMapServiceLayer",
            "esri/dijit/Search",
            "esri/layers/FeatureLayer",
            "esri/dijit/Popup",
            "esri/dijit/InfoWindowLite",
            "esri/InfoTemplate",
            "esri/dijit/Legend",
            "dojo/_base/array",
            "dojo/dom",
            "dojo/domReady!"
        ], function(
            Map,
            BootstrapMap,
            Scalebar,
            parser,
            webMercatorUtils,
            HomeButton,
            LocateButton,
            ArcGISDynamicMapServiceLayer,
            Search,
            FeatureLayer,
            Popup,
            InfoWindowLite,
            InfoTemplate,
            Legend,
            arrayUtils,
            dom
            ) {
//Create Map
        parser.parse();
         var map = BootstrapMap.create("mapDiv", {
          center: [-101.524190, 36.093145],
          sliderPosition: "top-left",
          zoom: 9,
          scrollWheelZoom: true
        });
        map.setBasemap("topo");
//Show Coordinates
        map.on("load", function() {
          map.on("mouse-move", showCoordinates);
          map.on("mouse-drag", showCoordinates);
        });
        function showCoordinates(evt) {
          var mp = webMercatorUtils.webMercatorToGeographic(evt.mapPoint);
          dom.byId("info").innerHTML = mp.y.toFixed(6) + ", " + mp.x.toFixed(6);
        }
//Scale Bar
        var scalebar = new Scalebar({
          map: map,
          scalebarStyle: "line",
          scalebarUnit: "english"
        });
//Home Button
        var home = new HomeButton({
            map: map
        }, "HomeButton");
        home.startup();
//Locate Button
        geoLocate = new LocateButton({
            map: map,
            useTracking: true,
            scale: 10000,
        }, "LocateButton");
        geoLocate.startup();
//Search code
        var search = new Search({
            enableButtonMode: true, //this enables the search widget to display as a single button
            enableLabel: false,
            sources: [],
            enableInfoWindow: false,
            zoomScale: 10000,
            map: map
        }, "search");
        var sources = search.get("sources");
        sources.push({
            featureLayer: new FeatureLayer("http://map.northplainsgcd.org/npgcdgis/rest/services/IMPMaps/Wells/MapServer/0"),
            searchFields: ["WellNum"],
            displayField: "WellNum",
            exactMatch: false,
            outFields: ["*"],
            name: "Well Number",
            placeholder: "MO-0001",
            maxResults: 10,
            maxSuggestions: 10,
            enableSuggestions: true,
            minCharacters: 0
        });
        sources.push({
            featureLayer: new FeatureLayer("http://map.northplainsgcd.org/npgcdgis/rest/services/IMPMaps/Sections/MapServer/0"),
            searchFields: ["ADDRESS"],
            displayField: "ADDRESS",
            exactMatch: false,
            name: "Section, Block, & Survey",
            outFields: ["*"],
            placeholder: "337, 44, H&TC",
            maxResults: 10,
            maxSuggestions: 10,
            enableSuggestions: true,
            enableHighlight: false,
            minCharacters: 0
        });
        search.set("sources", sources);
        search.startup();
//Popups
      var popup = map.infoWindow;
            popup.highlight = true;
            popup.titleInBody = false;
            popup.domNode.className += " Light";
//Info Windows
      var template1 = new InfoTemplate();
        template1.setTitle("<b>${WellNum}</b>");
        template1.setContent("<b>Type of Well:</b> ${WellType:wellTypeDesc}</br><b>Well Class:</b> ${WellClass:wellClassDesc}</br><b>Max Yield:</b> ${WellMaxYield} gpm</br><b>GPU ID:</b> ${PropId}</br><b>Section, Block & Survey:</b> ${WellSection}, ${WellBlock}, ${WellSurvey}</br><b>Latitude:</b> ${WellLatitude}</br><b>Longitude:</b> ${WellLongitude}<br><b>State Tracking #:</b> ${StTrackingNum}<br><b>Documentation: </b><a target='_blank' href=http://map.northplainsgcd.org/logs/${WellCounty}/${WellNum:urlFunction}.pdf>Click Here</a></br>");
      var template2 = new InfoTemplate();
        template2.setTitle("<b>State Well #: ${StateWellNumber}</b>");
        template2.setContent("<b>Type of Well:</b> ${PrimaryWaterUse}</br><b>Elevation:</b> ${Elevation} ft.</br><b>Well Depth:</b> ${WellDepth} ft.</br><b>Latitude:</b> ${CoordDDLat}</br><b>Longitude:</b> ${CoordDDLong}</br><b>Database Results: </b><a target='_blank' href=http://www2.twdb.texas.gov/apps/waterdatainteractive//GetReports.aspx?Num=${StateWellNumber}&Type=GWDB>Click Here</a></br><b>Other Documentation: </b><a target='_blank' href=http://www2.twdb.texas.gov/apps/waterdatainteractive//GetScannedImage.aspx?Num=${StateWellNumber}&amp;Cnty=${CountyName}>Click Here</a>");
      var template3 = new InfoTemplate();
        template3.setTitle("<b>Monitor Well #: ${WellNm}</b>");
        template3.setContent("<b>Name:</b> ${Name}</br><b>Well Depth:</b> ${Depth} feet</br><b>State Well Number:</b> ${StateNo}</br><b>Longitude:</b> ${Longitude}</br><b>Latitude:</b> ${Latitude}</br><b>Section, Block & Survey:</b> ${Sec}, ${Blk}, ${Survey}</br><b>Documentation: </b><a target='_blank' href=http://map.northplainsgcd.org/logs/${Co}/${WellNm:urlFunction}.pdf>Click Here</a></br> </br><div class='btn-group' role='group' aria-label='...'><button type='button' class='btn btn-default' id='thicknessButton' data-toggle='modal' data-target='#thicknessModal' onclick='thicknessChart(${StateNo})'>Saturated Thickness</button><button type='button' class='btn btn-default' id='depthButton' data-toggle='modal' data-target='#depthModal' onclick='depthChart(${StateNo})'>Depth to Water</button></div>");

//Changing size of infowindows
      map.infoWindow.resize(300, 500); //300, 210
//Function to create url
      urlFunction = function (value, key, data) {
        var wrapper = document.createElement('div');
        wrapper.innerHTML = value;
        var v = wrapper.firstChild.textContent;
        v = v.trim();
        return v;
      };
// Function to change welltype from a number to a string
      wellTypeDesc = function (value, key, data) {
        var wrapper = document.createElement('div');
        wrapper.innerHTML = value;
        var v = wrapper.firstChild.textContent;
        switch (v) {
          case "2":
            return "Domestic";
            break;
          case "3":
            return "Irrigation";
            break;
          case "4":
            return "Municipal";
            break;
          case "5":
            return "Livestock";
            break;
          case "6":
            return "Rig Supply";
            break;
          case "7":
            return "Monitor";
            break;
          case "8":
            return "Industrial";
            break;
          case "10":
            return "Commercial";
            break;
          case "12":
            return "Church/School";
            break;
          case "13":
            return "Public Water Supply";
            break;
          case "14":
            return "Auxillary";
            break;
          case "15":
            return "Heat Exchange";
            break;
          case "16":
            return "Cancel";
            break;
          default:
            return "Unknown: " + value;
        }};
//Function to change WellClass from a number to a string
       wellClassDesc = function (value, key, data) {
          var wrapper = document.createElement('div');
          wrapper.innerHTML = value;
          var v = wrapper.firstChild.textContent;
          switch (v) {
            case "1":
              return "S";
              break;
            case "2":
              return "A";
              break;
            case "3":
              return "B";
              break;
            case "4":
              return "C";
              break;
            case "5":
              return "D";
              break;
            case "10":
              return "Non-Exempt";
              break;
            case "11":
              return "Spacing Exempt";
              break;
            default:
              return "Unknown: " + value;
          }};
//Feature Layer for Popups
        var wells = new FeatureLayer("http://map.northplainsgcd.org/npgcdgis/rest/services/IMPMaps/Wells/MapServer/0", {
          mode: FeatureLayer.MODE_ONDEMAND,
          infoTemplate: template1,
          outFields: ["*"]
        });
        var twdbwells = new FeatureLayer("http://services.twdb.texas.gov/arcgis/rest/services/Public/TWDB_Groundwater_database/MapServer/0", {
          mode: FeatureLayer.MODE_ONDEMAND,
          infoTemplate: template2,
          outFields: ["*"],
        });
        var recordwells = new FeatureLayer("http://map.northplainsgcd.org/npgcdgis/rest/services/IMPMaps/RecorderMap/MapServer/0", {
          mode: FeatureLayer.MODE_ONDEMAND,
          infoTemplate: template3,
          outFields: ["*"],
        });
        map.addLayer(wells);
        map.addLayer(twdbwells);
        map.addLayer(recordwells);
        twdbwells.hide();
        wells.hide();

//Dynamic Layer
        var outline = new ArcGISDynamicMapServiceLayer("http://map.northplainsgcd.org/npgcdgis/rest/services/IMPMaps/Outline/MapServer");
        var counties = new ArcGISDynamicMapServiceLayer("http://map.northplainsgcd.org/npgcdgis/rest/services/IMPMaps/Counties/MapServer");
        var Sectiondynamic = new ArcGISDynamicMapServiceLayer("http://map.northplainsgcd.org/npgcdgis/rest/services/IMPMaps/Sections/MapServer");
        var Section2dynamic = new ArcGISDynamicMapServiceLayer("http://map.northplainsgcd.org/npgcdgis/rest/services/IMPMaps/Sections2/MapServer");
        var Wellsdynamic = new ArcGISDynamicMapServiceLayer("http://map.northplainsgcd.org/npgcdgis/rest/services/IMPMaps/Wells/MapServer");
        var Wells2dynamic = new ArcGISDynamicMapServiceLayer("http://map.northplainsgcd.org/npgcdgis/rest/services/IMPMaps/Wells2/MapServer");
        var Wells3dynamic = new ArcGISDynamicMapServiceLayer("http://map.northplainsgcd.org/npgcdgis/rest/services/IMPMaps/Wells3/MapServer");
        var depthdynamic = new ArcGISDynamicMapServiceLayer("http://map.northplainsgcd.org/npgcdgis/rest/services/IMPMaps/Depth/MapServer");
        var declinedynamic = new ArcGISDynamicMapServiceLayer("http://map.northplainsgcd.org/npgcdgis/rest/services/IMPMaps/Decines/MapServer");
        var thicknessdynamic = new ArcGISDynamicMapServiceLayer("http://map.northplainsgcd.org/npgcdgis/rest/services/IMPMaps/Thickness/MapServer");
        var majorAquifers = new ArcGISDynamicMapServiceLayer("http://map.northplainsgcd.org/npgcdgis/rest/services/IMPMaps/major/MapServer", {
          opacity: 0.3
        });
        var minorAquifers = new ArcGISDynamicMapServiceLayer("http://map.northplainsgcd.org/npgcdgis/rest/services/IMPMaps/minor/MapServer", {
          opacity: 0.3
        });
        var twdbdynamic = new ArcGISDynamicMapServiceLayer("http://services.twdb.texas.gov/arcgis/rest/services/Public/TWDB_Groundwater_database/MapServer");
        var recorddynamic = new ArcGISDynamicMapServiceLayer("http://map.northplainsgcd.org/npgcdgis/rest/services/IMPMaps/RecorderMap/MapServer");
        //var WellReportdynamic = new ArcGISDynamicMapServiceLayer("http://services.twdb.texas.gov/arcgis/rest/services/Public/WellReports/MapServer");
        //var testdynamic = new ArcGISDynamicMapServiceLayer("http://services.twdb.texas.gov/arcgis/rest/services/Public/BrackishGroundwater/MapServer");
//add the legend
      map.on("layers-add-result", function (evt) {
      var layerInfo = arrayUtils.map(evt.layers, function (layer, index) {
        return {layer:layer.layer, title:layer.layer.name};
      });
      if (layerInfo.length > 0) {
      var legendDijit = new Legend({
            map: map,
            layerInfos: layerInfo
          }, "legend");
        legendDijit.startup();
        }
      });
      map.addLayers([majorAquifers, minorAquifers, outline, counties, Sectiondynamic, Section2dynamic, Wellsdynamic, Wells2dynamic, Wells3dynamic, depthdynamic, declinedynamic, thicknessdynamic, twdbdynamic, recorddynamic]);
      Section2dynamic.hide();
      Wells2dynamic.hide();
      depthdynamic.hide();
      declinedynamic.hide();
      thicknessdynamic.hide();
      majorAquifers.hide();
      minorAquifers.hide();
      twdbdynamic.hide();
      Wellsdynamic.hide();
      Wells3dynamic.hide();
//Basemap changer
        $(document).ready(function() {
            $("#baselayer li").click(function (e) {
                switch (e.target.text) {
                case "Imagery":
                    map.setBasemap("hybrid");
                    if($("#district-toggle").hasClass("active")) {
                        Wellsdynamic.hide();
                        Wells2dynamic.show();
                    }
                    else {
                        Wellsdynamic.hide();
                        Wells2dynamic.hide();
                    }
                    Sectiondynamic.hide();
                    Section2dynamic.show();
                    break;
                case "Streets":
                    map.setBasemap("streets");
                    if($("#district-toggle").hasClass("active")) {
                        Wellsdynamic.show();
                        Wells2dynamic.hide();
                    }
                    else {
                        Wellsdynamic.hide();
                        Wells2dynamic.hide();
                    }
                    Section2dynamic.hide();
                    Sectiondynamic.show();
                    break;
                case "Topographic":
                    map.setBasemap("topo");
                    if($("#district-toggle").hasClass("active")) {
                        Wellsdynamic.show();
                        Wells2dynamic.hide();
                    }
                    else {
                        Wellsdynamic.hide();
                        Wells2dynamic.hide();
                    }
                    Section2dynamic.hide();
                    Sectiondynamic.show();
                    break;
                case "Light Gray":
                    map.setBasemap("gray");
                    if($("#district-toggle").hasClass("active")) {
                        Wellsdynamic.show();
                        Wells2dynamic.hide();
                    }
                    else {
                        Wellsdynamic.hide();
                        Wells2dynamic.hide();
                    }
                    Section2dynamic.hide();
                    Sectiondynamic.show();
                    break;
                case "National Geographic":
                    map.setBasemap("national-geographic");
                    if($("#district-toggle").hasClass("active")) {
                        Wellsdynamic.show();
                        Wells2dynamic.hide();
                    }
                    else {
                        Wellsdynamic.hide();
                        Wells2dynamic.hide();
                    }
                    Section2dynamic.hide();
                    Sectiondynamic.show();
                    break;
                }
            });
        });
//Hydro Map changer
            $(document).ready(function() {
            $("#hydro li").click(function (e) {
                switch (e.target.text) {
                case "Depth to Water":
                    depthdynamic.show();
                    declinedynamic.hide();
                    thicknessdynamic.hide();
                    break;
                case "Average Decline":
                    depthdynamic.hide();
                    declinedynamic.show();
                    thicknessdynamic.hide();
                    break;
                case "Saturated Thickness":
                    depthdynamic.hide();
                    declinedynamic.hide();
                    thicknessdynamic.show();
                    break;
                case "None":
                    depthdynamic.hide();
                    declinedynamic.hide();
                    thicknessdynamic.hide();
                    break;
                }
            });
        });
//Wells Map changer
            $(document).ready(function() {
            $("#wells li").click(function (e) {
                switch (e.target.text) {
                case "District's Well Database":
                    if($("#imagery-toggle").hasClass("active")) {
                        Wellsdynamic.hide();
                        Wells2dynamic.show();
                    }
                    else {
                        Wellsdynamic.show();
                        Wells2dynamic.hide();
                    }
                    Wells3dynamic.show();
                    wells.show();
                    twdbwells.hide();
                    twdbdynamic.hide();
                    recorddynamic.hide();
                    recordwells.hide();
                    break;
                case "Continuous Well Monitoring Network":
                    Wellsdynamic.hide();
                    Wells2dynamic.hide();
                    Wells3dynamic.hide();
                    wells.hide();
                    twdbwells.hide();
                    twdbdynamic.hide();
                    recorddynamic.hide();
                    recordwells.show();
                    break;
                case "TWDB's Well Database":
                    Wellsdynamic.hide();
                    Wells2dynamic.hide();
                    Wells3dynamic.hide();
                    wells.hide();
                    twdbwells.show();
                    twdbdynamic.show();
                    recorddynamic.hide();
                    recordwells.hide();
                    break;
                }
            });
        });
//Aquifer Changer
            $(document).ready(function() {
            $("#Aquifers li").click(function (e) {
                switch (e.target.text) {
                case "Major Aquifers":
                    majorAquifers.show();
                    minorAquifers.hide();
                    break;
                case "Minor Aquifers":
                    majorAquifers.hide();
                    minorAquifers.show();
                    break;
                case "None":
                    majorAquifers.hide();
                    minorAquifers.hide();
                    break;
                }
            });
        });
      });
