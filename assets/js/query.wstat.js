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


function forEachEntityLink(data_json, entity, callback) {
    if (Array.isArray(entity)) {
        data_json.forEach(function(val) {
            forEachEntityLink(val, entity[0], callback);
        });
        return;
    }

    if(typeof(entity) === "string") {
        if (entity.startsWith("entity")) {
            var entity_type = entity.slice(0, entity.indexOf(" "));
            var entity_name = entity.slice(entity.indexOf(' ') + 1);

            callback(entity_name, data_json, entity_type);
        }
    }

    if (typeof(entity) !== "object") {
        return;
    }

    var keys = Object.keys(entity);

    for (var idx = 0; idx < keys.length; idx++) {
        if (data_json.hasOwnProperty(key)) {
            var key = keys[idx];
            var child_entity = entity[key];

            if (typeof(child_entity) === "object") {
                forEachEntityLink(data_json[key], child_entity, callback);
            }
        }
    }
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


function fetchData(domain, statistic_name, primary_entity_name, fetch_callback, done_callback, delay, overrideCache, maxDepth) {
    var entity_request_queue = [];

    function handleEntity(json_data, entity, depth) {
        if (depth === maxDepth) {
            return;
        }

        json_data["_type"] = entity["_type"];
        json_data["_id"] = entity["_id"];
        if (entity.hasOwnProperty("_parent")) {
            json_data["_parent"] = entity["_parent"];
        }

        saveEntity(statistic_name, json_data);
        fetch_callback(json_data);

        var handleChildEntity = function (entity_name, entity_id, entity_type) {
            var next_entity = getEntity(domain["name"], entity_name, null);

            if (entity_type === "entity") {
                var id = getEntityId(entity_id, next_entity["root"]);
                if (id === null) {
                    id = generate_random_id(entity_name, fetched_entities);
                    next_entity["properties"] = [];
                }

                next_entity["_id"] = id;
                fetched_entities.push([entity_name, id]);
                next_entity["_parent"] = join_url(entity["_type"], entity["_id"]);

                handleEntity(entity_id, next_entity, depth);
                return
            }
            else if (entity_type === "entity_url") {
                next_entity["_id"] = generate_random_id(entity_name, fetched_entities);

                entity_id = entity_id.slice(Math.max(0, entity_id.indexOf('?')));
                next_entity["endpoint"] = next_entity["endpoint"] + entity_id;
            }
            else {
                next_entity["_id"] = entity_id;
                var endpoint = next_entity['endpoint'];
                next_entity['endpoint'] = endpoint.replace("{id}", entity_id) + '?' +
                                          build_query(domain["parameters"]);
            }

            if (fetched_entities.indexOf([entity_name, entity_id]) !== -1) {
                return;
            }
            fetched_entities.push([entity_name, entity_id]);
            next_entity["_parent"] = join_url(entity["_type"], entity["_id"]);

            if (!overrideCache && hasEntity(statistic_name, entity_name, entity_id)) {
                var cachedEntity = getEntity(statistic_name, entity_name, entity_id);

                var abstractEntity = getEntity(domain['name'], entity_name, null);
                abstractEntity["_id"] = cachedEntity["_id"];
                abstractEntity["_parent"] = cachedEntity["_parent"];

                handleEntity(cachedEntity, abstractEntity, depth + 1);
            }
            else {
                if (depth + 1 === maxDepth) {
                    return;
                }
                entity_request_queue.push([depth + 1, next_entity]);
            }
        };

        forEachEntityLink(json_data, entity["root"], handleChildEntity);

        depth++;
        entity["properties"].forEach(function (entity_name) {
            handleChildEntity(entity_name, entity["_id"], "entity_id");
        });
        depth--;
    }

    var primary_entity = getEntity(domain['name'], primary_entity_name, null);
    primary_entity["endpoint"] = primary_entity["endpoint"] + '?' + build_query(domain["parameters"]);
    var fetched_entities = [[primary_entity_name, 0]];
    primary_entity['_id'] = 0;

    var start = function fetchEntity(entity, depth) {
        var url = join_url(domain["base_url"], entity["endpoint"]);

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                var json_data = JSON.parse(this.responseText);

                handleEntity(json_data, entity, depth);

                setTimeout(function () {
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
        };

        xhttp.open("GET", url, true);
        xhttp.send();
    };

    start(primary_entity, 0);
}


// ##############################################################
// # ##                    HACKER NEWS                       # ##

var primary_entity = {
    "root": JSON.parse('["entity_id story"]'),
    "endpoint": "/v0/topstories.json",
    "properties": [],
    "_type": 'topstories'
};

var story = {
    "root": JSON.parse('{"kids":["entity_id comment"], "descendants": "integer"}'),
    "endpoint": "/v0/item/{id}.json",
    "properties": [],
    "_type": 'story'
};

var comment = {
    "root": JSON.parse('{"kids":["entity_id comment"]}'),
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
        '"data": ["entity post"],' +
        '"paging": {"next": "entity_url self_posts_page"}' +
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
    "root": JSON.parse('{"data": ["entity like"]}'),
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
    3
);*/



// # ##                        END                           # ##
// ##############################################################
