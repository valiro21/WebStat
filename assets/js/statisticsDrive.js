function Statistic(img, url, title) {
    this.img = img;
    this.url = url;
    this.title = title;
}

Statistic.prototype.createDropDownEditButton = function() {
    var dropDownMenu = document.createElement('div');
    dropDownMenu.setAttribute('class', 'edit');

    var dropDownButton = document.createElement('button');
    dropDownButton.setAttribute('class', 'editButton');
    dropDownButton.textContent = '...';

    var dropDownContent = document.createElement('div');
    dropDownContent.setAttribute('class', 'editContent');

    var deleteButton = document.createElement('button');
    deleteButton.setAttribute('class', 'editButton');
    deleteButton.textContent = 'Delete';

    var editButton = document.createElement('button');
    editButton.setAttribute('class', 'editButton');
    editButton.textContent = 'Edit';

    dropDownMenu.appendChild(dropDownButton);
    dropDownMenu.appendChild(dropDownContent);
    dropDownContent.appendChild(deleteButton);
    dropDownContent.appendChild(editButton);

    return dropDownMenu;
};

Statistic.prototype.generateElement = function() {
    var statisticElementLink = document.createElement('a');
    statisticElementLink.setAttribute('href', this.url);

    var statisticElement = document.createElement('div');
    statisticElementLink.appendChild(statisticElement);
    statisticElement.setAttribute('class', 'entry');

    var imgElement = document.createElement('img');
    imgElement.setAttribute('src', this.img);
    imgElement.setAttribute('height', '250px');
    imgElement.setAttribute('width', '250px');

    var textElement = document.createElement('div');
    textElement.setAttribute('class', 'container');

    var title = document.createElement('div');
    title.setAttribute('class', 'title');
    title.textContent = this.title;
    textElement.appendChild(title);

    textElement.appendChild(this.createDropDownEditButton());
    statisticElement.appendChild(imgElement);
    statisticElement.appendChild(textElement);

    return statisticElementLink;
};

var StatisticsDrive = (function() {
    var instance;

    function createAddButton() {
        var addButtonRedirect = document.createElement('a');
        addButtonRedirect.setAttribute('href', '../pages/StatisticConfig.html');

        var addButton = document.createElement('div');
        addButtonRedirect.appendChild(addButton);

        addButton.setAttribute('class', 'addButton');

        var imgElement = document.createElement('img');
        imgElement.setAttribute('src', '../assets/img/cross.png');
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

        that.statistics = [new Statistic('../assets/img/chart-1.png', '../pages/RealTimeData.html', 'Highest traffic'),
            new Statistic('../assets/img/chart-2.png', '../pages/RealTimeData.html', 'Most text'),
            new Statistic('../assets/img/chart-3.png', '../pages/RealTimeData.html', 'Data types')];

        that.addStatistic = function() {
        };

        that.deleteStatistic = function() {
        };

        that.getStatistic = function() {
        };

        that.renderStatistics = function() {
            var statisticsElement = document.createElement('div');
            statisticsElement.setAttribute('class', 'displayContainer');

            that.statistics.forEach(function(item) {
                statisticsElement.appendChild(item.generateElement());
            });
            statisticsElement.appendChild(createAddButton());
            document.getElementById('displayContainer').appendChild(statisticsElement);
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
