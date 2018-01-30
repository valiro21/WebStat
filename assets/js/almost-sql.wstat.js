let aggregates = {
    'min' : {
        init : function () {
            this._val = null;
        },
        add : function (elem) {
            this._val = Math.min(this._val, elem);
        },
        getResult : function () {
            return this._val;
        }
    },

    'max' : {
        init : function () {
            this._val = null;
        },
        add : function (elem) {
            this._val = Math.max(this._val, elem);
        },
        getResult : function () {
            return this._val;
        }
    },

    'average' : {
        init : function () {
            this._val = 0;
            this._cnt = 0;
        },
        add : function (elem) {
            this._val += elem;
            this._cnt += 1;
        },
        getResult : function () {
            return this._val / this._cnt;
        }
    },

    'sum' : {
        init : function () {
            this._val = 0;
        },
        add : function (elem) {
            this._val += elem;
        },
        getResult : function () {
            return this._val;
        }
    },

    'count' : {
        init : function () {
            this._cnt = 0;
        },
        add : function (elem) {
            this._cnt += 1;
        },
        getResult : function () {
            return this._cnt;
        }
    }
};

aggregates['cnt'] = aggregates['count'];
aggregates['avg'] = aggregates['average'];


function applyAggregate(arr, keyValFunc, all, aggregate) {
    try {
        let aggrObj = aggregates[aggregate];

        aggrObj.init();

        arr.forEach(function (t) {
            aggrObj.add(keyValFunc(t, all).val);
        });

        return aggrObj.getResult();
    }
    catch (err) {
        console.log(err);
        return null;
    }
}

//----------------------------------------------------------------------------------------------------------------------
//------ [ GROUP BY ] --------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
function groupBy(arr, keyValFunc, aggregate, keepNull = false) {

    let grouped = {};

    arr.forEach(function (t) {
        let group = keyValFunc(t, arr).key;

        if (!grouped[group]) {
            grouped[group] = [];
        }

        grouped[group].push(t);
    });

    let ans = {};

    for (let groupKey in grouped) {
        ans[groupKey] = applyAggregate(grouped[groupKey], keyValFunc, arr, aggregate);
    }

    if (!keepNull) {
        if (ans[null])
            delete ans[null];
        if (ans[undefined])
            delete ans[undefined];
    }
    return ans;
}