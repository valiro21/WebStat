function initNavBar(){
    var navbar = document.createElement('DIV');
    navbar.id = 'navBar';
    document.getElementsByTagName('header')[0].appendChild(navbar);
    var ulnode = document.createElement('UL');
    navbar.appendChild(ulnode);

    var buttonNames = [
        'Home',
        'Statistic example',
        'Statistic List',
        'Entity List',
        'Create statistic'
    ];

    var buttonLinks = [
        '../pages/frontPage.html',
        '../pages/realTimeData.html',
        '../pages/statisticsDrive.html',
        '../pages/entityDrive.html',
        '../pages/statisticsConfig.html'
    ];

    // Dynamically generating the link list
    for (var i = 0; i < buttonNames.length; i++){
        var linode = document.createElement('LI');
        ulnode.appendChild(linode);
        var anode = document.createElement('A');
        linode.appendChild(anode);
        anode.href = buttonLinks[i];
        anode.textContent = buttonNames[i];
    }
}

// Add NavBar generation after page load w/o overriding.
if(window.attachEvent) {
    window.attachEvent('onload', initNavBar);
} else {
    if(window.onload) {
        var currentOnLoad = window.onload;
        window.onload = function(evt) {
            currentOnLoad(evt);
            initNavBar();
        };
    } else {
        window.onload = initNavBar;
    }
}
