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


function fetchData(domain, statistic_name, primary_entity_name, fetch_callback, done_callback, delay, overrideCache, maxDepth) {
    var entity_request_queue = [];

    var primary_entity = getEntity(domain['name'], primary_entity_name);
    var fetched_entities = [0];
    primary_entity['_id'] = 0;

    var start = function fetchEntity(entity, depth) {
        var url = join_url(domain["base_url"], entity["endpoint"]);

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = (function(entity, depth) {
            var base_entity = entity;
            return function () {
                if (this.readyState === 4 && this.status === 200) {
                    var json_data = JSON.parse(this.responseText);
                    json_data["_type"] = entity["_type"];
                    json_data["_id"] = entity["_id"];

                    saveEntity(statistic_name, json_data);
                    fetch_callback(json_data);

                    var fetchSubentities = function(json_data, entity, depth) {
                        if (depth === maxDepth) {
                            return;
                        }

                        forEachSubentity(json_data, entity["root"], function(entity_name, entity_id) {
                            if(fetched_entities.indexOf(entity_id) !== -1) {
                                return;
                            }
                            fetched_entities.push(entity_id);

                            if (!overrideCache && hasEntity(statistic_name, entity_id)) {
                                var cachedEntity = getEntity(statistic_name, entity_id);
                                fetch_callback(cachedEntity);

                                var abstractEntity = getEntity(domain['name'], entity_name);

                                fetchSubentities(cachedEntity, abstractEntity, depth + 1);
                                return;
                            }

                            var next_entity = build_instance_entity(domain['name'], entity_name, entity_id);
                            next_entity["_parent"] = json_data["_id"];
                            entity_request_queue.push([depth + 1, next_entity]);
                        });
                    };

                    fetchSubentities(json_data, base_entity, depth);

                    setTimeout(function() {
                        if (entity_request_queue.length === 0) {
                            console.log("Total of " + fetched_entities.length.toString() + " items.");
                            done_callback();
                        }
                        else {
                            var record = entity_request_queue.shift();
                            var depth = record[0];
                            var entity = record[1];
                            saveEntity(statistic_name, entity['_id']);
                            fetchEntity(entity, depth);
                        }
                    }, delay);
                }
            }
        })(entity, depth);

        xhttp.open("GET", url, true);
        xhttp.send();
    };

    start(primary_entity, 0);
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
    function (entity) { console.log("Fetched entity: ", entity); },
    function () { console.log("Done"); },
    10,
    false,
    2
);