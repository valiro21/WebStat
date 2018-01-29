function createNewListItem(item) {
    var node = document.createElement('li');

    var textNode = document.createTextNode(item);
    var deleteButtonNode = createRemoveButton2(node, function() {});

    node.appendChild(textNode);
    node.appendChild(deleteButtonNode);

    return node;
}

function addNewEntry(listNode, elementName) {
    listNode.appendChild(createNewListItem(elementName));
}


function attachEditor() {
    document.querySelectorAll('[data-to]', '[data-from]').forEach(function(elem) {
        var list = document.getElementById(elem.getAttribute('data-to'));
        var from = document.getElementById(elem.getAttribute('data-from'));
        elem.addEventListener('click', function(event) {
            event.preventDefault();
            addNewEntry(list, from.value);
            from.value = "";
        });
    });
}


if(window.attachEvent) {
    window.attachEvent('onload', attachEditor());
} else {
    if(window.onload) {
        var currentOnLoad = window.onload;
        window.onload = function(currentOnLoad, evt) {
            currentOnLoad(evt);
            attachEditor();
        }.bind(null, currentOnLoad);
    } else {
        window.onload = function(evt){attachEditor();};
    }
}