
var user_login = "TayG0";
var user_id = "";
var client_id = "va97w97mn1qzq0nlrjavlifr92lstz";

var templateCard = "<div class=\"col-xs-3\"><div class=\"card\" style=\"width:128px\"><img class=\"card-img-top\" src=\"{THUMBURL}\" alt=\"Card image\"><div class=\"card-img-overlay\"><p class=\"card-text\">🙍‍{VIEWS}</p></div><div class=\"card-body\"><h6 class=\"card-title\">{USERNAME}</h6><p class=\"card-text\">{GAME}</p></div></div></div>";











;





$(document).ready(function(){

    loginToID(user_login);

})

function loginToID(login){

    user_id = "";

    $.ajax({
        type: 'GET',
        url: 'https://api.twitch.tv/helix/users?login=' + login,
        dataType: 'json',
        headers:{
          'Client-ID': client_id
        },
        success: function(data) {
          console.log("Login: " + data.data[0].login + "   ID: " + data.data[0].id);
          user_id = data.data[0].id;
          getFollows(user_id);
        }
       });


}

function getFollows(id){

    $.ajax({
        type: 'GET',
        url: 'https://api.twitch.tv/helix/users/follows?first=100&from_id=' + id,
        dataType: 'json',
        headers:{
          'Client-ID': client_id
        },
        success: function(data) {

            var add = "";

            $.each(data.data, function(index, value){
                add += "&user_login=" + value.to_name;
            });

            console.log(data);
            getStreams(add);

        }
       });

}

function getStreams(addon){

    $.ajax({
        type: 'GET',
        url: 'https://api.twitch.tv/helix/streams?first=100' + addon,
        dataType: 'json',
        headers:{
          'Client-ID': client_id
        },
        success: function(data) {
          console.log(data);
          printStreams(data);
        }
       });

}













function printStreams(data){

    $.each(data.data, function(index, value){
      $(".row").append(templateCard.replace("{USERNAME}", value.user_name).replace("{THUMBURL}", value.thumbnail_url).replace("{width}x{height}", "128x72").replace("{VIEWS}", "" + value.viewer_count))
      console.log("Done.");
    });
    console.log("Done.");
    // chrome.browserAction.setBadgeText({text: data.data.length + ""})
    // chrome.browserAction.setBadgeBackgroundColor({color: "#9800ff"})
}