//Copyright 2019, William Garrison

var client_id = "va97w97mn1qzq0nlrjavlifr92lstz"; //Twitch-API Client ID
var redirect_uri = chrome.identity.getRedirectURL()
var response_type = "token"
var scope = "user:read:follows"
var state = ""

$(document).ready(function () {
    console.log('test1')
    if (localStorage.theme == null) {

        localStorage.theme = 'dark';
        localStorage.anim = 'true';

    }

    if (localStorage.authorized == 'true'){
        $("#button-auth").hide()
    } else {
        $("#auth-info").hide()

        if (localStorage.setup == 'true') {

            $("#button-auth").text("Re-Authorize With Twitch")

        }

    }


    $('#select-theme option[value="' + localStorage.theme + '"]').prop('selected', true);
    $("#input-username").val(localStorage.username);
    $("#user-id").text("ID: " + localStorage.user_id);
    $("#checkbox-popup").prop("checked", localStorage.popup == 'true');
    $("#checkbox-anim").prop("checked", localStorage.anim == 'true');
    document.getElementById("theme").href = 'css/themes/' + localStorage.theme + '.css';
    $("#button-save").click(function () { save(); });
    $("#button-auth").click(function () { console.log('test2'); authorize(); });
    console.log('test4')
});

function oauth_url() {

    return `https://id.twitch.tv/oauth2/authorize?client_id=${encodeURIComponent(client_id)}&redirect_uri=${encodeURIComponent(redirect_uri)}&response_type=${encodeURIComponent(response_type)}&scope=${encodeURIComponent(scope)}&state=${encodeURIComponent(state)}`

}

function authorize() {
    console.log('test3')
    state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    console.log(oauth_url())
    chrome.identity.launchWebAuthFlow({url: oauth_url(), interactive: true}, (redirect_url) => {

        let accessToken = redirect_url.substring(redirect_url.indexOf('access_token=') + 13);
        accessToken = accessToken.substring(0, accessToken.indexOf('&'));
        localStorage.access_token = accessToken;

        $.ajax({

            type: 'GET',
            url: 'https://id.twitch.tv/oauth2/validate',
            dataType: 'json',
            headers: { 
                'Authorization': 'Bearer ' + localStorage.access_token,
                'Accept': 'application/vnd.twitchtv.v5+json'
            },
            success: function (data) {

                localStorage.username = data.login
                localStorage.user_id = data.user_id
                localStorage.setup = 'true';
                localStorage.authorized = 'true';
                location.reload();
                chrome.runtime.getBackgroundPage(function(bg){bg.getFollowedStreams()});

            },
            error: function (data) {
    
            }
        });
        
    })

}

function save() { 

                localStorage.popup = $("#checkbox-popup").prop("checked");
                localStorage.anim = $("#checkbox-anim").prop("checked");

                localStorage.theme = $("#select-theme").val();

                location.reload();

} ;

$( document ).ajaxError(function() {

    $("#input-username").css({ "border": "3px solid red"});

});