OPTIONS = [
    'value',
    'array',
    'object',
    'id',
    'entity',
    'entity_id',
    'entity_url'
];

function toggleClass(classList, className) {
    if(classList.contains(className)) {
        classList.remove(className);
    }
    else {
        classList.add(className);
    }
}



// ##############################################################
// # ##                     NODE CREATION                    # ##

function createLine() {
    var node = document.createElement('div');
    node.classList.add('line');
    return node;
}

function createHeader() {
    var node = document.createElement('div');
    node.classList.add('header');
    return node;
}

function createChildrenWrapper() {
    var node = document.createElement('div');
    node.classList.add('children');
    return node;
}

function createP(value) {
    var p = document.createElement('p');
    p.innerHTML = value;
    return p;
}

function createKeyNode(key) {
    var keyNode = createP(key);
    keyNode.classList.add('key');
    return keyNode;
}

function createValueNode(value) {
    var valueNode = createP(value);
    valueNode.classList.add('value');
    return valueNode;
}

function createExpandableNode(key, objectType) {
    var node = createLine();

    var header = createHeader();
    header.classList.add('node-head');

    var children = createChildrenWrapper();
    children.classList.add('node-children');

    var expandArrow = document.createElement('button');
    expandArrow.classList.add('node-collapse');
    expandArrow.addEventListener('click', function (event) {
        event.preventDefault();

        toggleClass(expandArrow.classList, "collapsed");
        toggleClass(children.classList, "closed");
    });

    var entityType = createValueNode(objectType);
    var confirm_method = function() {
        return confirm("Do you really want to remove the node and all of it's content?");
    };

    var removeNode;
    if (key === null) {
        removeNode = createSwapRemoveButton(node, createAddNodeButton(), confirm_method);
    }
    else {
        removeNode = createRemoveButton(node, confirm_method);
    }

    header.appendChild(expandArrow);
    if (key !== null) {
        header.appendChild(createKeyNode(key));
        header.appendChild(document.createTextNode(':'));
    }
    header.appendChild(entityType);
    header.appendChild(removeNode);

    node.appendChild(header);
    node.appendChild(children);

    return node;
}

function createObjectNode(key) {
    var node = createExpandableNode(key, '{}');
    node.children[1].appendChild(createAddFieldButton());
    return node;
}

function createArrayNode(key) {
    var node = createExpandableNode(key, '[]');
    node.children[1].appendChild(createAddNodeButton());
    return node;
}

function createLeafNode(key, value) {
    var node = createHeader();
    if (key !== null) {
        node.appendChild(createKeyNode(key));
        node.appendChild(createP(':'));
    }

    node.appendChild(createValueNode(value));


    var confirm_method = function() {
        return confirm("Do you really want to remove the node and all of it's content?");
    };

    var removeNode;
    if (key === null) {
        removeNode = createSwapRemoveButton(node, createAddNodeButton(), confirm_method);
    }
    else {
        removeNode = createRemoveButton(node, confirm_method);
    }

    node.appendChild(removeNode);
    return node;
}

// # ##                        END                           # ##
// ##############################################################


// ##############################################################
// # ##                     NODE SELECTOR                    # ##

function createOption(value) {
    var option = document.createElement('option');
    option.textContent = value;
    return option;
}

function createButton(value) {
    var button = document.createElement('button');
    button.appendChild(document.createTextNode(value));
    return button;
}

