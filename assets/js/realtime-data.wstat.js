

function onRealTimeDataLoad() {

}

if(window.attachEvent) {
    window.attachEvent('onload', onRealTimeDataLoad());
} else {
    if(window.onload) {
        let currentOnLoad = window.onload;
        window.onload = function(currentOnLoad, evt) {
            currentOnLoad(evt);
            onRealTimeDataLoad();
        }.bind(null, currentOnLoad);
    } else {
        window.onload = function(evt){onRealTimeDataLoad();};
    }
}

function exportChartAsPng() {
    try {
        let chart = document.getElementById(CHART_ID);
        let urlBase64Png = chart.toDataURL("image/png");
        let link = document.createElement('a');
        link.download = "chart.png";
        link.href = urlBase64Png;
        link.click();
    }
    catch (err) {
        console.log("Export fail");
    }
}

/**
var chartWrapper;

// Test data ------------------------------------------------------------------------------


var testData = [12, 19, 3, 5, 2, 3];
var testLabels = ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"];
var testDatasetLabel = '# of votes';
var testId = 'chart';
var testType = 'bar';

// Functions ------------------------------------------------------------------------------


// Initializes chart with mock-up data
function initTestChart() {
    chartWrapper = new ChartWrapper(testId, testType, null, null);

    chartWrapper.buildDataSingle(testLabels, testDatasetLabel, testData);

    chartWrapper.render();
}

// Changes chart type to the one specified by #chart-type element
function changeChartType() {
    var elem = document.getElementById("chart-type");
    var type = elem.options[elem.selectedIndex].value;

    chartWrapper.setType(type);
    chartWrapper.fullRefresh();
}

// Sidebar functions ------------------------------------------------------------------------------------

function openSidebar() {
    // document.getElementById("main").style.marginLeft = "25%";

    document.getElementById("sidebar").style.display = "block";
    document.getElementById("sidebar-overlay").style.display = "block";
}
function closeSidebar() {
    // document.getElementById("main").style.marginLeft = "0%";

    document.getElementById("sidebar").style.display = "none";
    document.getElementById("sidebar-overlay").style.display = "none";
}

// Modal functions ---------------------------------------------------------------------------------------

function openModal() {
    document.getElementById("chart-element-modal").style.display = "block";
    document.getElementById("modal-overlay").style.display = "block"
}

function closeModal() {
    document.getElementById("chart-element-modal").style.display = "none";
    document.getElementById("modal-overlay").style.display = "none"
}


// Add NavBar generation after page load w/o overriding.
if(window.attachEvent) {
    window.attachEvent('onload', window.initTestChart);
} else {
    if(window.onload) {
        var currentOnLoad = window.onload;
        window.onload = function(evt) {
            currentOnLoad(evt);
            window.initTestChart();
        };
    } else {
        window.onload = window.initTestChart;
    }
}

*/