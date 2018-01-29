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
        localStorage.setItem(join_url(namespace, join_url(entity["_type"], entity['_id'])), JSON.stringify(entity));
    }
    else {
        localStorage.setItem(join_url(namespace, entity["_type"]), JSON.stringify(entity));
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


function getEntityId(data_json, entity) {
    if (typeof(entity) !== "object") {
        return null;
    }

    var keys = Object.keys(entity);

    for (var idx = 0; idx < keys.length; idx++) {
        var key = keys[idx];
        var child_entity = entity[key];

        if (child_entity === "id") {
            return data_json[key];
        }
    }

    return null;
}


function forEachEntityLink(domain, data_json, entity, callback) {
    if (Array.isArray(entity)) {
        data_json.forEach(function(val) {
            forEachEntityLink(domain, val, entity[0], callback);
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

        if (child_entity === "entity_id" || child_entity === "entity" || child_entity === "entity_url") {
            if (child_entity === "entity") {
                data_json = getEntityId(data_json, getEntity(domain["name"], key)["root"]);
            }

            callback(key, data_json, child_entity);
        }
        else if (data_json.hasOwnProperty(key)) {
            if (typeof(child_entity) === "object") {
                forEachEntityLink(domain, data_json[key], child_entity, callback);
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
    return base_url.toString().strip('/') + '/' + endpoint.toString().strip('/');
}

function hasId(id, entity_name, taken_ids) {
    for (var i = 0; i < taken_ids.length; i++) {
        if(taken_ids[i][0] === entity_name && taken_ids[i][1] === id) {
            return true;
        }
    }
    return false;
}

function generate_random_id(entity_name, taken_ids) {
    var x = taken_ids.length > 0 ? taken_ids[0][1] : 0;
    while(hasId(x, entity_name, taken_ids)) {
        x = Math.floor(Math.random() * 1000000000000);
    }

    return x;
}

function build_query(params) {
    if(params === undefined || params === null || params.length === 0) {
        return "";
    }

    return Object.keys(params)
        .map(function(key) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
        })
        .join('&');
}


function fetchData(domain, statistic_name, primary_entity_name, fetch_callback, done_callback, delay, overrideCache, maxDepth) {
    var entity_request_queue = [];

    var primary_entity = getEntity(domain['name'], primary_entity_name);
    primary_entity["endpoint"] = primary_entity["endpoint"] + '?' + build_query(domain["parameters"]);
    var fetched_entities = [[primary_entity_name, 0]];
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

                    var fetchEntityLinks = function(json_data, entity, depth) {
                        if (depth === maxDepth) {
                            return;
                        }

                        var handleEntity = function(entity_name, entity_id, entity_type) {
                            var entity_id_is_generated = false;
                            if (entity_id !== null) {
                                if(fetched_entities.indexOf([entity_name, entity_id]) !== -1) {
                                    return;
                                }
                                fetched_entities.push([entity_name, entity_id]);

                                if (!overrideCache && hasEntity(statistic_name, entity_id)) {
                                    var cachedEntity = getEntity(statistic_name, entity_id);
                                    fetch_callback(cachedEntity);

                                    var abstractEntity = getEntity(domain['name'], entity_name);

                                    if (entity_id !== null && entity_type !== "entity_url") {
                                        abstractEntity["properties"].forEach(function (entity_name) {
                                            depth++;
                                            if (depth === maxDepth) {
                                                depth--;
                                                return;
                                            }
                                            handleEntity(entity_name, entity_id);
                                            depth--;
                                        });
                                    }

                                    fetchEntityLinks(cachedEntity, abstractEntity, depth + 1);
                                    return;
                                }
                            }
                            else {
                                entity_id = generate_random_id(entity_name, fetched_entities);
                                entity_id_is_generated = true;
                            }

                            var next_entity = build_instance_entity(domain['name'], entity_name, entity_id);
                            next_entity["_parent"] = join_url(entity["_type"], entity["_id"]);

                            if (entity_type === "entity_url") {
                                entity_id = entity_id.slice(Math.max(0, entity_id.indexOf('?')));

                                next_entity["endpoint"] = next_entity["endpoint"] + entity_id;
                                next_entity["_id"] = generate_random_id(entity_name, fetched_entities);
                                entity_id_is_generated = true;
                            }

                            if(entity_type !== "entity" && (entity_type === "entity_url" || !entity_id_is_generated)) {
                                if (entity_type !== "entity_url") {
                                    next_entity["endpoint"] = next_entity["endpoint"] + '?' + build_query(domain["parameters"])
                                }

                                entity_request_queue.push([depth + 1, next_entity]);
                            }

                            if (!entity_id_is_generated) {
                                next_entity["properties"].forEach(function (entity_name) {
                                    depth++;
                                    if (depth === maxDepth) {
                                        depth--;
                                        return;
                                    }
                                    handleEntity(entity_name, entity_id);
                                    depth--;
                                });
                            }
                        };

                        forEachEntityLink(domain, json_data, entity["root"], handleEntity);
                    };

                    fetchEntityLinks(json_data, base_entity, depth);

                    setTimeout(function() {
                        if (entity_request_queue.length === 0) {
                            console.log("Total of " + fetched_entities.length.toString() + " items.");
                            done_callback();
                        }
                        else {
                            var record = entity_request_queue.shift();
                            var depth = record[0];
                            var entity = record[1];
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


// ##############################################################
// # ##                    HACKER NEWS                       # ##

var primary_entity = {
    "root": JSON.parse('[{"story": "entity_id"}]'),
    "endpoint": "/v0/topstories.json",
    "properties": [],
    "_type": 'topstories'
};

var story = {
    "root": JSON.parse('{"kids":[{"comment": "entity_id"}], "descendants": "integer"}'),
    "endpoint": "/v0/item/{id}.json",
    "properties": [],
    "_type": 'story'
};

var comment = {
    "root": JSON.parse('{"kids":[{"comment": "entity_id"}]}'),
    "endpoint": "/v0/item/{id}.json",
    "properties": [],
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


// # ##                        END                           # ##
// ##############################################################


// ##############################################################
// # ##                     FACEBOOK                         # ##

var self_posts_page = {
    "root": JSON.parse('{' +
        '"data": [{"post": "entity"}],' +
        '"paging": {"next": {"self_posts_page": "entity_url"}}' +
        '}'),
    "endpoint": "/me/posts",
    "properties": [],
    "_type": 'self_posts_page'
};

var post = {
    "root": JSON.parse('{"id": "id"}'),
    "endpoint": "/{id}",
    "properties": ["post_likes"],
    "_type": 'post'
};

var post_likes = {
    "root": JSON.parse('{"data": [{"like": "entity"}]}'),
    "endpoint": "/{id}/likes",
    "properties": [],
    "_type": "post_likes"
};

var like = {
    "root": JSON.parse('{"id": "id"}'),
    "endpoint": "/{id}",
    "properties": [],
    "_type": "like"
};

saveEntity('Facebook', self_posts_page);
saveEntity('Facebook', post);
saveEntity('Facebook', post_likes);
saveEntity('Facebook', like);

/*fetchData(
    {
        "name": 'Facebook',
        "base_url": "https://graph.facebook.com/v2.11",
        "parameters": {"access_token": ""}
    },
    'test',
    'self_posts_page',
    function (entity) { console.log("Fetched entity: ", entity); },
    function () { console.log("Done"); },
    10,
    true,
    2
);*/


// # ##                        END                           # ##
// ##############################################################
