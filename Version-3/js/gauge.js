var a = "SH-2369";
var b = 475;
$(function () {
    var gaugeOptions = {
        chart: {
            type: 'solidgauge'
        },
        credits: {
          enabled: false
        },
        title: null,
        pane: {
            center: ['50%', '85%'],
            size: '140%',
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },
        tooltip: {
            enabled: false
        },
        // the value axis
        yAxis: {
            minorTickInterval: null,
            tickWidth: 0,
            title: {
                y: -70
            },
            labels: {
                enabled: false
            }
        },
        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 5,
                    borderWidth: 0,
                    useHTML: true,
                    format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:.1f}</span><br/>' +
                       '<span style="font-size:12px;color:silver">Feet</span></div>'
                }
            }
        }
    };
    //data
  $.getJSON('http://map.northplainsgcd.org/npgcdgis/rest/services/IMPMaps/RecorderTable/FeatureServer/1/query?where=Station_ID%3D%27'+a+'%27+And+Parameter_ID%3D%27Water+Level+%2F+Depth+to+Water%27&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=DateRead%2C+Value&orderByFields=DateRead&f=pjson', function (data) {

    var length = data.features.length - 1;
    var level = data.features[length].attributes.Value;

    // The speed gauge
    $('#container-speed').highcharts(Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: [b],
            title: {
                text: 'Water Depth'
            }
        },

        credits: {
            enabled: false
        },

        series: [{
            name: 'Depth',
            data: [-level]
        }]

    }));
    // The RPM gauge
    $('#container-rpm').highcharts(Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: b,
            title: {
                text: 'Saturated Thickness'
            }
        },
        series: [{
            name: 'RPM',
            data: [b + level]
        }]
    }));
	});
});
