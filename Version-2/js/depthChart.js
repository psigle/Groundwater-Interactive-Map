function depthChart(State) {

document.getElementById("depthChart").innerHTML = "";

$(function () {

var WellN = "error";

$.getJSON(
  'http://map.northplainsgcd.org/npgcdgis/rest/services/IMPMaps/RecorderMap/FeatureServer/0/query?where=BeenInstal+%3D+%27Y%27&outFields=StateNo%2C+WellNm&returnGeometry=false&orderByFields=StateNo&f=pjson',
  function (a) {
      var totalLenght = a.features.length;
      var i = 0;
      for (i; i < totalLenght; i += 1) {
        if (a.features[i].attributes.StateNo == State) {
          WellN = a.features[i].attributes.WellNm;
          break;
        } else {

        };
      };


$.getJSON(
  'http://map.northplainsgcd.org/npgcdgis/rest/services/IMPMaps/RecorderTable/FeatureServer/1/query?where=Station_ID%3D%27'+WellN+'%27+And+Parameter_ID%3D%27Water+Level+%2F+Depth+to+Water%27&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=DateRead%2C+Value&orderByFields=DateRead&f=pjson',
  function (data) {

    		//Modified Data
        	//Declare array
    			var endData = [];
    			//Var with the value of the lenght
    			var objlenght = data.features.length;
    			//Push Data
    			var i = 0;
    			for (i; i < objlenght; i += 1) {
      			endData.push([
        			data.features[i].attributes.DateRead,
        			data.features[i].attributes.Value
      			]);
					};
        // Create the chart
        $('#depthChart').highcharts('StockChart', {
            credits: {
              enabled: false
            },
            rangeSelector : {
                selected : 5
            },
            scrollbar: {
                enabled: false
            },
            yAxis: {
            		title: {
                		text: 'Depth to Water'
            			},
            		labels: {
                		text: 'Depth to Water',
            				format: '{value} ft'
              		}
        		},
            navigator : {
                maskFill : 'rgba(82, 189, 236, 0.25)',
            },
            series : [{
                name : 'Depth to Water (ft)',
                data : endData,
                type : 'spline',
                animation: {
                    duration: 1500
                },
                threshold : null,
                tooltip : {
                    valueDecimals : 1
                },
            }]
        });
    });
  });
  });
};
