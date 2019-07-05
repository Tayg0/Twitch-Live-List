var templateGameHeaderCard = "<div class=\"row\" id=\"{GAME-ID}\"><div class=\"col-xs-12 col-game-head\"><div class=\"card game-head\"><div class=\"card-body card-body-game-head\">{GAME}</div></div></div></div>";
var templateCard = "<div class=\"col-xs-3 col-stream-info\"><div class=\"card stream-info\"><div class=\"card-body card-body-stream-info\"><h6 class=\"card-title\">{USERNAME}<span class=\"viewers-text\"><div class=\"circle\"></div>{VIEWERS}</span></h6><p class=\"card-text\">{TITLE}</p></div></div></div>";
var templateThumbCard = "<div class=\"col-xs-3 col-stream-thumb\"><div class=\"card stream-thumb\" style=\"\"><img class=\"card-img\" src=\"{THUMBURL}\" alt=\"Stream Thumb\"></div></div>";
var game_ids;


$(document).ready(function () {

    if (localStorage.dark == "true") {
        document.getElementById("theme").href = "css/dark.css";
    }

    setTimeout(function () {
        $(".row .card").css("transition", "filter 0.5s ease, height 0.5s ease, width 0.5s ease, background-color 0.3s ease");
    }, 200);
    
    if(localStorage.configured == "true"){
        game_ids = JSON.parse(localStorage.game_ids);
        printStreams(JSON.parse(localStorage.streams));
        
    }else{

        chrome.tabs.create({ url: "options.html"});

    }


    

})

function printStreams(data) {

    console.log(data);
    $.each(data, function (index, value) {

        if (!$("#" + value.game_id).length) {
            console.log("WOULD HAVE CREATED HEADER FOR " + game_ids[value.game_id]);
            $("#stream-list").append(templateGameHeaderCard.replace("{GAME-ID}", value.game_id).replace("{GAME}", game_ids[value.game_id]));
        }
    });
    $.each(data.reverse(), function (index, value) {

        $("#" + value.game_id).after("<div class=\"row row-stream\" id=\"stream-" + value.user_id + "\"></div>");
        $("#stream-" + value.user_id).append(templateThumbCard.replace("{THUMBURL}", value.thumbnail_url).replace("{width}x{height}", "240x90"));
        $("#stream-" + value.user_id).append(templateCard.replace("{USERNAME}", value.user_name).replace("{TITLE}", value.title).replace("{VIEWERS}", value.viewer_count));
        $("#stream-" + value.user_id).click(function () { chrome.tabs.create({ url: "https://www.twitch.tv/" + encodeURI(value.user_name) }) })

    });

}







// function onStorageEvent(storageEvent){

//     alert("storage event");
// }

// window.addEventListener('storage', onStorageEvent, false);
