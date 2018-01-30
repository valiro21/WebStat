
function getAllDomains() {
    console.log(listDomains());

    return listDomains();
}

function getAllEntitiesByDomain(domain) {
    console.log(listEntities(domain));

    return listEntities(domain);
}


function buildOptionElem(value, text) {
    let newElem = document.createElement("option");
    let textElem = document.createTextNode(text);
    newElem.setAttribute('value', value);
    newElem.appendChild(textElem);

    return newElem;
}

const FORM_ID          = "form";
const DOMAIN_SELECT_ID = "domain";
const ENTITY_SELECT_ID = "entity";
const KEY_SELECT_ID    = "key";
const VALUE_SELECT_ID  = "value";

function getCurrentOptionValue(elem) {
    return elem.options[elem.selectedIndex].value;
}
function getCurrentEntity() {
    let e = document.getElementById(ENTITY_SELECT_ID);
    return getCurrentOptionValue(e);
}
function getCurrentDomain() {
    let e = document.getElementById(DOMAIN_SELECT_ID);
    return getCurrentOptionValue(e);
}

//----------------------------------------------------------------------------------------------------------------------
function getAllKeys(domain, entity) {
    return {values: [], texts: []} // TODO
}
function getAllValues(domain, entity) {
    return {values: [], texts: []} // TODO
}
//----------------------------------------------------------------------------------------------------------------------
function buildSelect(elemId, values, texts, extraVal, extraText) {
    let e = document.getElementById(elemId);

    if (values.length !== texts.length) {
        throw "Names and texts lengths not matching!";
    }

    while (e.firstChild) {
        e.removeChild(e.firstChild);
    }

    for (let i = 0; i < values.length; ++i) {
        let newElem = buildOptionElem(values[i], texts[i]);
        e.appendChild(newElem);
    }

    if (extraVal && extraText) {
        let newElem = buildOptionElem(extraVal, extraText);
        e.appendChild(newElem);
    }
}

function buildKeys(domain, entity) {
    let keys = getAllKeys(domain, entity);
    let keyNames = keys.values;
    let keyTexts = keys.texts;

    buildSelect(KEY_SELECT_ID, keyNames, keyTexts);
}

function buildValues(domain, entity) {
    let values = getAllValues(domain, entity);
    let valueNames = values.values;
    let valueTexts = values.texts;

    buildSelect(KEY_SELECT_ID, valueNames, valueTexts);
}

//----------------------------------------------------------------------------------------------------------------------

function buildEntityDetails(domain, entity) {
    buildKeys(domain, entity);
    buildValues(domain, entity);
}

function buildEntitiesSelect(newDomain) {
    let entities = getAllEntitiesByDomain(newDomain);

    buildSelect(ENTITY_SELECT_ID, entities, entities);
}

//----------------------------------------------------------------------------------------------------------------------
function onEntityChange(newEntity) {
    if (!newEntity) {
        let e = document.getElementById(ENTITY_SELECT_ID);
        let newEntity = e.options[e.selectedIndex].value;

        return onEntityChange(newEntity);
    }

    return buildEntityDetails(getCurrentDomain(), newEntity);
}
//----------------------------------------------------------------------------------------------------------------------
function onDomainChange(newDomain) {
    if (!newDomain) {
        let e = document.getElementById(DOMAIN_SELECT_ID);
        let newDomain = e.options[e.selectedIndex].value;

        return onDomainChange(newDomain);
    }

    return buildEntitiesSelect(newDomain);
}
//----------------------------------------------------------------------------------------------------------------------
function onStatisticsConfigLoad() {
    let domains = getAllDomains();

    buildSelect(DOMAIN_SELECT_ID, domains, domains);

    document.getElementById(DOMAIN_SELECT_ID).onchange(); // works
}
//----------------------------------------------------------------------------------------------------------------------
function onFormSubmit() {
    let form = document.getElementById(FORM_ID);
    let inputs = form.getElementsByTagName('input');
    let selects = form.getElementsByTagName('select');

    let statisticData = {};

    for (let i = 0; i < inputs.length; ++i) {
        statisticData[inputs[i].name] = inputs[i].value;
    }

    let getSelName = function (t) {return t.name;};
    let getSelVal = function (t) {return t.value;};

    for (let i = 0; i < selects.length; ++i) {
        let sel = selects[i];
        statisticData[getSelName(sel)] = getSelVal(sel);
    }

    function getUniqueStatisticKey(data) {
        return data['statistic-name']; // bullshit, temporary
    }

    let key = getUniqueStatisticKey(statisticData);
    localStorage.setItem(key, JSON.stringify(statisticData));

    console.log("Saved statistic", key);
}
//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
if(window.attachEvent) {
    window.attachEvent('onload', onStatisticsConfigLoad);
} else {
    if(window.onload) {
        let currentOnLoad = window.onload;
        window.onload = function(currentOnLoad, evt) {
            currentOnLoad(evt);
            onStatisticsConfigLoad();
        }.bind(null, currentOnLoad);
    } else {
        window.onload = function(evt){onStatisticsConfigLoad();};
    }
}

/*
let chartWrappers = [];

// Test data ------------------------------------------------------------------------------


let testData = [12, 19, 3, 5, 2, 3];
let testLabels = ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"];
let testDatasetLabel = '# of votes';
let testIds = [];
let testTypes = ['bar', 'pie', 'doughnut', 'line'];

// Functions ------------------------------------------------------------------------------


// Initializes charts with mock-up data
function initPreviewCharts() {

    Chart.defaults.global.legend.display = false;

    testTypes.forEach(function (t) {
        let id = t + '-chart';

        let options = {
            events: [] // do not show pop-ups
        };

        chartWrapper = new ChartWrapper(id, t, options, null);
        chartWrapper.buildDataSingle(testLabels, testDatasetLabel, testData);

        chartWrapper.render();

        testIds.push(id);
        chartWrappers.push(chartWrapper);
    });
}

function setSelectedChart(id) {
    let elem = document.getElementById(id);
    elem.setAttribute('selected', 'selected');
}

function setUnselectedChart(id) {
    let elem = document.getElementById(id);
    elem.removeAttribute('selected');
}

function selectChart(id) {
    testIds.forEach(function (t) {
        if (t === id) {
            setSelectedChart(t);
        }
        else {
            setUnselectedChart(t);
        }
    })
}

function toArray(obj) {
    let array = [];
    // iterate backwards ensuring that length is an UInt32
    for (let i = obj.length >>> 0; i--;) {
        array[i] = obj[i];
    }
    return array;
}

function pageLoad() {
    window.initPreviewCharts();

    let charts = toArray(document.getElementsByClassName('chart-preview'));

    charts.forEach(function(item, index) {
        item.addEventListener('click', function(){
            selectChart(testIds[index]);
        });
    });
}

// Add NavBar generation after page load w/o overriding.
if(window.attachEvent) {
    window.attachEvent('onload', pageLoad);
} else {
    if(window.onload) {
        let currentOnLoad = window.onload;
        window.onload = function(evt) {
            currentOnLoad(evt);
            pageLoad();
        };
    } else {
        window.onload = pageLoad;
    }
}
*/