var statisticsBuilder = {

    entities: [],
    data: null,

    init: function (keyFunc, aggregate) {
        this.keyFunc = keyFunc;
        this.aggregate = aggregate;
        this.entities = [];
    },

    add: function (entity) {
        this.entities.push(entity);
    },

    finalize: function (keepNull = false) {
        console.log("Finalizing statistic...");
        this.data = groupBy(this.entities, this.keyFunc, this.aggregate, keepNull);
    }
};


// executes
keyFunc = function (t) {
    try {
        return (t['text'].length / 100 | 0); // integer division hack wtf js
    }
    catch (err) {
        return null;
    }
};

labelFunc = function (key) {
    return key * 100;
};

statisticsBuilder.init(keyFunc, 'count');

fetchData(
    {
        "name": 'Hacker-News',
        "base_url": "https://hacker-news.firebaseio.com"
    },
    'test',
    'topstories',
    function (entity) {
        statisticsBuilder.add(entity);
    },
    function () {
        statisticsBuilder.finalize();

        const testId = 'chart';
        const testType = 'bar';

        chartWrapper = new ChartWrapper(testId, testType, null, null);
        chartWrapper.buildDataFromDict('Random bullshit', labelFunc, statisticsBuilder.data);
        chartWrapper.render();
    },
    10,
    false,
    1
);