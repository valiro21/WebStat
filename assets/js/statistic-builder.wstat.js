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
            'Random bullshit',
            this.labelFunc,
            this.data
        );

        this.chart.update();
    }
};


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

// labelFunc = function (key) {
//     return key * interval;
// };

const testId = 'chart';
const testType = 'bar';

let chartWrapper = new ChartWrapper(testId, testType, null, null);
statisticsBuilder.init(keyValFunc, labelFunc, 'sum', chartWrapper, 1000);

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

localStorage.clear();

saveEntity('Facebook', self_posts_page);
saveEntity('Facebook', post);
saveEntity('Facebook', post_likes);
saveEntity('Facebook', like);

fetchData(
    {
        "name": 'Facebook',
        "base_url": "https://graph.facebook.com/v2.11",
        "parameters": {
            "access_token": "EAACEdEose0cBAAwH1BjgX1MMvnPHZCuCy4tpZCgqNGXXzZBZA7GhtWQb4PJvV93R24Be3x3dcxUpQ9ygWcD4ffU6CixGTXHI9xNiZASRUhTmtatozmZCtNzNAxDQRyiyopw9nL5iSRqrNeI1aZCBXOVF0EgS67vhwz6o6faU6BKmrdhRioDHsBm9FbKDsa77qAZD"
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