var paste = require("better-pastebin");
var request = require("sync-request");
var URL = "https://games.roblox.com/v1/games/3016661674/servers/Public?sortOrder=Asc&limit=100";
var interval = 1000*10*60;
var DATA = [];

function getServerData(cursor) {
    cursor = cursor || "";
    var body = JSON.parse(request("GET", URL+cursor).getBody().toString());
    var data = body.data;
    var c = body.nextPageCursor;
    if (c && "cursor="+c != cursor && data.length==100) {
        data = data.concat(getServerData("cursor="+c))
    }
    return data;
}

function getArrayData(arr) { //pirate time
    arr.sort(function(a,b){return a-b});
    var max = arr[arr.length-1];
    var min = arr[0];
    var med = arr[parseInt(arr.length/2)];
    var mode = arr.sort((a,b) => arr.filter(v => v===a).length - arr.filter(v => v===b).length).pop(); //thanks stackoverflow
    var avg = 0;
    for (var i = 0; i < arr.length; i++) {
        avg += arr[i];
    }
    avg = avg/arr.length;
    return [max, min, med, mode, avg];
}

paste.setDevKey(process.env.KEY);
paste.login("SlimeeMen22", process.env.PASS, (s, d) => {
    setInterval(function() {
        var data = getServerData();

        var playerCounts = [];
        var fpsCounts = [];
        var pingCounts = [];
    
        for (var i = 0; i < data.length; i++) {
            var datum = data[i];
            playerCounts[i] = datum.playing;
            fpsCounts[i] = datum.fps;
            pingCounts[i] = datum.ping;
        }
    
        var playerData = getArrayData(playerCounts);
        var fpsData = getArrayData(fpsCounts);
        var pingData = getArrayData(pingCounts);

        DATA[DATA.length] = [playerData, fpsData, pingData];
        paste.edit("bGwNmFPU", options={contents:JSON.stringify(DATA)});
    }, interval);
});
