function closeModal(){
    var modal = document.getElementsByClassName('modal')[0];
    modal.style.display = 'none';
}

function openModal(){
    var modal = document.getElementsByClassName('modal')[0];
    modal.style.display = 'block';
}

function onSubmit() {
    var domain_name = getParameterByName("domain_name");

    var create_new_domain = false;
    if (domain_name === null) {
        domain_name = document.getElementById("DomainAlias").value;
        create_new_domain = true;
    }

    var domain = {};
    domain["name"] = domain_name;
    domain["url"] = document.getElementById("DomainHostname").value;

    var parametersList = document.getElementById("parameters").children;
    var parameters = {};
    for(var idx = 0; idx < parametersList.length; idx++) {
        var parameter = parametersList[idx];

        var p = parameter.firstChild;
        parameters[p.innerHTML] = "";
    }

    domain["parameters"] = parameters;

    if (create_new_domain) {
        newDomain(domain_name);
    }

    saveDomain(domain_name, domain);

    window.location = "./entity-drive.html";
}

function initDomain() {
    var domain_name = getParameterByName("domain_name");

    if(domain_name !== null) {
        var domain = getDomain(domain_name);
        document.getElementById("DomainAlias").value = domain["name"];
        document.getElementById("DomainHostname").value = domain["url"];
        Object.keys(domain["parameters"]).forEach(function (value) {
            addAdhocEntry(value);
        });
    }
}

if(window.attachEvent) {
    window.attachEvent('onload', initDomain);
} else {
    if(window.onload) {
        var currentOnLoad = window.onload;
        window.onload = function(currentOnLoad, evt) {
            currentOnLoad(evt);
            initDomain();
        }.bind(null, currentOnLoad);
    } else {
        window.onload = function(evt){initDomain();};
    }
}