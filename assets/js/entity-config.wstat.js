function closeModal(){
    var modal = document.getElementsByClassName('modal')[0];
    modal.style.display = 'none';
}

function openModal(){
    var modal = document.getElementsByClassName('modal')[0];
    modal.style.display = 'block';
}

function initEditor() {
    var editorPlaceholders = document.getElementsByClassName("editor");

    if (editorPlaceholders.length > 0) {
        var domain_name = getParameterByName("domain_name");
        var entity_name = getParameterByName("entity_name");

        var entity = null;
        if (entity_name !== undefined && entity_name !== null) {
            entity = getEntity(domain_name, entity_name);
        }

        var placeholder = editorPlaceholders.item(0);
        placeholder.appendChild(createVisualizerFromEntity(entity));
    }

    var refresh = function () {
        var entity_selector = document.getElementById("parameter-name");
        while (entity_selector.firstChild) {
            entity_selector.removeChild(entity_selector.firstChild);
        }

        var domain = getParameterByName('domain_name');
        listEntities(domain).forEach(function(entity) {
            entity_selector.appendChild(createOption(entity));
        });
    };

    document.getElementById("parameter-name").addEventListener('click', refresh);
    refresh();
}

function onSubmit() {
    var editorPlaceholders = document.getElementsByClassName("editor");

    if (editorPlaceholders.length > 0) {
        var placeholder = editorPlaceholders.item(0);
        var visualizer = placeholder.children[0];
        var entity_root = getEntityFromVisualizer(visualizer);
        if(entity_root === null) {
            alert("Entity is invalid.");
            return;
        }

        var domain_name = getParameterByName("domain_name");
        var entity_name = getParameterByName("entity_name");

        var create_new_entity = false;
        if (entity_name === null) {
            entity_name = document.getElementById("EntityAlias").value;
            create_new_entity = true;
        }

        var entity = {};
        entity["root"] = entity_root;
        entity["endpoint"] = document.getElementById("Endpoint").value;

        var propertiesList = document.getElementById("properties").children;
        var properties = [];
        for(var idx = 0; idx < propertiesList.length; idx++) {
            var property = propertiesList[property];

            properties.push(property.innerHTML);
        }

        entity["properties"] = properties;
        entity["_type"] = entity_name;

        if (create_new_entity) {
            newEntity(domain_name, entity_name);
        }

        saveEntity(domain_name, entity_name);
    }
}

if(window.attachEvent) {
    window.attachEvent('onload', initEditor);
} else {
    if(window.onload) {
        var currentOnLoad = window.onload;
        window.onload = function(currentOnLoad, evt) {
            currentOnLoad(evt);
            initEditor();
        }.bind(null, currentOnLoad);
    } else {
        window.onload = function(evt){initEditor();};
    }
}