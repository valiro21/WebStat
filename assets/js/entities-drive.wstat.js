function Domain(img, title, entities) {
    this.img = img;
    this.title = title;
    this.entities = entities;
}

function Entity(title) {
    this.title = title;
}

function OpenDomain(index) {
    EntitiesDrive.getInstance().openDomain(index);
}

function CloseDomain() {
    EntitiesDrive.getInstance().closeDomain();
}

Domain.prototype.createDropDownEditButton = function() {
    var dropDownMenu = document.createElement('div');
    dropDownMenu.setAttribute('class', 'edit');

    var dropDownButton = document.createElement('button');
    dropDownButton.setAttribute('class', 'editButton');
    dropDownButton.textContent = '...';
    dropDownMenu.appendChild(dropDownButton);

    var dropDownContent = document.createElement('div');
    dropDownContent.setAttribute('class', 'editContent');
    dropDownMenu.appendChild(dropDownContent);

    var editButton = document.createElement('button');
    editButton.setAttribute('class', 'editButton');
    editButton.setAttribute('onclick', 'redirectToEdit()');
    editButton.textContent = 'Edit';
    dropDownContent.appendChild(editButton);

    return dropDownMenu;
};

Domain.prototype.generateElement = function(index) {
    var domainElement = document.createElement('div');
    domainElement.setAttribute('class', 'entry');

    var imgElement = document.createElement('img');
    imgElement.setAttribute('src', this.img);
    imgElement.setAttribute('height', '250px');
    imgElement.setAttribute('width', '250px');
    imgElement.setAttribute('onclick', 'OpenDomain(' + index +')');
    domainElement.appendChild(imgElement);

    var textElement = document.createElement('div');
    textElement.setAttribute('class', 'container');
    domainElement.appendChild(textElement);

    var title = document.createElement('div');
    title.setAttribute('class', 'title');
    title.textContent = this.title;
    textElement.appendChild(title);

    textElement.appendChild(this.createDropDownEditButton());

    return domainElement;
};

Entity.prototype.createDropDownEditButton = function() {
    var dropDownMenu = document.createElement('div');
    dropDownMenu.setAttribute('class', 'edit');

    var dropDownButton = document.createElement('button');
    dropDownButton.setAttribute('class', 'editButton');
    dropDownButton.textContent = '...';
    dropDownMenu.appendChild(dropDownButton);

    var dropDownContent = document.createElement('div');
    dropDownContent.setAttribute('class', 'editContent');
    dropDownMenu.appendChild(dropDownContent);

    var editButton = document.createElement('button');
    editButton.setAttribute('class', 'editButton');
    editButton.setAttribute('onclick', 'redirectToEdit()');
    editButton.textContent = 'Edit';
    dropDownContent.appendChild(editButton);

    return dropDownMenu;
};

Entity.prototype.generateElement = function() {
    var entityElement = document.createElement('div');
    entityElement.setAttribute('class', 'entry');

    var imgElement = document.createElement('img');
    imgElement.setAttribute('src', 'https://images-na.ssl-images-amazon.com/images/I/31NaU1jyiUL._SL500_AC_SS350_.jpg');
    imgElement.setAttribute('height', '250px');
    imgElement.setAttribute('width', '250px');
    entityElement.appendChild(imgElement);

    var textElement = document.createElement('div');
    textElement.setAttribute('class', 'container');
    entityElement.appendChild(textElement);

    var title = document.createElement('div');
    title.setAttribute('class', 'title');
    title.textContent = this.title;
    textElement.appendChild(title);

    textElement.appendChild(this.createDropDownEditButton());

    return entityElement;
};

var EntitiesDrive = (function() {
    var instance;

    function createAddButton() {
        var addButtonRedirect = document.createElement('a');
        addButtonRedirect.setAttribute('href', '../pages/entity-config.html');

        var addButton = document.createElement('div');
        addButtonRedirect.appendChild(addButton);

        addButton.setAttribute('class', 'addButton');

        var imgElement = document.createElement('img');
        imgElement.setAttribute('src', '../assets/img/cross.png');
        imgElement.setAttribute('style', 'margin-top: 50px');
        imgElement.setAttribute('height', '150px');
        imgElement.setAttribute('width', '150px');

        var textElement = document.createElement('div');
        textElement.setAttribute('class', 'container');

        var title = document.createElement('h4');
        title.textContent = 'New Entity';
        textElement.appendChild(title);

        addButton.appendChild(imgElement);
        addButton.appendChild(textElement);
        return addButtonRedirect;
    }

    function createInstance() {
        var that = {};
        that.openedDomain = -1;

        that.entities = [new Domain('../assets/img/youtube.png', 'Youtube', [new Entity('BOOS')]),
            new Domain('../assets/img/facebook.jpg', 'Facebook', []),
            new Domain('../assets/img/twitter.jpg', 'Twitter', [])];

        that.openDomain = function(index) {
            that.openedDomain = index;
            that.clearEntities();
            that.renderEntities();
        };

        that.closeDomain = function() {
            that.openedDomain = -1;
            that.clearEntities();
            that.renderEntities();
        };

        that.clearEntities = function() {
            var child = document.getElementById('displayContainerChild');
            document.getElementById('displayContainer').removeChild(child);
        };

        that.renderEntities = function() {
            var entitiesElement = document.createElement('div');
            entitiesElement.setAttribute('class', 'displayContainer');
            entitiesElement.setAttribute('id', 'displayContainerChild');

            var index = 0;
            if (that.openedDomain !== -1) {
                that.entities[that.openedDomain].entities.forEach(function (item) {
                    entitiesElement.appendChild(item.generateElement(index));
                    index++;
                });
            } else {
                that.entities.forEach(function (item) {
                    entitiesElement.appendChild(item.generateElement(index));
                    index++;
                });
            }
            entitiesElement.appendChild(createAddButton());
            document.getElementById('displayContainer').appendChild(entitiesElement);
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

function initEntitiesDrive() {
    EntitiesDrive.getInstance().renderEntities();
}

// Add NavBar generation after page load w/o overriding.
if(window.attachEvent) {
    window.attachEvent('onload', initEntitiesDrive);
} else {
    if(window.onload) {
        var currentOnLoad = window.onload;
        window.onload = function(evt) {
            currentOnLoad(evt);
            initEntitiesDrive();
        };
    } else {
        window.onload = initEntitiesDrive;
    }
}

function redirectToEdit() {
    window.location.href = "../../pages/website-config.html";
}
