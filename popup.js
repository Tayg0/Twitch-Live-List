
var user_login = "TayG0";
var user_id = "";
var client_id = "va97w97mn1qzq0nlrjavlifr92lstz";

$(document).ready(function(){


    login2id(user_login);

    // var URL = "https://api.twitch.tv/kraken/users/" + encodeURI(user) + "/follows/channels?limit=100&client_id=" + client_id;
    // URL = "https://api.twitch.tv/kraken/users?login=TayG0&client_id=va97w97mn1qzq0nlrjavlifr92lstz";

    $(".header").append("Testing!")
})

function login2id(login){

    user_id = "";

    $.ajax({
        type: 'GET',
        url: 'https://api.twitch.tv/helix/users?login=TayG0',
        dataType: 'json',
        headers:{
          'Client-ID': 'va97w97mn1qzq0nlrjavlifr92lstz'
        },
        success: function(data) {
          console.log("Login: " + data.data[0].login + "   ID: " + data.data[0].id);
          user_id = data.data[0].id;
        }
       });


}

