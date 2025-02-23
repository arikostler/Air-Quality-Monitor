/**
 * Created by Arik on 8/14/2017.
 */

var autoRefreshJob = null;

$(document).ready(function () {
    refreshDisplay();
    autoRefresh();
});

function autoRefresh(){
    autoRefreshJob = setInterval(function(){
        refreshDisplay();
    }, 5000);
}

function refreshDisplay(){
    getStats().then(function (stats) {
        $('#temperature').html((stats.temperature * 9/5 + 32)+" &deg;F");
        $('#humidity').html(Math.round(stats.humidity)+" %");
        $('#ammonia').html(stats.ammonia);
		if (stats.ip){
			$('#ip_address').html('IP: '+stats.ip);
		}
    });
}

function getStats() {
    return new Promise(function (resolve, reject) {
        $.get('/api/stats').then(function (stats) {
            resolve(stats);
        });
    });
}
