
var chart;

// Test data ------------------------------------------------------------------------------

var testData = [12, 19, 3, 5, 2, 3];
var testLabels = ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"];
var testDatasetLabel = '# of votes';

// Functions ------------------------------------------------------------------------------

function initTestChart() {
    chart = createChart('chart', 'bar', testData, testDatasetLabel, testLabels);
    window.setInterval(randomlyChangeChart, 1000, chart);
}
