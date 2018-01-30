function createRemoveButton(nodeToRemove, should_remove) {
    var removeButton = document.createElement("a");
    removeButton.classList.add("trash-bin");
    removeButton.classList.add("float-right");
    removeButton.addEventListener('click', function () {
        if(should_remove === null || should_remove()) {
            nodeToRemove.remove();
        }
    });

    return removeButton;
}

function createSwapRemoveButton(nodeToRemove, nodeToSwapWith, should_remove) {
    var removeButton = document.createElement("a");
    removeButton.classList.add("trash-bin");
    removeButton.classList.add("float-right");
    removeButton.addEventListener('click', function () {
        if(should_remove === null || should_remove()) {
            nodeToRemove.replaceWith(nodeToSwapWith);
        }
    });

    return removeButton;
}