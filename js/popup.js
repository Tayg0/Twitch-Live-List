//Copyright 2019, William Garrison

var templateGameHeaderCard = 
    '<div class="row" id="{GAME-ID}">\
        <div class="col-xs-12 col-game-head" >\
            <div class="card game-head">\
                <div class="card-body card-body-game-head">{GAME}</div>\
            </div>\
        </div>\
    </div>';

var templateCard = 
    '<div class="col-xs-3 col-stream-info">\
        <div class="card stream-info">\
            <div class="card-body card-body-stream-info">\
                <h6 class="card-title">{USERNAME}</h6>\
                <p class="card-text">{TITLE}</p>\
                <div class="viewers-text info-sub-text"><div class="circle"></div>{VIEWERS}</div>\
                <div class="started-text info-sub-text">{TIME}</div>\
            </div>\
        </div>\
    </div>';

var templateThumbCard = 
    '<div class="col-xs-3 col-stream-thumb">\
        <div class="card stream-thumb" style="">\
            <img class="card-img" src="{THUMBURL}" alt="Stream Thumb">\
        </div>\
    </div>';

var game_ids;


$("#theme").ready(function(){ //Theme change.

    document.getElementById("theme").href = 'css/themes/' + localStorage.theme + '.css';
    
});

$(document).ready(function () {
    
    setTimeout(function () { //Delay before applying transition properties, helps to avoid color flashes from the theme change.

           if(localStorage.anim == 'true'){document.getElementById("anim").href = "css/anim.css";}

    }, 100);
    
    if(localStorage.configured == "true"){

        game_ids = JSON.parse(localStorage.game_ids);
        printStreams(JSON.parse(localStorage.streams));
        
    }else{

        chrome.tabs.create({ url: "options.html"});

    }

});

function printStreams(data) {

    $.each(data, function (index, value) {

        if (!$("#" + value.game_id).length) {

            $("#stream-list").append(templateGameHeaderCard.replace("{GAME-ID}", value.game_id).replace("{GAME}", game_ids[value.game_id]));

        }

    });

    $.each(data.reverse(), function (index, value) {

        $("#" + value.game_id).after("<div class=\"row row-stream\" id=\"stream-" + value.user_id + "\"></div>");
        $("#stream-" + value.user_id).append(templateThumbCard.replace("{THUMBURL}", value.thumbnail_url));
        $("#stream-" + value.user_id).append(templateCard.replace("{USERNAME}", value.user_name).replace("{TITLE}", value.title).replace("{VIEWERS}", value.viewer_count).replace("{TIME}", value.up_time));

        if (localStorage.popup == 'true') {

            $("#stream-" + value.user_id).click(function () { chrome.windows.create({ url: value.stream_url, type: 'popup', focused: true, width: 1050, height: 560 }); });
            
        } else {

            $("#stream-" + value.user_id).click(function () { chrome.tabs.create({ url: value.stream_url }) })
        
        }


    });

};

