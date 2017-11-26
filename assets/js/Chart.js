
// Constants ------------------------------------------------------------------------------

var BACKGROUND_ALPHA = 0.2;

var BORDER_ALPHA = 1.0;
var BORDER_WIDTH = 1.0;

// Functions ------------------------------------------------------------------------------

function createMultiChart(chartElementId, chartType, labels, datasets, options) {
    var context = document.getElementById(chartElementId).getContext('2d');

    var chart = new Chart(context, {
        type: chartType,
        data: {
            labels: labels,
            datasets: datasets
        },
        options: options
    });

    return chart;
}

function createChart(chartElementId, chartType, data, datasetLabel, labels, options) {
    var context = document.getElementById(chartElementId).getContext('2d');

    var rgbColors = getRandomColors(data.length);

    var borderColors = getRgbaFromRgbArray(rgbColors, BORDER_ALPHA);
    var backgroundColors = getRgbaFromRgbArray(rgbColors, BACKGROUND_ALPHA);

    // create single dataset
    var datasets = [{
        label: datasetLabel,
        data: data,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: BORDER_WIDTH
    }];

    return createMultiChart(chartElementId, chartType, labels, datasets, options);
}

function randomlyChangeChart(chart){
    var datasetIndex = getRandomInt(0, chart.data.datasets.length);
    var dataIndex    = getRandomInt(0, chart.data.datasets[datasetIndex].data.length);

    var dataset = chart.data.datasets[datasetIndex];
    dataset.data[dataIndex] = getRandomInt(1, 20);

    chart.update();
}