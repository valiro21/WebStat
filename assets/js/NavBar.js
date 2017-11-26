function initNavBar(){
    var navbar = document.createElement('DIV');
    navbar.id = 'navBar';
    document.getElementsByTagName('header')[0].appendChild(navbar);
    var ulnode = document.createElement('UL');
    navbar.appendChild(ulnode);

    var buttonNames = ['Home', 'Statistic example', 'Statistic List', 'Create statistic'];
    var buttonLinks = ['../pages/frontPage.html', '../pages/realTimeData.html', '../pages/statisticsDrive.html', '../pages/statisticsConfig.html'];

    for (i = 0; i < buttonNames.length; i++){
        var linode = document.createElement('LI');
        ulnode.appendChild(linode);
        var anode = document.createElement('A');
        linode.appendChild(anode);
        anode.href = buttonLinks[i];
        anode.textContent = buttonNames[i];
    }
}

