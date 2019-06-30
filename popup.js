
var user_login = "TayG0";
var user_id = "";
var client_id = "va97w97mn1qzq0nlrjavlifr92lstz";

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
            console.log(add);
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

        $("table").append(
            "<tr id=\""+index+"\">"+
            "<td>"+
            value.user_name+
            "</td>"+
            "<td>"+
            value.title+
            "</td>"+
            "</tr>"
        );
        
        $("#" + index).click(function(){$(document).location = "https://www.twitch.tv/" + value.user_name})
    });
    console.log("Done.");
    chrome.browserAction.setBadgeText({text: data.data.length + ""})
    chrome.browserAction.setBadgeBackgroundColor({color: "#9800ff"})
}