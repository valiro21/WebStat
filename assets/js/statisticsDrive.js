function Statistic(img, url, title) {
    this.img = img;
    this.url = url;
    this.title = title;
}

Statistic.prototype.generateElement = function() {
    var statisticElement = document.createElement('a');
    statisticElement.setAttribute('href', this.url);

    var imgElement = document.createElement('img');
    imgElement.setAttribute('src', this.img);
    imgElement.setAttribute('height', '250px');
    imgElement.setAttribute('width', '250px');

    var textElement = document.createElement('div');
    textElement.setAttribute('class', 'container');

    var title = document.createElement('h4');
    title.textContent = this.title;
    textElement.appendChild(title);

    statisticElement.appendChild(imgElement);
    statisticElement.appendChild(textElement);

    return statisticElement;
};

var StatisticsDrive = (function() {
    var instance;

    function createInstance() {
        var that = {};

        that.statistics = [new Statistic('https://goo.gl/XcJesg', 'https://goo.gl/XcJesg', 'Mock data 1'),
            new Statistic('https://goo.gl/XcJesg', 'https://goo.gl/XcJesg', 'Mock data 2')];

        that.addStatistic = function() {
        };

        that.deleteStatistic = function() {
        };

        that.getStatistic = function() {
        };

        that.renderStatistics = function() {
            var statisticsElement = document.createElement('div');

            that.statistics.forEach(function(item) {
                statisticsElement.appendChild(item.generateElement());
            });
            document.getElementById('statisticsContainer').appendChild(statisticsElement);
        };

        return that;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

function initStatisticsDrive() {
    StatisticsDrive.getInstance().renderStatistics();
}
