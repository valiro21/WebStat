function File() {
}

function Folder(title, content) {
    this.title = title;
    this.content = content;
    this.type = 'Folder';
}

function Statistic(img, url, title) {
    this.img = img;
    this.url = url;
    this.title = title;
    this.type = 'Statistic';
}

function openFolder(index) {
    StatisticsDrive.getInstance().clearStatistics();
    var folder = StatisticsDrive.getInstance().getContentByIndex(index);
    StatisticsDrive.getInstance().navigateFolder(folder);
    StatisticsDrive.getInstance().renderStatistics();
    addContextListeners();
}

function goUpFolder() {
    StatisticsDrive.getInstance().goUpFolder();
    addContextListeners();
}

function deleteFolder(index) {
    StatisticsDrive.getInstance().deleteFolder(index);
    addContextListeners();
}

function moveToFolder(folderIndex) {
    var fileIndex = parseInt(document.getElementsByClassName('openedby')[0].getAttribute('id'));
    if(fileIndex === folderIndex) return;

    StatisticsDrive.getInstance().moveToFolder(fileIndex, folderIndex);
    var child = document.getElementById('folderModal');
    document.getElementById('displayContainer').removeChild(child);
    addContextListeners();
}

function moveToNewFolder() {
    var title = document.getElementById('folderName').value;
    var fileIndex = parseInt(document.getElementsByClassName('openedby')[0].getAttribute('id'));
    StatisticsDrive.getInstance().moveToNewFolder(fileIndex, title);
    var child = document.getElementById('folderModal');
    document.getElementById('displayContainer').removeChild(child);
    addContextListeners();
}

function makeNewFolder() {
    var title = document.getElementById('folderName').value;
    StatisticsDrive.getInstance().makeNewFolder(title);
    addContextListeners();
}

function deleteModal() {
    var child = document.getElementById('folderModal');
    document.getElementById('displayContainer').removeChild(child);
}

function openFolderManagement(index) {
    statistics = StatisticsDrive.getInstance().statistics;

    var modal = document.createElement('div');
    modal.setAttribute('id', 'folderModal');
    modal.setAttribute('class', 'modal');

    var modalContent = document.createElement('div');
    modalContent.setAttribute('class', 'modalContent');

    var modalCloseButton = document.createElement('button');
    modalCloseButton.setAttribute('onclick', 'deleteModal()');
    modalCloseButton.setAttribute('style', 'float: right;');
    modalCloseButton.textContent='x';

    modalContent.appendChild(modalCloseButton);

    for (var i = 0; i < statistics.length; i++) {
        var fileIndex = parseInt(document.getElementsByClassName('openedby')[0].getAttribute('id'));
        if (statistics[i].type === 'Folder' && i !== fileIndex) {
            var folder = statistics[i];
            var folderIndex = i;

            var folderButton = document.createElement('button');
            folderButton.setAttribute('onClick', 'moveToFolder(' + folderIndex +')');
            folderButton.textContent = folder.title;
            modalContent.appendChild(folderButton);
        }
    }
    var newFolderForm = document.createElement('form');

    var folderName = document.createElement('input');
    folderName.setAttribute('type', 'text');
    folderName.setAttribute('id', 'folderName');

    var newFolderSubmit = document.createElement('input');
    newFolderSubmit.setAttribute('type', 'submit');
    newFolderSubmit.textContent = 'New Folder';

    newFolderForm.appendChild(folderName);
    newFolderForm.appendChild(newFolderSubmit);

    newFolderForm.setAttribute('onsubmit', 'makeNewFolder();return false');

    modalContent.appendChild(newFolderForm);

    modal.appendChild(modalContent);
    document.getElementById('displayContainer').appendChild(modal);
}

Folder.prototype = Object.create(File.prototype);
Statistic.prototype = Object.create(File.prototype);

File.prototype.createDropDownEditButton = function(index) {
    console.log(index);

    var dropDownMenu = document.createElement('div');
    dropDownMenu.setAttribute('class', 'edit');

    var dropDownButton = document.createElement('button');
    dropDownButton.setAttribute('class', 'editButton');
    dropDownButton.textContent = '...';

    var dropDownContent = document.createElement('div');
    dropDownContent.setAttribute('class', 'editContent');

    var moveToFolder = document.createElement('button');
    moveToFolder.setAttribute('class', 'editButton');
    moveToFolder.textContent = 'Move To...';
    moveToFolder.setAttribute('onclick', 'openFolderManagement(' + index + ')');

    dropDownMenu.appendChild(dropDownButton);
    dropDownMenu.appendChild(dropDownContent);
    dropDownContent.appendChild(moveToFolder);

    return dropDownMenu;
};

Statistic.prototype.createDropDownEditButton = function(index) {
    var dropDownContent = File.prototype.createDropDownEditButton.call(this, index);

    var editButton = document.createElement('button');
    editButton.setAttribute('class', 'editButton');
    editButton.textContent = 'Edit';

    var exportButton = document.createElement('button');
    exportButton.setAttribute('class', 'editButton');
    exportButton.textContent = 'Export';

    var deleteButton = document.createElement('button');
    deleteButton.setAttribute('class', 'editButton');
    deleteButton.textContent = 'Delete';

    dropDownContent.children[1].appendChild(deleteButton);
    dropDownContent.children[1].appendChild(editButton);
    dropDownContent.children[1].appendChild(exportButton); // Massive hax!!
    return dropDownContent;
};

