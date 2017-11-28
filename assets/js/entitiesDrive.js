function Entity(img, url, title) {
    this.img = img;
    this.url = url;
    this.title = title;
}

Entity.prototype.createDropDownEditButton = function() {
    var dropDownMenu = document.createElement('div');
    dropDownMenu.setAttribute('class', 'edit');

    var dropDownButton = document.createElement('button');
    dropDownButton.setAttribute('class', 'editButton');
    dropDownButton.textContent = '...';

    var dropDownContent = document.createElement('div');
    dropDownContent.setAttribute('class', 'editContent');

    var deleteButton = document.createElement('button');
    deleteButton.setAttribute('class', 'editButton');
    deleteButton.textContent = 'Delete';

    var editButton = document.createElement('button');
    editButton.setAttribute('class', 'editButton');
    editButton.textContent = 'Edit';

    dropDownMenu.appendChild(dropDownButton);
    dropDownMenu.appendChild(dropDownContent);
    dropDownContent.appendChild(deleteButton);
    dropDownContent.appendChild(editButton);

    return dropDownMenu;
};

Entity.prototype.generateElement = function() {
    var entityElementLink = document.createElement('a');
    entityElementLink.setAttribute('href', this.url);

    var entityElement = document.createElement('div');
    entityElementLink.appendChild(entityElement);
    entityElement.setAttribute('class', 'entry');

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

    textElement.appendChild(this.createDropDownEditButton());
    entityElement.appendChild(imgElement);
    entityElement.appendChild(textElement);

    return entityElementLink;
};

var EntitiesDrive = (function() {
    var instance;

    function createAddButton() {
        var addButtonRedirect = document.createElement('a');
        addButtonRedirect.setAttribute('href', '../pages/EntityConfig.html');

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

        that.entities = [new Entity('../assets/img/youtube.png', '#', 'Youtube'),
            new Entity('../assets/img/facebook.jpg', '#', 'Facebook'),
            new Entity('../assets/img/twitter.jpg', '#', 'Twitter')];

        that.addEntity = function() {
        };

        that.deleteEntity = function() {
        };

        that.getEntity = function() {
        };

        that.renderEntities = function() {
            var entitiesElement = document.createElement('div');
            entitiesElement.setAttribute('class', 'displayContainer');

            that.entities.forEach(function(item) {
                entitiesElement.appendChild(item.generateElement());
            });
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
