var client_id = "va97w97mn1qzq0nlrjavlifr92lstz";
var background = chrome.extension.getBackgroundPage();
        
$(document).ready(function () {


    $("#input-username").val(localStorage.username);
    $("#checkbox-dark").prop("checked", localStorage.dark == "true");
    $("#user-id").text("ID: " + localStorage.user_id);

    $("#button-save").click(function () { save() });

    if (localStorage.dark == "true") {
        document.getElementById("theme").href = "css/dark.css";
        // console.log("DARKED")
    }

});

function save() {



    loginToID($("#input-username").val())
    console.log("Getting ID.");
    console.log(JSON.parse(localStorage.game_ids));
}

function loginToID(login) {

    user_id = "";

    $.ajax({
        type: 'GET',
        url: 'https://api.twitch.tv/helix/users?login=' + login,
        dataType: 'json',
        headers: {
            'Client-ID': client_id
        },
        success: function (data) {

            localStorage.username = $("#input-username").val();
            localStorage.dark = $("#checkbox-dark").prop("checked");
            localStorage.user_id = data.data[0].id;
            background.getFollows(data.data[0].id);
            console.log("Saved.");
            location.reload();
           

        }
    });


}