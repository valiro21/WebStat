OPTIONS = [
    'number',
    'string',
    'boolean',
    'array',
    'object',
    'entity',
    'next_page'
];

PRIMITIVES = [
    'string',
    'number',
    'boolean',
    'next_page'
];

function isPrimitive(type) {
    return PRIMITIVES.indexOf(type) >= 0;
}

function createValueNode(key, type){
    var node = document.createElement('div');
    node.className = "node";
    if (!isPrimitive(type)) {
        node.classList += " non-value";
    }

    var nodeText = document.createElement('a');

    // Key node
    var keyNode = document.createElement('p');
    keyNode.className = "key";
    keyNode.textContent = key.toString();

    // Type node
    var typeNode = document.createElement('p');
    typeNode.className = "type";
    typeNode.textContent = type.toString();

    nodeText.appendChild(keyNode);
    nodeText.appendChild(typeNode);
    nodeText.addEventListener('click', toggleVisibleNode);

    node.appendChild(nodeText);
    node.appendChild(createRemoveButton());

    return node;
}

function createNewNodeButton() {
    var addButton = document.createElement("a");
    addButton.className = "btn new-node";
    addButton.addEventListener('click', newNode);

    return addButton;
}

function createRemoveButton() {
    var removeButton = document.createElement("a");
    removeButton.className = "btn remove-node";
    removeButton.addEventListener('click', removeNode);

    return removeButton;
}

function createLevel(key, type) {
    // Create div to wrap the whole level
    var level = document.createElement('div');
    level.className = "level-node";

    var node = createValueNode(key, type);
    level.appendChild(node);

    level.appendChild(createNewNodeButton());

    return level;
}


function addNode(event){
    var nodeForm = event.target.parentNode;

    var name = nodeForm.getElementsByTagName("input")[0].value;
    var type = nodeForm.getElementsByTagName("select")[0].value;

    var node = createLevel(name, type);
    if (isPrimitive(type)) {
        node.removeChild(node.lastChild);
    }

    nodeForm.parentElement.appendChild(createNewNodeButton());
    nodeForm.replaceWith(node);
}

function cancelNode(event){
    var nodeForm = event.target.parentNode;
    nodeForm.replaceWith(createNewNodeButton());
}

function newNode(event) {
    var newNodeForm = document.createElement('div');
    newNodeForm.className = "add-node level-node";

    var name = document.createElement('input');
    name.type = 'text';
    name.className = "add-node";

    var select = document.createElement('select');
    OPTIONS.forEach(function(item){
        var option = document.createElement('option');
        option.textContent = item;
        select.appendChild(option);
    });
    select.className = "add-node";

    newNodeForm.appendChild(name);
    newNodeForm.appendChild(select);

    var addButton = document.createElement('button');
    addButton.textContent = "Add";
    addButton.className = "btn add-node";
    addButton.addEventListener('click', addNode);

    var cancelButton = document.createElement('button');
    cancelButton.textContent = "Cancel";
    cancelButton.className = "btn cancel-node";
    cancelButton.addEventListener('click', cancelNode);

    newNodeForm.appendChild(addButton);
    newNodeForm.appendChild(cancelButton);

    event.target.replaceWith(newNodeForm);
}

function removeNode(event) {
    var node = event.target.parentNode.parentNode;
    if (confirm ("Do you really want to remove the node and all of it's content?")) {
        node.parentNode.removeChild(node);
    }
}

function toggleVisibleNode(event){
    var node = event.target.parentNode.parentNode;
    if (node.tagName === "p") {
        node = node.parentNode;
    }

    if(node.classList.contains("closed")) {
        node.classList.remove("closed");
    }
    else {
        node.classList.add("closed");
    }
}

function isTerminalNode(data) {
    return ['string', 'number', 'boolean'].indexOf(typeof data) >= 0;
}

function buildJsonVisualizer(data, rootName = "root", rootType = "object") {
    var level = createLevel(rootName, rootType);

    if (isTerminalNode(data))
    {
        level.removeChild(level.lastChild);
        return level;
    }

    for (var key in data) {
        var value = data[key];

        var dataType = typeof value;
        if(dataType instanceof Array) {
            value = dataType[0];
        }

        var createNewButton = level.lastChild;
        level.removeChild(createNewButton);
        level.appendChild(buildJsonVisualizer(value, key, dataType));
        level.appendChild(createNewButton);
    }

    return level;
}

function refreshEditor(divClassName = "editor") {
    var editorPlaceholders = document.getElementsByClassName(divClassName);

    if (editorPlaceholders.length > 0)
    {
        var placeholder = editorPlaceholders.item(0);
        placeholder.appendChild(buildJsonVisualizer({2: 3, 4: 5, 1: {2: 3, 4: 11}}));
    }
}