
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

        var options = {
            events: [] // do not show pop-ups
        };

        chartWrapper = new ChartWrapper(id, t, options, null);
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

function toArray(obj) {
    var array = [];
    // iterate backwards ensuring that length is an UInt32
    for (var i = obj.length >>> 0; i--;) {
        array[i] = obj[i];
    }
    return array;
}

function pageLoad() {
    window.initPreviewCharts();

    var charts = toArray(document.getElementsByClassName('chart-preview'));

    charts.forEach(function(item, index) {
        item.addEventListener('click', function(){
            selectChart(testIds[index]);
        });
    });
}

// Add NavBar generation after page load w/o overriding.
if(window.attachEvent) {
    window.attachEvent('onload', pageLoad);
} else {
    if(window.onload) {
        var currentOnLoad = window.onload;
        window.onload = function(evt) {
            currentOnLoad(evt);
            pageLoad();
        };
    } else {
        window.onload = pageLoad;
    }
}