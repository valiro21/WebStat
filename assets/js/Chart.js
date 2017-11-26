
// Constants ------------------------------------------------------------------------------

var BACKGROUND_ALPHA = 0.2;

var BORDER_ALPHA = 1.0;
var BORDER_WIDTH = 1.0;

// Functions ------------------------------------------------------------------------------

function createChart(chartElementId, chartType, data, chartLabel, labels, options) {
    var context = document.getElementById(chartElementId).getContext('2d');

    var rgbColors = getRandomColors(data.length);

    var borderColors = getRgbaFromRgbArray(rgbColors, BORDER_ALPHA);
    var backgroundColors = getRgbaFromRgbArray(rgbColors, BACKGROUND_ALPHA);

    var chart = new Chart(context, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [{
                label: chartLabel,
                data: data,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: BORDER_WIDTH
            }]
        },
        options: options
    });

    window.setInterval(myCallback, 1000);

    return chart;
}

function myCallback(){
    var index = Math.floor((Math.random() * 6));
    chart.data.datasets[0].data[index] = Math.floor((Math.random() * 20) + 1);

    chart.update();
}