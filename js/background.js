//Copyright 2019, William Garrison

var client_id = "va97w97mn1qzq0nlrjavlifr92lstz"; //Twitch-API Client ID

var game_ids = localStorage.game_ids ? JSON.parse(localStorage.game_ids) : {};

var templateGameHeaderCard =
    '<div class="row row-game" id="{GAME-ID}">\
                <div class="card-body-game-head">{GAME}</div>\
    </div><!--{GAME-ID}-->';

var templateCards =
    '<div class="row row-stream" id="stream-{USERID}">\
        <div class="card-img"><img class="thumb" src="{THUMBURL}" alt="Stream Thumb"></div>\
        <div class="card-body-stream-info">\
            <span class="card-title">{USERNAME}</span></br>\
            <span class="card-text">{TITLE}</span>\
            <div class="viewers-text info-sub-text"><div class="circle"></div>{VIEWERS}</div>\
            <div class="started-text info-sub-text">{TIME}</div>\
        </div>\
    </div>';

chrome.alarms.create("myAlarm", { delayInMinutes: 2.5, periodInMinutes: 2.5 });
chrome.alarms.onAlarm.addListener(function () {

    getFollows(localStorage.user_id);

});


if (localStorage.configured != "true") {

    chrome.browserAction.setBadgeText({ text: "CLICK" });
    chrome.browserAction.setBadgeBackgroundColor({ color: "#6642A1" })

}


function getFollows(id) { //Get list of followed channels from Twitch API, send list to getStreams.

    if (localStorage.configured) {

        $.ajax({

            type: 'GET',
            url: 'https://api.twitch.tv/kraken/users/' + id + '/follows/channels?limit=100&sortby=last_broadcast',
            dataType: 'json',
            headers: { 
                'Client-ID': client_id,
                'Accept': 'application/vnd.twitchtv.v5+json'
            },
            success: function (data) {

                let add = [];
                $.each(data.follows, function (index, value) {

                    add.push(value.channel._id); //Generate URL query parameters, in this case a list of users.

                });

                getStreams(add);

            }
        });
    }
}


function getStreams(addon) { //Get stream information for followed channels from Twitch API, Update Local Storage, Set Badge.

    $.ajax({

        type: 'GET',
        url: 'https://api.twitch.tv/kraken/streams?channel=' + encodeURI(addon.toString()),
        dataType: 'json',
        headers: { 
            'Client-ID': client_id,
            'Accept': 'application/vnd.twitchtv.v5+json'
        },

        success: function (data) {
            console.log(data);
            $.each(data.streams, function(key, value){ //Resolve some important information in stream attributes.

                value.up_time = uptime(value.created_at);
                value.thumbnail_url = value.preview.template.replace("{width}x{height}", "160x90");
                value.stream_url = "https://www.twitch.tv/" + encodeURI(value.channel.name);

            });

            localStorage.streams = JSON.stringify(data.streams);
            chrome.browserAction.setBadgeText({ text: data.streams.length + "" });
            chrome.browserAction.setBadgeBackgroundColor(localStorage.theme.includes("mono") ? { color: '#636363'} : { color: '#7248b4'});
            //translateGames(data.data);
            generateHTML(data.streams)
        }
    });
}


/* function translateGames(streams) { //Get game titles from Twitch API if not already present in LocalStorage.

    var add = "";

    $.each(streams, function (index, value) { //Generate URL query parameters, in this case a list of games.

        if (!(value.game_id in game_ids)) {

            add += "&id=" + value.game_id;

        }

    });


    if (add.length > 0) {

        $.ajax({

            type: 'GET',
            url: 'https://api.twitch.tv/kraken/games?first=100' + add,
            dataType: 'json',
            headers: { 
                'Client-ID': client_id,
                'Accept': 'application/vnd.twitchtv.v5+json'
            },

            success: function (data) {

                $.each(data.data, function (index, value) {
                    game_ids[value.id] = value.name;

                });

                localStorage.game_ids = JSON.stringify(game_ids);
                generateHTML(streams)

            }

        });

    } else { generateHTML(streams) }
} */

function uptime(start_date) {

    stream_date = new Date(start_date);
    current_date = new Date();

    Dif = (current_date - stream_date);

    H = Math.floor(Dif / 3600000);
    M = Math.floor((Dif % 3600000) / 60000);

    return ((H > 0) ? (H + "h ") : ("")) + ((M > 0) ? (M + "m") : (""));

};

function generateHTML(data) { //Generates and stores HTML used to display stream list in popup.js.
    
    var html = "";

    if(data.length > 0){

        //var game_ids = JSON.parse(localStorage.game_ids);

        $.each(data, function (index, value) {

            if (!html.includes(value.game)) {

                html += templateGameHeaderCard.replace(/{GAME-ID}/g, value.game).replace("{GAME}", value.game);

            }

            Cards = templateCards.replace("{USERID}", value.channel._id).replace("{THUMBURL}", value.thumbnail_url).replace("{USERNAME}", value.channel.display_name).replace("{TITLE}", value.channel.status).replace("{VIEWERS}", value.viewers).replace("{TIME}", value.up_time);
            html = insertBefore(html, '<!--' + value.game + '-->', Cards);

        });
    }else{
        html = templateGameHeaderCard.replace(/{GAME-ID}/g, '').replace("{GAME}", 'No one is currently live!');
    }
    localStorage.htmlCapsule = html;
    chrome.runtime.sendMessage({message: "refreshed"});
};

function insertBefore(original, search, insert){ //Utility function for inserting a string before another given string.

    index = original.indexOf(search);
    var final = original.substring(0, index) + insert + original.substring(index);
    return index == -1 ? original : final;

}

getFollows(localStorage.user_id);


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {

        if (request.message == "refresh")
        getFollows(localStorage.user_id);

    }
);