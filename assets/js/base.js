document.registerElement('page-content');

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status === 0)
            {
                return rawFile.responseText;
            }
        }
    };
}

var RenderStatisticsDrive = function() {

    //TO DO: get the template from the file
    document.getElementsByTagName("page-content")[0].innerHTML = '<div>Hello this is the Drive!</div>';
};

var RealTimeData = function() {

    //TO DO: get the template from the file
    document.getElementsByTagName("page-content")[0].innerHTML = '<div>Hello this is real time statistics!</div>';
};