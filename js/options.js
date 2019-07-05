var client_id = "va97w97mn1qzq0nlrjavlifr92lstz";
var background = chrome.extension.getBackgroundPage();
        

$(document).ready(function () {

    $("#input-username").val(localStorage.username);
    $("#checkbox-dark").prop("checked", localStorage.dark == "true");
    $("#user-id").text("ID: " + localStorage.user_id);

    $("#button-save").click(function () { save() });

    if (localStorage.dark == "true") {
        document.getElementById("theme").href = "css/dark.css";
    }

   
});



function save() {

    loginToID($("#input-username").val())

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
            console.log(data);
            if(data.data.length > 0){
                background = chrome.extension.getBackgroundPage();
                localStorage.configured = "true";
                localStorage.username = data.data[0].display_name;
                localStorage.dark = $("#checkbox-dark").prop("checked");
                localStorage.user_id = data.data[0].id;
                background.getFollows(data.data[0].id);
                
                location.reload();
            }else{
                $("#input-username").css({"border-width":"2px", "border-color":"red"});

            }
            
           

        }
    });


}