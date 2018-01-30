const CHART_ID = 'chart';

let statisticsBuilder = {

    entities: [],
    data: null,
    chart: null,
    intervalId: null,
    keyValFunc: null,
    labelFunc: null,
    keepNull: false,

    /**
     *
     * @param keyValFunc {function}
     * @param labelFunc {function}
     * @param aggregate some bullshit structure...
     * @param chartWrapper {ChartWrapper}
     * @param refreshRate {int}
     */
    init: function (keyValFunc, labelFunc, aggregate, chartWrapper, refreshRate = 1000) {
        this.keyValFunc = keyValFunc;
        this.labelFunc = labelFunc;
        this.aggregate = aggregate;
        this.entities = [];

        this.chart = chartWrapper;
        this.chart.render();

        if (refreshRate > 0)
            this.intervalId = setInterval( this.refresh.bind(this), refreshRate);
        else
            this.intervalId = null;
    },

    add: function (entity) {
        this.entities.push(entity);
    },

    finalize: function (keepNull = false) {
        console.log("Finalizing statistic...");

        if (this.intervalId)
            clearInterval(this.intervalId);

        this.refresh()
    },

    buildData: function () {
        this.data = groupBy(this.entities, this.keyValFunc, this.aggregate, this.keepNull);
    },

    refresh: function () {

        this.buildData();

        this.chart.buildDataFromDict(
            'Data',
            this.labelFunc,
            this.data
        );

        this.chart.update();
    }
};

function initStatistic(data) {

    let accessToken = data['access-token'];
    let statisticName = data['statistic-name'];
    let domain = data['domain'];
    let entity = data['entity'];
    let chartType = data['chart-type'];
    let updateInterval = data['update-interval'];
    let keyStr = data['key'];
    let valStr = data['value'];
    let labelStr = data['label'];
    let aggrStr = data['aggr-func'];

    let buildKeyValFunc = function (keyStr, valStr) {
        return function (t, all) {
            try {
                return {key: t[keyStr], val: t[valStr]};
            }
            catch (err) {
                return {key: null, val: null};
            }

        }
    };

    let buildLabelFunc = function (labelStr) {
        return function (key) {
            return key; // TODO
        }
    };

    let keyValFunc = buildKeyValFunc(keyStr, valStr);
    let labelFunc = buildLabelFunc(labelStr);


    let chartWrapper = new ChartWrapper(CHART_ID, chartType, null, null);
    // mainChart = chartWrapper.chart;
    statisticsBuilder.init(keyValFunc, labelFunc, aggrStr, chartWrapper, updateInterval);


    // saveEntity('Facebook', self_posts_page);
    // saveEntity('Facebook', post);
    // saveEntity('Facebook', post_likes);
    // saveEntity('Facebook', like);

    console.log(domain);
    let domainData = getDomain(domain);
    console.log('DOMAIN:', domainData);

    if (accessToken) {
        domainData['parameters']['access_token'] = accessToken;
    }

    fetchData(
        domainData,
        statisticName,
        entity,
        function (ent) {
            console.log("Add", ent);
            statisticsBuilder.add(ent);
        },
        function () {
            console.log("Finalized statistic.");
            statisticsBuilder.finalize();
        },
        10,
        true, // TODO change to false
        3
    )
    // fetchData(
    //     {
    //         "name": 'Facebook',
    //         "base_url": "https://graph.facebook.com/v2.11",
    //         "parameters": {
    //             "access_token": "EAACEdEose0cBAAwH1BjgX1MMvnPHZCuCy4tpZCgqNGXXzZBZA7GhtWQb4PJvV93R24Be3x3dcxUpQ9ygWcD4ffU6CixGTXHI9xNiZASRUhTmtatozmZCtNzNAxDQRyiyopw9nL5iSRqrNeI1aZCBXOVF0EgS67vhwz6o6faU6BKmrdhRioDHsBm9FbKDsa77qAZD"
    //         }
    //     },
    //     'test',
    //     'self_posts_page',
    //     function (entity) {
    //         console.log("Fetched entity: ", entity);
    //         statisticsBuilder.add(entity);
    //     },
    //     function () {
    //         console.log("Done");
    //         statisticsBuilder.finalize();
    //     },
    //     10,
    //     true,
    //     3
    // );
}
// executes

