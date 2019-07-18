//Copyright 2019, William Garrison

var client_id = "va97w97mn1qzq0nlrjavlifr92lstz"; //Twitch-API Client ID
        
$(document).ready(function () {

    if (localStorage.configured != "true") {

        localStorage.theme = 'light';
        localStorage.anim = 'true';

    }

    $('#select-theme option[value="' + localStorage.theme + '"]').prop('selected', true);
    $("#input-username").val(localStorage.username);
    $("#user-id").text("ID: " + localStorage.user_id);
    $("#checkbox-popup").prop("checked", localStorage.popup == "true");
    $("#checkbox-anim").prop("checked", localStorage.anim == "true");
    document.getElementById("theme").href = 'css/themes/' + localStorage.theme + '.css';
    $("#button-save").click(function () { save() });
    

});

function save() { loginToID($("#input-username").val()); };

function loginToID(login) {

    var req = $.ajax({

        type: 'GET',
        url: 'https://api.twitch.tv/helix/users?login=' + encodeURI(login),
        dataType: 'json',
        headers: { 'Client-ID': client_id },

        success: function (data) {

            if (data.data.length > 0) {

                localStorage.popup = $("#checkbox-popup").prop("checked");
                localStorage.anim = $("#checkbox-anim").prop("checked");
                localStorage.configured = "true";
                localStorage.theme = $("#select-theme").val();
                localStorage.username = data.data[0].display_name;
                localStorage.user_id = data.data[0].id;
                chrome.runtime.getBackgroundPage(function(bg){bg.getFollows(data.data[0].id)});
                location.reload();

            } else {

                $("#input-username").css({ "border": "3px solid red"});

            }
        }
    });
} ;

$( document ).ajaxError(function() {

    $("#input-username").css({ "border": "3px solid red"});

  });