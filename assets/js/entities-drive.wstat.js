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

function redirectToEdit(dName, title) {
    window.location.href = '../../wstat/pages/entity-config.html?domain_name=' + dName + '&entity_name=' + title;
}

function redirectToEditDomain(dName) {
    window.location.href = '../../wstat/pages/domain-config.html?domain_name=' + dName;
}

Domain.prototype.convertToJson = function() {
    var jSon = {};
    jSon['img'] = this.img;
    jSon['title'] = this.title;
    this.entities.forEach(function(entry) {
        jSon['entities'].push(entry.convertToJson());
    });
    return jSon;
};

Entity.prototype.convertToJson = function() {
    var jSon = {};
    jSon['title'] = this.title;
    return jSon;
};


Domain.prototype.createDropDownEditButton = function(dName) {
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
    editButton.setAttribute('onclick', 'redirectToEditDomain(\''+ dName +'\')');
    editButton.textContent = 'Edit';
    dropDownContent.appendChild(editButton);

    return dropDownMenu;
};

Domain.prototype.generateElement = function(index) {
    var domainElement = document.createElement('div');
    domainElement.setAttribute('class', 'entry');

    var imgElement = document.createElement('img');
    imgElement.setAttribute('src', '../assets/img/default.png');
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

    textElement.appendChild(this.createDropDownEditButton(this.title));

    return domainElement;
};

Entity.prototype.createDropDownEditButton = function(dName, title) {
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
    editButton.setAttribute('onclick', 'redirectToEdit(\''+ dName + '\',\'' + title + '\')');
    editButton.textContent = 'Edit';
    dropDownContent.appendChild(editButton);

    return dropDownMenu;
};

Entity.prototype.generateElement = function(domainName) {
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

    textElement.appendChild(this.createDropDownEditButton(domainName, this.title));

    return entityElement;
};

var EntitiesDrive = (function() {
    var instance;

    function createAddButton(domainName) {

        var addButtonRedirect = document.createElement('a');
        addButtonRedirect.setAttribute('href', '../pages/entity-config.html?domain_name=' + domainName);

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

        that.entities = [];

        /*that.entities.forEach(function(item) {
            var entities = [];
            var i;
            for (i = 0; i < item.entities.length; i++) {
                entities.push(item.entities[i].title);
            }
            entities.push(item.img);
            localStorage.setItem(item.title, entities);
        });*/

        var dNamesGot = localStorage.getItem('drive_dNames');

        if(dNamesGot !== null) {

            dNamesGot = dNamesGot.split(',');

            dNamesGot.forEach(function (item) {
                var dDomainGot = localStorage.getItem(item).split(',');
                var newD = new Domain(dDomainGot[dDomainGot.length - 1], item, []);
                for (var i = 0; i < dDomainGot.length - 1; i++) {
                    newD.entities.push(new Entity(dDomainGot[i]));
                }
                that.entities.push(newD);
            });
        } else {
            that.entities = [new Domain('../assets/img/default.png', 'Facebook', [new Entity('DA')])];
        }

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
                    entitiesElement.appendChild(item.generateElement(that.entities[that.openedDomain].title, index));
                    index++;
                });
            } else {
                that.entities.forEach(function (item) {
                    entitiesElement.appendChild(item.generateElement(index));
                    index++;
                });
            }
            if (that.openedDomain !== -1) {
                entitiesElement.appendChild(createAddButton(that.entities[that.openedDomain].title));
            }
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


if(window.attachEvent) {
    window.attachEvent('onload', initEntitiesDrive);
} else {
    if(window.onload) {
        var currentOnLoad = window.onload;
        window.onload = function(currentOnLoad, evt) {
            currentOnLoad(evt);
            initEntitiesDrive();
        }.bind(null, currentOnLoad);
    } else {
        window.onload = function(evt){initEntitiesDrive();};
    }
}