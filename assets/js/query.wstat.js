if(typeof(String.prototype.strip) === "undefined")
{
    String.prototype.strip = function(character)
    {
        var regexp = new RegExp("^" + character + "+|" + character + "+$");
        return String(this).replace(regexp, '').replace(regexp, '');
    };
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
    var entity = localStorage.getItem(namespace + '/' + entity_name);

    if (entity === undefined || entity === null) {
        return null;
    }

    return JSON.parse(entity);
}

function hasEntity(namespace, entity_name) {
    var entity = localStorage.getItem(namespace + '/' + entity_name);

    return !(entity === undefined || entity === null);
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

function build_instance_entity(domain_namespace, entity_name, entity_id) {
    var instance_entity = getEntity(domain_namespace, entity_name);
    instance_entity["_id"] = entity_id;
    instance_entity["_type"] = entity_name;

    var endpoint = instance_entity['endpoint'];
    endpoint = endpoint.replace("{id}", entity_id);
    instance_entity['endpoint'] = endpoint;

    return instance_entity;
}

function join_url(base_url, endpoint) {
    return base_url.strip('/') + '/' + endpoint.strip('/');
}


function fetchData(domain, statistic_name, primary_entity_name, done_callback, delay, overrideCache) {
    var entity_request_queue = [];

    var primary_entity = getEntity(domain['name'], primary_entity_name);
    var fetched_entities = [0];
    primary_entity['_id'] = 0;

    var start = function fetchEntity(entity) {
        var url = join_url(domain["base_url"], entity["endpoint"]);

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = (function(entity) {
            var base_entity = entity;
            return function () {
                if (this.readyState === 4 && this.status === 200) {
                    var json_data = JSON.parse(this.responseText);
                    json_data["_type"] = entity["_type"];
                    json_data["_id"] = entity["_id"];

                    saveEntity(statistic_name, json_data);

                    forEachSubentity(json_data, base_entity["root"], function(entity_name, entity_id) {
                        if(fetched_entities.indexOf(entity_id) !== -1 || (!overrideCache && hasEntity(statistic_name, entity_id))) {
                            return;
                        }
                        fetched_entities.push(entity_id);

                        var next_entity = build_instance_entity(domain['name'], entity_name, entity_id);
                        next_entity["_parent"] = json_data["_id"];
                        entity_request_queue.push(next_entity);
                    });

                    setTimeout(function() {
                        if (entity_request_queue.length === 0) {
                            done_callback();
                        }
                        else {
                            var entity = entity_request_queue.shift();
                            console.log("Starting fetching entity " + JSON.stringify(entity));
                            saveEntity(statistic_name, entity['_id']);
                            fetchEntity(entity);
                        }
                    }, delay);
                }
            }
        })(entity);

        xhttp.open("GET", url, true);
        xhttp.send();
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
    "root": JSON.parse('{"kids":[{"comment": "entity"}], "descendants": "integer"}'),
    "endpoint": "/v0/item/{id}.json",
    "_type": 'story'
};

var comment = {
    "root": JSON.parse('{"kids":[{"comment": "entity"}]}'),
    "endpoint": "/v0/item/{id}.json",
    "_type": "comment"
};

saveEntity('Hacker-News', primary_entity);
saveEntity('Hacker-News', story);
saveEntity('Hacker-News', comment);

fetchData(
    {
        "name": 'Hacker-News',
        "base_url": "https://hacker-news.firebaseio.com"
    },
    'test',
    'topstories',
    function () { console.log("Done"); },
    10,
    false
);