Folder.prototype.createDropDownEditButton = function(index) {
    var dropDownContent = File.prototype.createDropDownEditButton.call(this, index);

    var deleteButton = document.createElement('button');
    deleteButton.setAttribute('class', 'editButton');
    deleteButton.textContent = 'Delete';
    deleteButton.setAttribute('onclick', 'deleteFolder(' + index + ')');

    dropDownContent.children[1].appendChild(deleteButton);

    return dropDownContent;
};

Statistic.prototype.generateElement = function(index) {
    var statisticElementLink = document.createElement('a');
    statisticElementLink.setAttribute('href', this.url);

    var statisticElement = document.createElement('div');
    statisticElement.appendChild(statisticElementLink);
    statisticElement.setAttribute('class', 'entry');
    statisticElement.setAttribute('oncontextmenu', 'openEntryMenu('+index+')');

    var imgElement = document.createElement('img');
    imgElement.setAttribute('src', this.img);
    imgElement.setAttribute('height', '250px');
    imgElement.setAttribute('width', '250px');

    var textElement = document.createElement('div');
    textElement.setAttribute('class', 'container');

    var title = document.createElement('div');
    title.setAttribute('class', 'title');
    title.textContent = this.title;
    textElement.appendChild(title);

    //textElement.appendChild(this.createDropDownEditButton(index));
    statisticElementLink.appendChild(imgElement);
    statisticElement.appendChild(textElement);

    return statisticElement;
};

Folder.prototype.generateElement = function(index) {
    var folder = document.createElement('div');

    var folderButton = document.createElement('a');
    folderButton.setAttribute('onclick', 'openFolder(' + index + ')');


    var folderElement = document.createElement('div');
    folderElement.setAttribute('class', 'entry');
    folderElement.setAttribute('oncontextmenu', 'openEntryMenu('+index+')');

    var imgElement = document.createElement('img');
    imgElement.setAttribute('src', 'https://n6-img-fp.akamaized.net/free-vector/folder_1459-2304.jpg?size=338&ext=jpg');
    imgElement.setAttribute('height', '250px');
    imgElement.setAttribute('width', '250px');

    folderButton.appendChild(imgElement);

    var textElement = document.createElement('div');
    textElement.setAttribute('class', 'container');

    var title = document.createElement('div');
    title.setAttribute('class', 'title');
    title.textContent = this.title;
    textElement.appendChild(title);

    //textElement.appendChild(this.createDropDownEditButton(index));
    folderElement.appendChild(folderButton);
    folderElement.appendChild(textElement);

    return folderElement;
};

