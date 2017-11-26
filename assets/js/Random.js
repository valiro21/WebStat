
function getRandomInt(a, b) {
    return a + Math.floor(Math.random() * (b - a));
}

function getRandomRgb() {
    r = getRandomInt(5, 255);
    g = getRandomInt(5, 255);
    b = getRandomInt(5, 255);

    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
}

function getRgbaFromRgbSingle(rgb, alpha) {
    return rgb.replace('rgb', 'rgba').replace(')', ', ' + alpha + ')');
}

function getRgbaFromRgbArray(rgb, alpha) {
    ans = [];
    rgb.forEach( function (col) {
        ans.push(getRgbaFromRgbSingle(col, alpha))
    });

    return ans;
}

function getRandomColors(cnt) {
    colors = [];
    for (i = 0; i < cnt; ++i) {
        colors.push(getRandomRgb());
    }
    return colors;
}