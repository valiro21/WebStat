if(typeof(String.prototype.strip) === "undefined")
{
    String.prototype.strip = function(character)
    {
        var regexp = new RegExp("^" + character + "+|" + character + "+$");
        return String(this).replace(regexp, '').replace(regexp, '');
    };
}

function forEachSubentity(data_json, entity, callback) {
    if (Array.isArray(entity)) {
        data_json.forEach(function(val) {
            forEachSubentity(val, entity[0], callback);
        });
        return;
    }

    if (typeof(entity) !== "object") {
        return;
    }

    var keys = Object.keys(entity);

    for (var idx = 0; idx < keys.length; idx++) {
        var key = keys[idx];
        var child_entity = entity[key];

        if (child_entity === "entity") {
            callback(key, data_json);
        }
        else if (data_json.hasOwnProperty(key)) {
            if (typeof(child_entity) === "object") {
                forEachSubentity(data_json[key], child_entity, callback);
            }
        }
    }
}

function build_instance_entity(namespace, entity_name, entity_id) {
    var instance_entity = getEntity(namespace, entity_name);

    var endpoint = instance_entity['endpoint'];
    endpoint = endpoint.replace("{id}", entity_id);
    instance_entity['endpoint'] = endpoint;

    return instance_entity;
}


function saveEntity(namespace, entity) {
    if (entity.hasOwnProperty('_id')) {
        localStorage.setItem(namespace + '/' + entity['_id'], JSON.stringify(entity));
    }
    else {
        localStorage.setItem(namespace + '/' + entity['_type'], JSON.stringify(entity));
    }
}

function getEntity(namespace, entity_name) {
    return JSON.parse(localStorage.getItem(namespace + '/' + entity_name))
}

function join_url(base_url, endpoint) {
    return base_url.strip('/') + '/' + endpoint.strip('/');
}

function sleep(ms) {
    return new Promise(function(resolve) { setTimeout(resolve, ms)});
}


function fetchData(domain, statistic_name, primary_entity_name, done_callback, delay) {
    var entity_request_queue = [];

    var total_entities_count = 0;
    var primary_entity = getEntity(domain['name'], primary_entity_name);
    primary_entity['_id'] = ++total_entities_count;

    var start = function fetchEntity(entity) {
        var url = join_url(domain["base_url"], entity["endpoint"]);

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = (function(entity) {
            var base_entity = entity;
            return function () {
                if (this.readyState === 4 && this.status === 200) {
                    var json_data = JSON.parse(this.responseText);

                    forEachSubentity(json_data, base_entity["root"], function(entity_name, entity_id) {
                        entity_request_queue.push(build_instance_entity(domain['name'], entity_name, entity_id, ++total_entities_count));
                    });

                    setTimeout(function() {
                        if (entity_request_queue.length === 0) {
                            done_callback();
                        }
                        else {
                            var entity = entity_request_queue.shift();
                            console.log("Starting fetching entity " + JSON.stringify(entity));
                            fetchEntity(entity);
                        }
                    }, delay);
                }
            }
        })(entity);

        xhttp.open("GET", url, true);
        xhttp.send();

        saveEntity(statistic_name, entity);
    };

    start(primary_entity);
}

var primary_entity = {
    "root": JSON.parse('[{"story": "entity"}]'),
    "endpoint": "/v0/topstories.json",
    "edges": [],
    "_type": 'topstories'
};

var story = {
    "root": JSON.parse('{"kids":["integer"], "descendants": "integer"}'),
    "endpoint": "/v0/item/{id}.json",
    "_type": 'story'
};

saveEntity('Hacker-News', primary_entity);
saveEntity('Hacker-News', story);

fetchData(
    {
        "name": 'Hacker-News',
        "base_url": "https://hacker-news.firebaseio.com"
    },
    'test',
    'topstories',
    function () { console.log("Done"); },
    100);