const interval = 10;

// keyFunc = function (t) {
//     try {
//         return (t['text'].length / interval | 0); // integer division hack wtf js
//     }
//     catch (err) {
//         return null;
//     }
// };

// labelFunc = function (key) {
//     return key * interval;
// };

// const testId = 'chart';
// const testType = 'bar';

let debug = false;

if (!debug) {

    let statisticName = getParameterByName('statistic');
    let statisticData = localStorage.getItem(statisticName); // TODO: change
    statisticData = JSON.parse(statisticData);
    console.log(statisticData);
    initStatistic(statisticData);
}
else {

    // DEBUG PURPOSES
    getFromEntities = function (entities, type, id) {
        let ans = null;

        for (let i = 0; i < entities.length; ++i) {
            let t = entities[i];

            if (t._type === type && t._id === id){
                return t;
            }
        }
        return ans;
    };

    keyValFunc = function (t, all) {
        try {
            if (t._type !== "post_likes")
                return {key:null, val:null};

            let parentFullId = t._parent;
            let temp = parentFullId.split("/");

            let parentType = temp[0];
            let parentId = temp[1];

            let ent = getFromEntities(all, parentType, parentId);
            return {key : ent.created_time, val : t.data.length};
        }
        catch (err) {
            return {key:null, val:null};
        }
    };

    labelFunc = function (key) {
        return key;
    };

    saveEntity('Facebook', self_posts_page);
    saveEntity('Facebook', post);
    saveEntity('Facebook', post_likes);
    saveEntity('Facebook', like);

    let chartWrapper = new ChartWrapper(CHART_ID, 'bar', null, null);
    // mainChart = chartWrapper.chart;
    statisticsBuilder.init(keyValFunc, labelFunc, 'sum', chartWrapper, 1000);

    fetchData(
        {
            "name": 'Facebook',
            "base_url": "https://graph.facebook.com/v2.11",
            "parameters": {
                "access_token": "EAACEdEose0cBAHbftn79R1d0kNRRXBXSy69kAAUdaFqf0hRqbofraFJ4ri425vRpTOIhwYCdPIlrVH8SsfPvoxdA8krRKMu1767SwwJGMQzr6deoMrkjOFwPMrJgz0iedWbHO5MpHVc3oeLLnREEis50HRI7VR1LIad7mfSen2Hb8ZBuA7gPLDyd0gzkZD"
            }
        },
        'test',
        'self_posts_page',
        function (entity) {
            console.log("Fetched entity: ", entity);
            statisticsBuilder.add(entity);
        },
        function () {
            console.log("Done");
            statisticsBuilder.finalize();
        },
        10,
        true,
        3
    );
}


//----------------------------------------------------------------------------------------------------------------------
//------ [ Hacker News ] -----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
// saveEntity('Hacker-News', primary_entity);
// saveEntity('Hacker-News', story);
// saveEntity('Hacker-News', comment);
//
// fetchData(
//     {
//         "name": 'Hacker-News',
//         "base_url": "https://hacker-news.firebaseio.com"
//     },
//     'test',
//     'topstories',
//     function (entity) {
//         // console.log(entity);
//         statisticsBuilder.add(entity);
//     },
//     function () {
//         statisticsBuilder.finalize();
//     },
//     10,
//     false,
//     2
// );

//----------------------------------------------------------------------------------------------------------------------
//------ [ Facebook ] --------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------

// localStorage.clear();

// saveEntity('Facebook', self_posts_page);
// saveEntity('Facebook', post);
// saveEntity('Facebook', post_likes);
// saveEntity('Facebook', like);

// console.log("DOMAIN:", getDomain('Facebook'));

