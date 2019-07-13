//Copyright 2019, William Garrison

var client_id = "va97w97mn1qzq0nlrjavlifr92lstz"; //Twitch-API Client ID

var game_ids = localStorage.game_ids ? JSON.parse(localStorage.game_ids) : {};

var templateGameHeaderCard =
    '<div class="row" id="{GAME-ID}">\
        <div class="col-xs-12 col-game-head" >\
            <div class="card game-head">\
                <div class="card-body card-body-game-head">{GAME}</div>\
            </div>\
        </div>\
    </div><!--{GAME-ID}-->';

var templateCards =
    '<div class="row row-stream" id="stream-{USERID}">\
        <div class="col-xs-3 col-stream-thumb">\
            <div class="card stream-thumb" style="">\
                <img class="card-img" src="{THUMBURL}" alt="Stream Thumb">\
            </div>\
        </div>\
        <div class="col-xs-3 col-stream-info">\
            <div class="card stream-info">\
                <div class="card-body card-body-stream-info">\
                    <h6 class="card-title">{USERNAME}</h6>\
                    <p class="card-text">{TITLE}</p>\
                    <div class="viewers-text info-sub-text"><div class="circle"></div>{VIEWERS}</div>\
                    <div class="started-text info-sub-text">{TIME}</div>\
                </div>\
            </div>\
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
            url: 'https://api.twitch.tv/helix/users/follows?first=100&from_id=' + id,
            dataType: 'json',
            headers: { 'Client-ID': client_id },

            success: function (data) {

                var add = "";

                $.each(data.data, function (index, value) {

                    add += "&user_login=" + value.to_name; //Generate URL query parameters, in this case a list of users.

                });

                getStreams(add);

            }
        });
    }
}


function getStreams(addon) { //Get stream information for followed channels from Twitch API, Update Local Storage, Set Badge.

    $.ajax({

        type: 'GET',
        url: 'https://api.twitch.tv/helix/streams?first=100' + addon,
        dataType: 'json',
        headers: { 'Client-ID': client_id },

        success: function (data) {

            $.each(data.data, function(key, value){ //Resolve some important information in stream attributes.

                value.up_time = uptime(value.started_at);
                value.thumbnail_url = value.thumbnail_url.replace("{width}x{height}", "240x90");
                value.stream_url = "https://www.twitch.tv/" + encodeURI(value.user_name);

            });

            localStorage.streams = JSON.stringify(data.data);
            chrome.browserAction.setBadgeText({ text: data.data.length + "" });
            chrome.browserAction.setBadgeBackgroundColor(localStorage.theme.includes("mono") ? { color: '#636363'} : { color: '#7248b4'});
            translateGames(data.data);

        }
    });
}


function translateGames(streams) { //Get game titles from Twitch API if not already present in LocalStorage.

    var add = "";

    $.each(streams, function (index, value) { //Generate URL query parameters, in this case a list of games.

        if (!(value.game_id in game_ids)) {

            add += "&id=" + value.game_id;

        }

    });


    if (add.length > 0) {

        $.ajax({

            type: 'GET',
            url: 'https://api.twitch.tv/helix/games?first=100' + add,
            dataType: 'json',
            headers: { 'Client-ID': client_id },

            success: function (data) {

                $.each(data.data, function (index, value) {
                    game_ids[value.id] = value.name;

                });

                localStorage.game_ids = JSON.stringify(game_ids);
                generateHTML(streams)

            }

        });

    } else { generateHTML(streams) }
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

    var game_ids = JSON.parse(localStorage.game_ids);
    var html = "";

    $.each(data, function (index, value) {

        if (!html.includes(value.game_id)) {

            html += templateGameHeaderCard.replace(/{GAME-ID}/g, value.game_id).replace("{GAME}", game_ids[value.game_id]);

        }

        Cards = templateCards.replace("{USERID}", value.user_id).replace("{THUMBURL}", value.thumbnail_url).replace("{USERNAME}", value.user_name).replace("{TITLE}", value.title).replace("{VIEWERS}", value.viewer_count).replace("{TIME}", value.up_time);
        html = insertBefore(html, '<!--' + value.game_id + '-->', Cards);

    });

    localStorage.htmlCapsule = html;

};

function insertBefore(original, search, insert){ //Utility function for inserting a string before another given string.

    index = original.indexOf(search);
    var final = original.substring(0, index) + insert + original.substring(index);
    return index == -1 ? original : final;

}

getFollows(localStorage.user_id);
