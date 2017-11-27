function Statistic(img, url, title) {
    this.img = img;
    this.url = url;
    this.title = title;
}

Statistic.prototype.generateElement = function() {
    var statisticElementLink = document.createElement('a');
    statisticElementLink.setAttribute('href', this.url);

    var statisticElement = document.createElement('div');
    statisticElementLink.appendChild(statisticElement);
    statisticElement.setAttribute('class', 'statisticEntry');

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

    return statisticElementLink;
};

var StatisticsDrive = (function() {
    var instance;

    function createAddButton() {
        var addButtonRedirect = document.createElement('a');
        addButtonRedirect.setAttribute('href', '../pages/statisticsConfig.html');

        var addButton = document.createElement('div');
        addButtonRedirect.appendChild(addButton);

        addButton.setAttribute('class', 'addStatisticsButton');

        var imgElement = document.createElement('img');
        imgElement.setAttribute('src', 'https://goo.gl/LkaMqy');
        imgElement.setAttribute('style', 'margin-top: 50px');
        imgElement.setAttribute('height', '150px');
        imgElement.setAttribute('width', '150px');

        var textElement = document.createElement('div');
        textElement.setAttribute('class', 'container');

        var title = document.createElement('h4');
        title.textContent = 'New Statistic';
        textElement.appendChild(title);

        addButton.appendChild(imgElement);
        addButton.appendChild(textElement);
        return addButtonRedirect;
    }

    function createInstance() {
        var that = {};

        that.statistics = [new Statistic('https://lh3.googleusercontent.com/Ned_Tu_ge6GgJZ_lIO_5mieIEmjDpq9kfgD05wapmvzcInvT4qQMxhxq_hEazf8ZsqA=w300', 'https://www.youtube.com/', 'Youtube'),
            new Statistic('http://is1.mzstatic.com/image/thumb/Purple128/v4/71/c6/d4/71c6d492-b0d8-7136-75b8-5198b11a5023/source/175x175bb.jpg', 'https://www.facebook.com/', 'Facebook')];

        that.addStatistic = function() {
        };

        that.deleteStatistic = function() {
        };

        that.getStatistic = function() {
        };

        that.renderStatistics = function() {
            var statisticsElement = document.createElement('div');
            statisticsElement.setAttribute('class', 'statisticsContainer');

            that.statistics.forEach(function(item) {
                statisticsElement.appendChild(item.generateElement());
            });
            statisticsElement.appendChild(createAddButton());
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
