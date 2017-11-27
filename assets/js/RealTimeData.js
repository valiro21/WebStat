
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
}

function changeChartType() {
    var elem = document.getElementById("chart-type");
    var type = elem.options[elem.selectedIndex].value;

    console.log(type);

    chartWrapper.setType(type);
    chartWrapper.fullRefresh();
}

// Sidebar functions ------------------------------------------------------------------------------------

function openSidebar() {
    document.getElementById("main").style.marginLeft = "25%";

    document.getElementById("sidebar").style.width = "25%";
    document.getElementById("sidebar").style.display = "block";

    document.getElementById("overlay").style.display = "block";
}
function closeSidebar() {
    document.getElementById("main").style.marginLeft = "0%";

    document.getElementById("sidebar").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}