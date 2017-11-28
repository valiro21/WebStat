
var chartWrappers = [];

// Test data ------------------------------------------------------------------------------


var testData = [12, 19, 3, 5, 2, 3];
var testLabels = ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"];
var testDatasetLabel = '# of votes';
var testTypes = ['bar', 'pie', 'doughnut', 'line'];

// Functions ------------------------------------------------------------------------------

/**
 * Initializes charts with mock-up data
 */
function initPreviewCharts() {

    Chart.defaults.global.legend.display = false;

    testTypes.forEach(function (t) {
        var id = t + '-chart';

        chartWrapper = new ChartWrapper(id, t, null, null);
        chartWrapper.buildDataSingle(testLabels, testDatasetLabel, testData);

        chartWrapper.render();

        chartWrappers.push(chartWrapper);
    });
}