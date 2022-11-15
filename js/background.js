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

chrome.alarms.create("refreshStreams", { delayInMinutes: 2.5, periodInMinutes: 2.5 });
chrome.alarms.create("validateAuth", { delayInMinutes: 30, periodInMinutes: 30 });
chrome.alarms.onAlarm.addListener(function (alarm) {

    if (alarm.name = 'refreshStreams') {
        getFollowedStreams();
    } 
    else if (alarm.name = 'validateAuth') {
        validateAuth();
    }
    
});

if (localStorage.authorized != 'true') {

    chrome.browserAction.setBadgeText({ text: "CLICK" });
    chrome.browserAction.setBadgeBackgroundColor({ color: "#6642A1" })

}

function getFollowedStreams() {
    if (localStorage.authorized != 'true'){return;}
    $.ajax({

        type: 'GET',
        url: 'https://api.twitch.tv/helix/streams/followed?user_id=' + localStorage.user_id,
        dataType: 'json',
        headers: { 
            'Client-Id': client_id,
            'Authorization': 'Bearer ' + localStorage.access_token,
            'Accept': 'application/vnd.twitchtv.v5+json'
        },
        success: function (data) {

            $.each(data.data, function(key, value){ //Resolve some important information in stream attributes.

                value.up_time = uptime(value.started_at);
                value.thumbnail_url = value.thumbnail_url.replace("{width}x{height}", "160x90");
                value.stream_url = "https://www.twitch.tv/" + encodeURI(value.user_name);

            });

            localStorage.streams = JSON.stringify(data.data);
            chrome.browserAction.setBadgeText({ text: data.data.length + "" });
            chrome.browserAction.setBadgeBackgroundColor(localStorage.theme.includes("mono") ? { color: '#636363'} : { color: '#7248b4'});
            generateHTML(data.data)

        },
        error: function (data) {
            if (data.status == 401) {
                invalidated();
            }
            
        }
    });
}

function validateAuth() {

    $.ajax({

        type: 'GET',
        url: 'https://id.twitch.tv/oauth2/validate',
        dataType: 'json',
        headers: { 
            'Authorization': 'Bearer ' + localStorage.access_token,
            'Accept': 'application/vnd.twitchtv.v5+json'
        },
        success: function (data) {

        },
        error: function (data) {
            if (data.status == 401) {
                invalidated();
            }
        }
    });

}

function invalidated() {
    console.log("Twitch Auth Invalidated")
    localStorage.authorized = 'false';
    chrome.browserAction.setBadgeText({ text: "CLICK" });
    chrome.browserAction.setBadgeBackgroundColor({ color: "#6642A1" })
}

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

            if (!html.includes(value.game_name)) {

                html += templateGameHeaderCard.replace(/{GAME-ID}/g, value.game_name).replace("{GAME}", value.game_name);

            }

            Cards = templateCards.replace("{USERID}", value.user_id).replace("{THUMBURL}", value.thumbnail_url).replace("{USERNAME}", value.user_name).replace("{TITLE}", value.title).replace("{VIEWERS}", value.viewer_count).replace("{TIME}", value.up_time);
            html = insertBefore(html, '<!--' + value.game_name + '-->', Cards);

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

getFollowedStreams()

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {

        if (request.message == "refresh")
        getFollowedStreams()

    }
);