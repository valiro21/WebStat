var bgChartWrapper;

var FRONTPAGE_INIT_DATA = [-25, -30, -23, -22, -17, -18, -16, -13, -17, -18, -15, -17, -22, -19, -21, -23, -18, -17, -15, -15];
var FRONTPAGE_BG_COLOR = 'rgba(100, 100, 221, 0.4)';

function initChart() {

    Chart.defaults.global.tooltips.enabled = false;

    var bgChartOptions = {
        legend: {
            display: false,
            labels: {
                padding: 0
            }
        },
        scales: {
            xAxes: [{
                gridLines: {
                    display: false,
                    drawBorder: false
                },
                barPercentage: 1.0,
                categoryPercentage: 1.0,
                ticks: {
                    padding: 0,
                    beginAtZero: true,
                    display: false
                }
            }],
            yAxes: [{
                gridLines: {
                    padding: 0,
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    beginAtZero: true,
                    display: false
                }
            }]
        }
    };

    var bgChartData = {
        labels: ["a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a"],
        datasets: [{
            data: FRONTPAGE_INIT_DATA,
            backgroundColor: FRONTPAGE_BG_COLOR
        }]
    };

    bgChartWrapper = new ChartWrapper('bgChart', 'bar', bgChartOptions, bgChartData);

    bgChartWrapper.render();

    window.setInterval(bgChartWrapper.changeDataRandom.bind(bgChartWrapper), 1000, -28, -10);
}