var StatisticsDrive = (function() {
    var instance;

    function createAddButton() {
        var addButtonRedirect = document.createElement('a');
        addButtonRedirect.setAttribute('onclick', 'goUpFolder()');

        var addButton = document.createElement('div');
        addButtonRedirect.appendChild(addButton);

        addButton.setAttribute('class', 'backButton');

        var imgElement = document.createElement('i');
        imgElement.setAttribute('class', 'fa fa-undo');
        imgElement.setAttribute('style', 'margin-top: 50px');

        addButton.appendChild(imgElement);
        return addButtonRedirect;
    }

    function createInstance() {
        var that = {};

        that.previous = [];

        /*that.statistics = [new Statistic('../assets/img/chart-1.png', '../pages/realtime-data.html', 'Highest traffic'),
            new Statistic('../assets/img/chart-2.png', '../pages/realtime-data.html', 'Most text'),
            new Statistic('../assets/img/chart-3.png', '../pages/realtime-data.html', 'Data types'),
            new Folder('Test', [new Statistic('../assets/img/chart-3.png', '../pages/realtime-data.html', 'Data types')])];*/

        that.stocare = function(path, folder) {
            var toStore = [];

            for (var i = 0; i < folder.length; i++) {
                if(folder[i].type === 'Folder') {
                    var newPath = path + folder[i].title + '/';
                    toStore.push(newPath);
                    that.stocare(newPath, folder[i].content);
                } else {
                    toStore.push(folder[i].title);
                    localStorage.setItem(folder[i].title, folder[i].url);
                }
            }

            localStorage.setItem(path, toStore);
        };

        that.citire = function(path) {
            var statisticsDrive = [];
            var currentFolder = localStorage.getItem(path);

            if(currentFolder) {
                currentFolder = currentFolder.split(',');

                for (var i = 0; i < currentFolder.length; i++) {
                    if (currentFolder[i][currentFolder[i].length - 1] === '/') {
                        var newPath = currentFolder[i].split('/');
                        statisticsDrive.push(new Folder(newPath[newPath.length - 2], that.citire(currentFolder[i])));
                    } else {
                        var link = localStorage.getItem(currentFolder[i]);
                        statisticsDrive.push(new Statistic('../assets/img/default.png', link, currentFolder[i]))
                    }
                }
            }
            return statisticsDrive;
        };

        that.statistics = that.citire('sDrive/');

        that.addStatistic = function() {
        };

        that.deleteStatistic = function() {
        };

        that.goUpFolder = function() {
            if(that.previous.length !== 0) {
                that.statistics = that.previous[that.previous.length - 1];
                that.previous.pop();
                that.clearStatistics();
                that.renderStatistics();
            }
        };

        that.getContentByIndex = function(index) {
            return that.statistics[index];
        };

        that.navigateFolder = function(folder) {
            if (folder) {
                that.previous.push(that.statistics);
                that.statistics = folder.content;
            }
        };

        that.moveToNewFolder = function(index, title) {
            that.statistics.push(new Folder(title, [that.statistics[index]]));
            that.statistics.splice(index, 1);
            that.clearStatistics();
            that.renderStatistics();
            if (that.previous[0]) {
                that.stocare('sDrive/', that.previous[0]);
            } else {
                that.stocare('sDrive/', that.statistics);
            }
        };

        that.makeNewFolder = function(title) {
            that.statistics.push(new Folder(title, []));
            that.clearStatistics();
            that.renderStatistics();
            if (that.previous[0]) {
                that.stocare('sDrive/', that.previous[0]);
            } else {
                that.stocare('sDrive/', that.statistics);
            }
        };

        that.deleteFolder = function(index) {
            that.statistics.splice(index, 1);
            that.clearStatistics();
            that.renderStatistics();
            if (that.previous[0]) {
                that.stocare('sDrive/', that.previous[0]);
            } else {
                that.stocare('sDrive/', that.statistics);
            }
        };

        that.moveToFolder = function(fileIndex, folderIndex) {
            that.statistics[folderIndex].content.push(that.statistics[fileIndex]);
            that.statistics.splice(fileIndex, 1);
            that.clearStatistics();
            that.renderStatistics();
            if (that.previous[0]) {
                that.stocare('sDrive/', that.previous[0]);
            } else {
                that.stocare('sDrive/', that.statistics);
            }
        };

        that.renderStatistics = function() {
            var statisticsElement = document.createElement('div');
            statisticsElement.setAttribute('class', 'displayContainer');
            statisticsElement.setAttribute('id', 'displayContainerChild');

            var index = 0;
            that.statistics.forEach(function(item) {
                statisticsElement.appendChild(item.generateElement(index));
                index++;
            });
            statisticsElement.appendChild(createAddButton());
            document.getElementById('displayContainer').appendChild(statisticsElement);
        };

        that.clearStatistics = function() {
            var child = document.getElementById('displayContainerChild');
            document.getElementById('displayContainer').removeChild(child);
        };

        return that;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

function closeMenu(menuId){
    var menu = document.getElementById(menuId);
    menu.style.display = "";
}

function openMenu(menuId, event){
    var menu = document.getElementById(menuId);
    menu.style.display = "block";
    menu.style.left = (event.pageX - 10)+"px";
    menu.style.top = (event.pageY - 10)+"px";
}

function openEntryMenu(index){
    var openedBy = document.getElementsByClassName('openedby')[0];
    openedBy.setAttribute('id', index);
}

function addContextListeners(){
    var entries = document.getElementsByClassName('entry');
    for (var entry of entries) {
        entry.addEventListener("contextmenu", function(event){
            event.preventDefault();
            openMenu('entryMenu', event);
            closeMenu('contextMenu');
            event.stopPropagation();
        }, false);
    }
}

function initStatisticsDrive() {
    StatisticsDrive.getInstance().renderStatistics();
    var htmlTag = document.getElementsByTagName("html")[0];
    htmlTag.addEventListener("click", function(event){
        closeMenu('entryMenu');
        closeMenu('contextMenu');
        event.stopPropagation();
    }, false);
    htmlTag.addEventListener("contextmenu", function(event){
        closeMenu('entryMenu');
        closeMenu('contextMenu');
        event.stopPropagation();
    }, false);

    bodyTag = document.getElementsByTagName('body')[0];
    bodyTag.addEventListener("contextmenu", function(event){
        event.preventDefault();
        closeMenu('entryMenu');
        openMenu('contextMenu', event);
        event.stopPropagation();
    }, false);

    var entryMenu = document.getElementById('entryMenu');
    entryMenu.addEventListener('contextmenu', function(event){
        event.preventDefault();
        event.stopPropagation();
    });

    var contextMenu = document.getElementById('contextMenu');
    contextMenu.addEventListener('click', function(event){
        closeMenu('contextMenu');
        event.stopPropagation();
    }, false);

    addContextListeners();
}


// Add drive generation after page load w/o overriding.
if(window.attachEvent) {
    window.attachEvent('onload', initStatisticsDrive);
}
else {
    if(window.onload) {
        var currentOnLoad = window.onload;
        window.onload = function(evt) {
            currentOnLoad(evt);
            initStatisticsDrive();

        };
    } else {
        window.onload = initStatisticsDrive;
    }
}
