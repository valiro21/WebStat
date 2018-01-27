var clientInfo = {
    client_id : '',
    redirect_uri : 'https://localhost:5000/login-callback.html'
};

function build_query(params) {
    return Object.keys(params)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
        .join('&');
}

function requestImplicitToken(api_url, clientInfo) {
    var query = build_query(clientInfo);
    var url = api_url + '?' + query;
}

function getParameterByName(name) {
    var match = RegExp('[#&]' + name + '=([^&]*)').exec(window.location.hash);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function saveImplicitToken() {
    var token = getParameterByName('access_token');
}