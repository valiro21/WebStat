// Constants ------------------------------------------------------------------------------

const BACKGROUND_ALPHA = 0.2;

const BORDER_ALPHA = 1.0;
const BORDER_WIDTH = 1.0;

const CHART_TYPES = ['pie', 'bar', 'doughnut', 'line', 'radar'];

// Class implementation -------------------------------------------------------------------

ChartWrapper = function(chartElementId, type, options, data) {
    this.id = chartElementId;
    this.context = document.getElementById(chartElementId).getContext('2d');
    this.chart = null;
    this.type = type;
    this.options = options;
    this.data = data;
};

ChartWrapper.prototype.render = function () {
    this.chart = new Chart(this.context, {
        type: this.type,
        data: this.data,
        options: this.options
    });
};

ChartWrapper.prototype.destroy = function () {
    this.chart.destroy();
};

ChartWrapper.prototype.update = function () {
    this.chart.update();
};

ChartWrapper.prototype.fullRefresh = function () {
    this.destroy();
    this.render();
};

// Random changes ------------------------------------------------------------------------------------------

ChartWrapper.prototype.changeDataRandom = function (min, max) {
    let dsIndex = getRandomInt(0, this.data.datasets.length - 1);
    let ds = this.data.datasets[dsIndex];

    let dataIndex = getRandomInt(0, ds.data.length - 1);

    this.setData(dsIndex, dataIndex, min, max);
    this.update();
};

ChartWrapper.prototype.setData = function (dsIndex, ds, min, max) {
    this.data.datasets[dsIndex].data[ds] = getRandomInt(min, max);
};


ChartWrapper.prototype.changeTypeRandom = function () {
    this.destroy();
    this.setType(randomChoice(CHART_TYPES));
    this.render();
};

ChartWrapper.prototype.setType = function (newType) {
    this.type = newType;
};

// Data builders ------------------------------------------------------------------------------------------

ChartWrapper.prototype.buildData = function (labels, datasets) {

    // questionable copy mechanism that doesn't entirely refresh chart
    let copy = function (dest, src) {
        for (let k in src) {
            dest[k] = src[k];
        }
    };

    let copyRec2 = function (dest, src) {
        for (let k in src) {
            copy(dest[k], src[k]);
        }
    };

    let data = {
        labels: labels,
        datasets: datasets
    };
    
    this.data = data;

    try {
        copy(this.chart.data.labels, labels);
        copyRec2(this.chart.data.datasets, datasets);
    }
    catch (err) {
        this.chart.data = data;
    }

    return data;
};

ChartWrapper.prototype.buildDataSingle = function (chartLabels, datasetLabel, values) {

    let backgroundColors = null;
    let borderColors = null;


    // TODO: colorsFunc as argument, generator for colors, based on values

    try {
        backgroundColors = this.chart.data.datasets[0].backgroundColor;
        borderColors = this.chart.data.datasets[0].borderColor;

        console.log("COLORS: ");
        console.log(backgroundColors);
        console.log(borderColors);

        if (backgroundColors.length < values.length || borderColors.length < values.length) {
            throw "Empty colors";
        }
    }
    catch (err) {
        let rgbColors = getRandomColors(values.length);
        borderColors = getRgbaFromRgbArray(rgbColors, BORDER_ALPHA);
        backgroundColors = getRgbaFromRgbArray(rgbColors, BACKGROUND_ALPHA);
    }

    let datasets = [{
        label: datasetLabel,
        data: values,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: BORDER_WIDTH
    }];

    return this.buildData(chartLabels, datasets);
};

ChartWrapper.prototype.buildDataFromDict = function (datasetLabel, labelFunc, data) {

    let chartLabels = Object.keys(data);
    let values = [];

    chartLabels.forEach(function (t) {
       values.push(data[t]);
    });

    chartLabels.forEach(function (_, i, arr) {
        arr[i] = labelFunc(arr[i]);
    });

    return this.buildDataSingle(chartLabels, datasetLabel, values);
};