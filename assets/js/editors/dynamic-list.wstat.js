function createNewListItem(item) {
    var node = document.createElement('li');
    node.style = "display: inline";

    var textNode = document.createElement('p');
    textNode.innerHTML = item;
    textNode.style = "display: inline-block";
    var deleteButtonNode = createRemoveButton(node, null);

    node.appendChild(textNode);
    node.appendChild(deleteButtonNode);

    return node;
}

function addListEntry(listNode, elementName) {
    listNode.appendChild(createNewListItem(elementName));
}


function attachEditor() {
    document.querySelectorAll('[data-to]', '[data-from]').forEach(function(elem) {
        var list = document.getElementById(elem.getAttribute('data-to'));
        var from = document.getElementById(elem.getAttribute('data-from'));
        elem.addEventListener('click', function(event) {
            event.preventDefault();
            addListEntry(list, from.value);
            from.value = "";
        });
    });
}

function addAdhocEntry(value) {
    document.querySelectorAll('[data-to]', '[data-from]').forEach(function(elem) {
        var list = document.getElementById(elem.getAttribute('data-to'));
        addListEntry(list, value);
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