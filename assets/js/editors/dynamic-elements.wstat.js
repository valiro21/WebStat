function createRemoveButton2(nodeToRemove, callback) {
    var removeButton = document.createElement("a");
    removeButton.classList.add("trash-bin");
    removeButton.classList.add("float-right");
    removeButton.addEventListener('click', function () {
        callback();
        nodeToRemove.remove();
    });

    return removeButton;
}