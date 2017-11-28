
var chartWrappers = [];

// Test data ------------------------------------------------------------------------------


var testData = [12, 19, 3, 5, 2, 3];
var testLabels = ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"];
var testDatasetLabel = '# of votes';
var testIds = [];
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

        testIds.push(id);
        chartWrappers.push(chartWrapper);
    });
}

function setSelectedChart(id) {
    var elem = document.getElementById(id);
    elem.setAttribute('selected', 'selected');
}

function setUnselectedChart(id) {
    var elem = document.getElementById(id);
    elem.removeAttribute('selected');
}

function selectChart(id) {
    testIds.forEach(function (t) {
        if (t === id) {
            setSelectedChart(t);
        }
        else {
            setUnselectedChart(t);
        }
    })
}

// Add NavBar generation after page load w/o overriding.
if(window.attachEvent) {
    window.attachEvent('onload', window.initPreviewCharts);
} else {
    if(window.onload) {
        var currentOnLoad = window.onload;
        window.onload = function(evt) {
            currentOnLoad(evt);
            window.initPreviewCharts();
        };
    } else {
        window.onload = window.initPreviewCharts;
    }
}