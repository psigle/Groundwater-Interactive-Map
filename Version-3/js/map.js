var map;
      require([
            "esri/map",
            "esri/dijit/Scalebar",
            "dojo/parser",
            "esri/geometry/webMercatorUtils",
            "esri/dijit/HomeButton",
            "esri/dijit/LocateButton",
            "esri/layers/ArcGISDynamicMapServiceLayer",
            "esri/layers/ArcGISTiledMapServiceLayer",
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
            Scalebar,
            parser,
            webMercatorUtils,
            HomeButton,
            LocateButton,
            ArcGISDynamicMapServiceLayer,
            ArcGISTiledMapServiceLayer,
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
         var map = new Map("mapDiv", {
          center: [-101.524190, 36.093145],
          sliderPosition: "top-left",
          zoom: 9,
          scrollWheelZoom: true
        });
        map.setBasemap("topo");
//US Topo Map
        var usaTopo = new ArcGISTiledMapServiceLayer("http://server.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer");
        map.addLayer(usaTopo);
        usaTopo.hide();
//NRCS Soil Survey
        var soil = new ArcGISTiledMapServiceLayer("http://services.arcgisonline.com/arcgis/rest/services/Specialty/Soil_Survey_Map/MapServer");
        map.addLayer(soil);
        soil.hide();
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
          scalebarUnit: "dual"
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
        template2.setTitle("<b>State Well: ${StateWellNumber}</b>");
        template2.setContent("<b>Type of Well:</b> ${PrimaryWaterUse}</br><b>Elevation:</b> ${Elevation} ft.</br><b>Well Depth:</b> ${WellDepth} ft.</br><b>Latitude:</b> ${CoordDDLat}</br><b>Longitude:</b> ${CoordDDLong}</br><b>Database Results: </b><a target='_blank' href=http://www2.twdb.texas.gov/apps/waterdatainteractive//GetReports.aspx?Num=${StateWellNumber}&Type=GWDB>Click Here</a></br><b>Other Documentation: </b><a target='_blank' href=http://www2.twdb.texas.gov/apps/waterdatainteractive//GetScannedImage.aspx?Num=${StateWellNumber}&amp;Cnty=${CountyName}>Click Here</a></br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<img src=images/TWDB.png>");
      var template3 = new InfoTemplate();
        template3.setTitle("<b>Monitor Well: ${WellNm}</b>");
        template3.setContent("<b>Name:</b> ${Name}</br><b>Well Depth:</b> ${Depth} feet</br><b>State Well Number:</b> ${StateNo}</br><b>Longitude:</b> ${Longitude}</br><b>Latitude:</b> ${Latitude}</br><b>Section, Block & Survey:</b> ${Sec}, ${Blk}, ${Survey}</br><b>Documentation: </b><a target='_blank' href=http://map.northplainsgcd.org/logs/${Co}/${WellNm:urlFunction}.pdf>Click Here</a></br> </br><div class='btn-group' role='group' aria-label='...'><button type='button' class='btn btn-default' id='thicknessButton' data-toggle='modal' data-target='#thicknessModal' onclick='thicknessChart(${StateNo})'>Saturated Thickness</button><button type='button' class='btn btn-default' id='depthButton' data-toggle='modal' data-target='#depthModal' onclick='depthChart(${StateNo})'>Depth to Water</button></div>");
      var template4 = new InfoTemplate();
        template4.setTitle("Annual Monitor Well: ${County_Nam}");
        template4.setContent("<b>Aquifer:</b> ${Aquifer}</br><b>County:</b> ${County}</br><b>State Well Number:</b> ${State_Numb}</br><b>Surface Elevation:</b> ${Surface_El}</br>-----------------------------------------</br>All values represent feet below surface</br><b>1982:</b> ${F1982:winterFunc}</br><b>1983:</b> ${F1983:winterFunc}</br><b>1984:</b> ${F1984:winterFunc}</br><b>1985:</b> ${F1985:winterFunc}</br><b>1986:</b> ${F1986:winterFunc}</br><b>1987:</b> ${F1987:winterFunc}</br><b>1988:</b> ${F1988:winterFunc}</br><b>1989:</b> ${F1989:winterFunc}</br><b>1990:</b> ${F1990:winterFunc}</br><b>1991:</b> ${F1991:winterFunc}</br><b>1992:</b> ${F1992:winterFunc}</br><b>1993:</b> ${F1993:winterFunc}</br><b>1994:</b> ${F1994:winterFunc}</br><b>1995:</b> ${F1995:winterFunc}</br><b>1996:</b> ${F1996:winterFunc}</br><b>1997:</b> ${F1997:winterFunc}</br><b>1998:</b> ${F1998:winterFunc}</br><b>1999:</b> ${F1999:winterFunc}</br><b>2000:</b> ${F2000:winterFunc}</br><b>2001:</b> ${F2001:winterFunc}</br><b>2002:</b> ${F2002:winterFunc}</br><b>2003:</b> ${F2003:winterFunc}</br><b>2004:</b> ${F2004:winterFunc}</br><b>2005:</b> ${F2005:winterFunc}</br><b>2006:</b> ${F2006:winterFunc}</br><b>2007:</b> ${F2007:winterFunc}</br><b>2008:</b> ${F2008:winterFunc}</br><b>2009:</b> ${F2009:winterFunc}</br><b>2010:</b> ${F2010:winterFunc}</br><b>2011:</b> ${F2011:winterFunc}</br><b>2012:</b> ${F2012:winterFunc}</br><b>2013:</b> ${F2013:winterFunc}</br><b>2014:</b> ${F2014:winterFunc}</br><b>2015:</b> ${F2015:winterFunc}</br><b>2016:</b> ${F2016:winterFunc}");
      var template5 = new InfoTemplate();
        template5.setTitle("Submitted Well Reports");
        template5.setContent("<b> Type of Well:</b> ${WellType}</br><b>Proposed Use:</b> ${ProposedUse}</br><b>Date of Well Completion:</b> ${DateOfWellCompletion}</br><b>Bore hole Depth:</b> ${BoreholeDepthFt} feet</br><b>County:</b> ${County}</br><b>Documentation: </b><a target='_blank' href=http://www2.twdb.texas.gov/apps/waterdatainteractive//GetReports.aspx?Num=${WellReportTrackingNumber}&Type=SDR-Well>Click Here</a></br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<img src=images/TWDB.png>");
      var template6 = new InfoTemplate();
        template6.setTitle("Submitted Plugging Reports");
        template6.setContent("<b> Type of Well:</b> ${WellType}</br><b>Date of Plugging:</b> ${DateOfWellPlugging}</br><b>Bore hole Depth:</b> ${BoreholeDepthFt} feet</br><b>County:</b> ${County}</br><b>Documentation: </b><a target='_blank' href=http://www2.twdb.texas.gov/apps/waterdatainteractive//GetReports.aspx?Num=${PluggingReportTrackingNumber}&Type=SDR-Plug>Click Here</a></br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<img src=images/TWDB.png>");
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
// Function to take out N M out of winter water levels
      winterFunc = function (value, key, data) {
        var wrapper = document.createElement('div');
        wrapper.innerHTML = value;
        var v = wrapper.firstChild.textContent;
        switch (v) {
          case "0":
            return "No Measurement";
            break;
          case "N A":
            return "No Measurement";
            break;
          case "N M":
            return "No Measurement";
            break;
          default:
            return value;
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
        var annualWells = new FeatureLayer("http://map.northplainsgcd.org/npgcdgis/rest/services/IMPMaps/WinterWater/MapServer/0", {
          mode: FeatureLayer.MODE_ONDEMAND,
          infoTemplate: template4,
          outFields: ["*"],
        });
        var twdblogs = new FeatureLayer("http://services.twdb.texas.gov/arcgis/rest/services/Public/WellReports/MapServer/0", {
          mode: FeatureLayer.MODE_ONDEMAND,
          infoTemplate: template5,
          outFields: ["*"],
        });
        var twdbplugs = new FeatureLayer("http://services.twdb.texas.gov/arcgis/rest/services/Public/PluggingReports/MapServer/0", {
          mode: FeatureLayer.MODE_ONDEMAND,
          infoTemplate: template6,
          outFields: ["*"],
        });
        map.addLayer(wells);
        map.addLayer(twdbwells);
        map.addLayer(recordwells);
        map.addLayer(annualWells);
        map.addLayer(twdblogs);
        map.addLayer(twdbplugs);
        twdbwells.hide();
        wells.hide();
        annualWells.hide();
        twdblogs.hide();
        twdbplugs.hide();
//Dynamic Layer
        var outline = new ArcGISDynamicMapServiceLayer("http://map.northplainsgcd.org/npgcdgis/rest/services/IMPMaps/Outline/MapServer");
        var counties = new ArcGISDynamicMapServiceLayer("http://map.northplainsgcd.org/npgcdgis/rest/services/IMPMaps/Counties/MapServer");
        var Sectiondynamic = new ArcGISDynamicMapServiceLayer("http://map.northplainsgcd.org/npgcdgis/rest/services/IMPMaps/Sections/MapServer");
        var Wellsdynamic = new ArcGISDynamicMapServiceLayer("http://map.northplainsgcd.org/npgcdgis/rest/services/IMPMaps/Wells/MapServer");
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
        var twdblogsdynamic = new ArcGISDynamicMapServiceLayer("http://services.twdb.texas.gov/arcgis/rest/services/Public/WellReports/MapServer");
        var twdbplugsdynamic = new ArcGISDynamicMapServiceLayer("http://services.twdb.texas.gov/arcgis/rest/services/Public/PluggingReports/MapServer");
        var annualdynamic = new ArcGISDynamicMapServiceLayer("http://map.northplainsgcd.org/npgcdgis/rest/services/IMPMaps/WinterWater/MapServer");
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
      map.addLayers([majorAquifers, minorAquifers, outline, counties, Sectiondynamic, Wellsdynamic, Wells3dynamic, depthdynamic, declinedynamic, thicknessdynamic, twdbdynamic, recorddynamic, twdblogsdynamic, twdbplugsdynamic, annualdynamic]);
      depthdynamic.hide();
      declinedynamic.hide();
      thicknessdynamic.hide();
      majorAquifers.hide();
      minorAquifers.hide();
      twdbdynamic.hide();
      Wellsdynamic.hide();
      Wells3dynamic.hide();
      twdblogsdynamic.hide();
      twdbplugsdynamic.hide();
      annualdynamic.hide();
//Basemap changer depth
      $(document).ready(function() {
          $("#depthImg").click(function(){
                depthdynamic.show();
                declinedynamic.hide();
                thicknessdynamic.hide();
              });
            });
//Basemap changer decline
      $(document).ready(function() {
          $("#declineImg").click(function(){
                depthdynamic.hide();
                declinedynamic.show();
                thicknessdynamic.hide();
              });
            });
//Basemap changer thickness
      $(document).ready(function() {
          $("#thicknessImg").click(function(){
                depthdynamic.hide();
                declinedynamic.hide();
                thicknessdynamic.show();
              });
            });
//Basemap changer major
      $(document).ready(function() {
          $("#majorImg").click(function(){
                majorAquifers.show();
                minorAquifers.hide();
              });
            });
//Basemap changer minor
      $(document).ready(function() {
          $("#minorImg").click(function(){
                majorAquifers.hide();
                minorAquifers.show();
              });
            });
//Basemap changer Imagery
      $(document).ready(function() {
          $("#imageryImg").click(function(){
                $("#imagery-toggle").addClass("active");
                $("#streets-toggle").removeClass("active");
                $("#topo-toggle").removeClass("active");
                $("#usaTopo-toggle").removeClass("active");
                $("#gray-toggle").removeClass("active");
                $("#geo-toggle").removeClass("active");
                $("#soil-toggle").removeClass("active");
                map.setBasemap("hybrid");
                usaTopo.hide();
                soil.hide();
              });
            });
//Basemap changer Street
      $(document).ready(function() {
          $("#streetImg").click(function(){
                $("#imagery-toggle").removeClass("active");
                $("#streets-toggle").addClass("active");
                $("#topo-toggle").removeClass("active");
                $("#usaTopo-toggle").removeClass("active");
                $("#gray-toggle").removeClass("active");
                $("#geo-toggle").removeClass("active");
                $("#soil-toggle").removeClass("active");
                map.setBasemap("streets");
                usaTopo.hide();
                soil.hide();
              });
            });
//Basemap changer topo
      $(document).ready(function() {
          $("#topoImg").click(function(){
                $("#imagery-toggle").removeClass("active");
                $("#streets-toggle").removeClass("active");
                $("#topo-toggle").addClass("active");
                $("#usaTopo-toggle").removeClass("active");
                $("#gray-toggle").removeClass("active");
                $("#geo-toggle").removeClass("active");
                $("#soil-toggle").removeClass("active");
                map.setBasemap("topo");
                usaTopo.hide();
                soil.hide();
              });
            });
//Basemap changer usaTopo
      $(document).ready(function() {
          $("#usaTopoImg").click(function(){
                $("#imagery-toggle").removeClass("active");
                $("#streets-toggle").removeClass("active");
                $("#topo-toggle").removeClass("active");
                $("#usaTopo-toggle").addClass("active");
                $("#gray-toggle").removeClass("active");
                $("#geo-toggle").removeClass("active");
                $("#soil-toggle").removeClass("active");
                map.setBasemap("topo");
                usaTopo.show();
                soil.hide();
              });
            });
//Basemap changer gray
      $(document).ready(function() {
          $("#grayImg").click(function(){
                $("#imagery-toggle").removeClass("active");
                $("#streets-toggle").removeClass("active");
                $("#topo-toggle").removeClass("active");
                $("#usaTopo-toggle").removeClass("active");
                $("#gray-toggle").addClass("active");
                $("#geo-toggle").removeClass("active");
                $("#soil-toggle").removeClass("active");
                map.setBasemap("gray");
                usaTopo.hide();
                soil.hide();
              });
            });
//Basemap changer geo
      $(document).ready(function() {
          $("#geoImg").click(function(){
                $("#imagery-toggle").removeClass("active");
                $("#streets-toggle").removeClass("active");
                $("#topo-toggle").removeClass("active");
                $("#usaTopo-toggle").removeClass("active");
                $("#gray-toggle").removeClass("active");
                $("#geo-toggle").addClass("active");
                $("#soil-toggle").removeClass("active");
                map.setBasemap("national-geographic");
                usaTopo.hide();
                soil.hide();
              });
            });
//Basemap changer Soil
      $(document).ready(function() {
          $("#soilImg").click(function(){
                $("#imagery-toggle").removeClass("active");
                $("#streets-toggle").removeClass("active");
                $("#topo-toggle").removeClass("active");
                $("#usaTopo-toggle").removeClass("active");
                $("#gray-toggle").removeClass("active");
                $("#geo-toggle").removeClass("active");
                $("#soil-toggle").addClass("active");
                map.setBasemap("national-geographic");
                usaTopo.hide();
                soil.show();
              });
            });
//Basemap changer jquary
        $(document).ready(function() {
            $("#baselayer li").click(function (e) {
                switch (e.target.text) {
                case "Imagery":
                    $("#imagery-toggle").addClass("active");
                    $("#streets-toggle").removeClass("active");
                    $("#topo-toggle").removeClass("active");
                    $("#usaTopo-toggle").removeClass("active");
                    $("#gray-toggle").removeClass("active");
                    $("#geo-toggle").removeClass("active");
                    $("#soil-toggle").removeClass("active");
                    map.setBasemap("hybrid");
                    usaTopo.hide();
                    soil.hide();
                    break;
                case "Streets":
                    $("#imagery-toggle").removeClass("active");
                    $("#streets-toggle").addClass("active");
                    $("#topo-toggle").removeClass("active");
                    $("#usaTopo-toggle").removeClass("active");
                    $("#gray-toggle").removeClass("active");
                    $("#geo-toggle").removeClass("active");
                    $("#soil-toggle").removeClass("active");
                    map.setBasemap("streets");
                    usaTopo.hide();
                    soil.hide();
                    break;
                case "Topographic":
                    $("#imagery-toggle").removeClass("active");
                    $("#streets-toggle").removeClass("active");
                    $("#topo-toggle").addClass("active");
                    $("#usaTopo-toggle").removeClass("active");
                    $("#gray-toggle").removeClass("active");
                    $("#geo-toggle").removeClass("active");
                    $("#soil-toggle").removeClass("active");
                    map.setBasemap("topo");
                    usaTopo.hide();
                    soil.hide();
                    break;
                case "USA Topographic":
                    $("#imagery-toggle").removeClass("active");
                    $("#streets-toggle").removeClass("active");
                    $("#topo-toggle").removeClass("active");
                    $("#usaTopo-toggle").addClass("active");
                    $("#gray-toggle").removeClass("active");
                    $("#geo-toggle").removeClass("active");
                    $("#soil-toggle").removeClass("active");
                    map.setBasemap("topo");
                    usaTopo.show();
                    soil.hide();
                    break;
                case "Light Gray":
                    $("#imagery-toggle").removeClass("active");
                    $("#streets-toggle").removeClass("active");
                    $("#topo-toggle").removeClass("active");
                    $("#usaTopo-toggle").removeClass("active");
                    $("#gray-toggle").addClass("active");
                    $("#geo-toggle").removeClass("active");
                    $("#soil-toggle").removeClass("active");
                    map.setBasemap("gray");
                    usaTopo.hide();
                    soil.hide();
                    break;
                case "National Geographic":
                    $("#imagery-toggle").removeClass("active");
                    $("#streets-toggle").removeClass("active");
                    $("#topo-toggle").removeClass("active");
                    $("#usaTopo-toggle").removeClass("active");
                    $("#gray-toggle").removeClass("active");
                    $("#geo-toggle").addClass("active");
                    $("#soil-toggle").removeClass("active");
                    map.setBasemap("national-geographic");
                    usaTopo.hide();
                    soil.hide();
                    break;
                case "USDA-NRCS Soil Survey":
                    $("#imagery-toggle").removeClass("active");
                    $("#streets-toggle").removeClass("active");
                    $("#topo-toggle").removeClass("active");
                    $("#usaTopo-toggle").removeClass("active");
                    $("#gray-toggle").removeClass("active");
                    $("#geo-toggle").removeClass("active");
                    $("#soil-toggle").addClass("active");
                    map.setBasemap("national-geographic");
                    usaTopo.hide();
                    soil.show();
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
                    Wellsdynamic.show();
                    Wells3dynamic.show();
                    wells.show();
                    twdbwells.hide();
                    twdbdynamic.hide();
                    recorddynamic.hide();
                    recordwells.hide();
                    annualWells.hide();
                    annualdynamic.hide();
                    twdblogs.hide();
                    twdblogsdynamic.hide();
                    twdbplugs.hide();
                    twdbplugsdynamic.hide();
                    break;
                case "Continuous Well Monitoring Network":
                    Wellsdynamic.hide();
                    Wells3dynamic.hide();
                    wells.hide();
                    twdbwells.hide();
                    twdbdynamic.hide();
                    recorddynamic.show();
                    recordwells.show();
                    annualWells.hide();
                    annualdynamic.hide();
                    twdblogs.hide();
                    twdblogsdynamic.hide();
                    twdbplugs.hide();
                    twdbplugsdynamic.hide();
                    break
                case "Annual Well Monitoring Network":
                    Wellsdynamic.hide();
                    Wells3dynamic.hide();
                    wells.hide();
                    twdbwells.hide();
                    twdbdynamic.hide();
                    recorddynamic.hide();
                    recordwells.hide();
                    annualWells.show();
                    annualdynamic.show();
                    twdblogs.hide();
                    twdblogsdynamic.hide();
                    twdbplugs.hide();
                    twdbplugsdynamic.hide();
                    break;
                case "TWDB's Well Database":
                    Wellsdynamic.hide();
                    Wells3dynamic.hide();
                    wells.hide();
                    twdbwells.hide();
                    twdbdynamic.hide();
                    recorddynamic.hide();
                    recordwells.hide();
                    annualWells.hide();
                    annualdynamic.hide();
                    twdblogs.show();
                    twdblogsdynamic.show();
                    twdbplugs.hide();
                    twdbplugsdynamic.hide();
                    break;
                case "TWDB's Plugging Reports":
                    Wellsdynamic.hide();
                    Wells3dynamic.hide();
                    wells.hide();
                    twdbwells.hide();
                    twdbdynamic.hide();
                    recorddynamic.hide();
                    recordwells.hide();
                    annualWells.hide();
                    annualdynamic.hide();
                    twdblogs.hide();
                    twdblogsdynamic.hide();
                    twdbplugs.show();
                    twdbplugsdynamic.show();
                    break;
                case "TWDB's Database":
                    Wellsdynamic.hide();
                    Wells3dynamic.hide();
                    wells.hide();
                    twdbwells.show();
                    twdbdynamic.show();
                    recorddynamic.hide();
                    recordwells.hide();
                    annualWells.hide();
                    annualdynamic.hide();
                    twdblogs.hide();
                    twdblogsdynamic.hide();
                    twdbplugs.hide();
                    twdbplugsdynamic.hide();
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
