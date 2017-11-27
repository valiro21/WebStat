
var chartWrapper;

// Test data ------------------------------------------------------------------------------

var testData = [12, 19, 3, 5, 2, 3];
var testLabels = ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"];
var testDatasetLabel = '# of votes';
var testId = 'chart';
var testType = 'bar';

// Functions ------------------------------------------------------------------------------

function initTestChart() {
    chartWrapper = new ChartWrapper(testId, testType, null, null);

    chartWrapper.buildDataSingle(testLabels, testDatasetLabel, testData);

    chartWrapper.render();

    window.setInterval(chartWrapper.changeTypeRandom.bind(chartWrapper), 1000);
}
