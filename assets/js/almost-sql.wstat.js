var aggregates = {
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


function applyAggregate(arr, keyFunc, aggregate) {

    try {
        var aggrObj = aggregates[aggregate];

        aggrObj.init();

        arr.forEach(function (t) {
            aggrObj.add(keyFunc(t));
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
function groupBy(arr, keyFunc, aggregate, keepNull = false) {

    var grouped = {};

    arr.forEach(function (t) {
        var group = keyFunc(t);

        if (!grouped[group]) {
            grouped[group] = [];
        }

        grouped[group].push(t);
    });

    var ans = {};

    for (var groupKey in grouped) {
        ans[groupKey] = applyAggregate(grouped[groupKey], keyFunc, aggregate);
    }

    if (!keepNull) {
        if (ans[null])
            delete ans[null];
    }
    return ans;
}