function createNodeTypeSelector(includeKeyInput) {
    var node = createHeader();

    var keyNode = null;
    if (includeKeyInput) {
        keyNode = document.createElement('input');
        node.appendChild(keyNode);
    }

    var select = document.createElement('select');

    OPTIONS.forEach(function(item){
        select.appendChild(createOption(item));
    });

    var entity_addons = document.createElement('div');
    entity_addons.appendChild(document.createTextNode('of'));
    var entity_selector = document.createElement('select');
    var refresh = function () {
        while (entity_selector.firstChild) {
            entity_selector.removeChild(entity_selector.firstChild);
        }

        var domain = getParameterByName('domain_name');
        listEntities(domain).forEach(function(entity) {
            entity_selector.appendChild(createOption(entity));
        });
    };

    entity_selector.addEventListener('click', refresh);
    refresh();

    entity_addons.appendChild(entity_selector);
    entity_addons.classList.add('closed');
    entity_addons.classList.add('entity-addons');

    select.addEventListener('change', function () {
        if(this.value.startsWith('entity')) {
            entity_addons.classList.remove("closed");
        }
        else {
            if(!entity_addons.classList.contains("closed")) {
                entity_addons.classList.add("closed");
            }
        }
    });

    var addBtn = createButton('Add');
    addBtn.setAttribute('class','entity-button');
    var cancelBtn = createButton('Cancel');
    cancelBtn.setAttribute('class','entity-button');

    addBtn.addEventListener('click', function (event) {
        event.preventDefault();

        if (includeKeyInput && keyNode.value === "") {
            alert("You can't insert an element with an empty key.")
            return;
        }

        if (select.value === "object") {
            node.replaceWith(createObjectNode(!includeKeyInput ? null : keyNode.value));
        }
        else if (select.value === "array") {
            node.replaceWith(createArrayNode(!includeKeyInput ? null : keyNode.value));
        }
        else {
            var value = select.value;
            if (!entity_addons.classList.contains('closed')) {
                if (entity_selector.value === "") {
                    alert("You must specify an entity.");
                    return;
                }

                value = value + ' ' + entity_selector.value;
            }

            node.replaceWith(createLeafNode(!includeKeyInput ? null : keyNode.value, value));
        }

        if (includeKeyInput) {
            node.parentNode.appendChild(createAddFieldButton());
        }
    });

    cancelBtn.addEventListener('click', function (event) {
        event.preventDefault();

        if (includeKeyInput) {
            node.replaceWith(createAddFieldButton());
        }
        else {
            node.replaceWith(createAddNodeButton());
        }
    });

    node.appendChild(select);
    node.appendChild(entity_addons);
    node.appendChild(addBtn);
    node.appendChild(cancelBtn);

    return node;
}

// # ##                        END                           # ##
// ##############################################################


// ##############################################################
// # ##                     ADD BUTTONS                      # ##

function createAddNodeButton() {
    var node = document.createElement('button');
    node.classList.add('add-btn');
    node.addEventListener('click', function(event) {
        event.preventDefault();

        node.replaceWith(createNodeTypeSelector(false));
    });
    return node;
}

function createAddFieldButton() {
    var node = document.createElement('button');
    node.classList.add('add-btn');
    node.addEventListener('click', function(event) {
        event.preventDefault();

        node.replaceWith(createNodeTypeSelector(true));
    });
    return node;
}

// # ##                        END                           # ##
// ##############################################################

function getFirstLevelByTagName(node, tagName) {
    var children = [];
    for(var childIdx = 0; childIdx < node.children.length; childIdx++) {
        if(node.children[childIdx].nodeName === tagName) {
            children.push(node.children[childIdx]);
        }
    }
    return children;
}

function getEntityFromVisualizer(rootNode) {
    var children = rootNode.getElementsByClassName('children');
    if (children.length === 0) {
        return rootNode.getElementsByClassName('value')[0].innerHTML;
    }
    else {
        var header = rootNode.getElementsByClassName('header')[0];
        var value = header.getElementsByClassName('value')[0].innerHTML;
        children = getFirstLevelByTagName(children[0], 'DIV');

        var entity = {};
        if (value === '{}') {
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                header = child.getElementsByClassName('header')[0];
                var key = header.getElementsByClassName('key')[0].innerHTML;

                var value_entity = getEntityFromVisualizer(child);
                entity[key] = value_entity;
                if (value_entity === null) {
                    return null;
                }
            }
        }
        else if (value === '[]') {
            if(children.length === 0) {
                entity = null;
            }
            else {
                var array_entity = getEntityFromVisualizer(children[0]);
                if(array_entity === null) {
                    return null;
                }
                entity = [array_entity];
            }
        }
        else {
            entity = null;
        }

        return entity;
    }
}

function createVisualizer(key, value) {
    var tree = null;
    var children = null;

    if (value === null) {
        return createAddNodeButton();
    }
    else if (Array.isArray(value)) {
        tree = createArrayNode(key);
        children = tree.getElementsByClassName('children')[0];
        if(value.length > 0) {
            children.appendChild(createVisualizer(null, value[0]));
        }
    }
    else if(typeof(value) === "object") {
        tree = createObjectNode(key);
        children = tree.getElementsByClassName('children')[0];
        Object.keys(value).forEach(function(key){
            var last = children.lastChild;
            children.removeChild(last);

            children.appendChild(createVisualizer(key, value[key]));
            children.appendChild(last);
        });
    }
    else {
        tree = createLeafNode(key, value);
    }

    return tree;
}

function createVisualizerFromEntity(entity) {
    return createVisualizer(null, entity);
}