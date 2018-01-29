
function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function getParameterByName(name) {
    var match = RegExp('[#&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function join_url(base_url, endpoint) {
    return base_url.toString().strip('/') + '/' + endpoint.toString().strip('/');
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