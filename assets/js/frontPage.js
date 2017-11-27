var testChart;

function initChart() {

    Chart.defaults.global.tooltips.enabled = false;


    var ctx = document.getElementById("bgChart").getContext('2d');
    testChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["a","a","a","a","a","a","a","a","a","a","a","a","a","a","a","a","a","a","a"],
            datasets: [{
                data: [-25, -30, -23, -22, -17, -18, -16, -13, -17, -18, -15, -17, -22, -19, -21, -23, -18, -17, -15, -15],
                backgroundColor: 'rgba(100, 100, 221, 0.4)',
                borderWidth: 1
            }]
        },
        options: {
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
                        beginAtZero:true,
                        display: false
                    }
                }]
            }
        }
    });

    window.setInterval(myCallback, 1000);
}

function myCallback(){
    var index = Math.floor((Math.random() * 15));
    testChart.data.datasets[0].data[index] = Math.floor((Math.random() * -18) - 10);

    testChart.update();
}