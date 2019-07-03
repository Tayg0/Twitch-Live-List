
var templateCard = "<div class=\"col-xs-3\"><div class=\"card\" style=\"width:291px\"><div class=\"card-body\"><h6 class=\"card-title\">{USERNAME}</h6><p class=\"card-text\">{TITLE}</p></div></div></div>";
var templateThumbCard = "<div class=\"col-xs-3\"><div class=\"card\" style=\"width:80px\"><img class=\"card-img\" src=\"{THUMBURL}\" alt=\"Stream Thumb\"></div></div>";

$(document).ready(function () {
    console.log("HERE BE INFO");
    printStreams(JSON.parse(localStorage.streams));
})

function printStreams(data) {

    $.each(data, function (index, value) {
        $("#stream-list").append("<div class=\"row\" id=\"stream-" + value.user_id + "\"></div>");
        $("#stream-" + value.user_id).append(templateThumbCard.replace("{THUMBURL}", value.thumbnail_url).replace("{width}x{height}", "160x90"));
        //$("#stream-"+value.user_id).append(templateThumbCard.replace("{THUMBURL}", value.thumbnail_url).replace("{width}x{height}", "80x45"));
        $("#stream-" + value.user_id).append(templateCard.replace("{USERNAME}", value.user_name).replace("{TITLE}", value.title));
        $("#stream-" + value.user_id).click(function () { chrome.tabs.create({ url: "https://www.twitch.tv/" + encodeURI(value.user_name) }) })
        console.log("Done.");
    });
    console.log("Done.");
    console.log(localStorage.Test);
}