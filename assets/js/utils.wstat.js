
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

function getEntity(namespace, entity_name, entity_id) {
    var location = join_url(namespace, entity_name);
    if(entity_id !== null) {
        location = join_url(location, entity_id);
    }

    var entity = localStorage.getItem(location);

    if (entity === undefined || entity === null) {
        return null;
    }

    return JSON.parse(entity);
}

function hasEntity(namespace, entity_name, entity_id) {
    var location = join_url(namespace, entity_name);
    if(entity_id !== null) {
        location = join_url(location, entity_id);
    }

    var entity = localStorage.getItem(location);

    return !(entity === undefined || entity === null);
}

function newEntity(domainTitle, entityTitle) {
    var dDomainGot = localStorage.getItem(domainTitle);

    if(dDomainGot !== null) {
        dDomainGot = dDomainGot.split(',');

        var i;
        var newD = new Domain(dDomainGot[dDomainGot.length - 1], domainTitle, []);
        for (i = 0; i < dDomainGot.length - 1; i++) {
            newD.entities.push(new Entity(dDomainGot[i]));
        }
        newD.entities.push(new Entity(entityTitle));

        var entities = [];
        for (i = 0; i < newD.entities.length; i++) {
            entities.push(newD.entities[i].title);
        }
        entities.push(newD.img);
        localStorage.setItem(newD.title, entities);
        return true;
    }
    return false;
}

function listEntities(domainTitle) {
    var dDomainGot = localStorage.getItem(domainTitle);

    if(dDomainGot !== null && dDomainGot !== '') {
        dDomainGot = dDomainGot.split(',');

        var i;
        var entityList = [];
        for (i = 0; i < dDomainGot.length - 1; i++) {
            entityList.push(dDomainGot[i]);
        }
    } else {
        entityList = [];
    }
    return entityList;
}

function newDomain(title) {
    var domains = listDomains();
    domains.push(title);

    localStorage.setItem('drive_dNames', domains);
    localStorage.setItem(title, ['yeees.jpg']);
}

function listDomains() {
    var dNamesGot = localStorage.getItem('drive_dNames');
    if(dNamesGot !== null && dNamesGot !== '') {
        dNamesGot = dNamesGot.split(',');
        return dNamesGot;
    } else {
        return [];
    }
}
