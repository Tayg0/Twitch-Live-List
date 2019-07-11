//Copyright 2019, William Garrison

$("#theme").ready(function(){ //Theme change.

    document.getElementById("theme").href = 'css/themes/' + localStorage.theme + '.css';
    
});

$(document).ready(function () {
    
    setTimeout(function () { //Delay before applying transition properties, helps to avoid color flashes from the theme change.

           if(localStorage.anim == 'true'){document.getElementById("anim").href = "css/anim.css";}

    }, 100);
    
    if(localStorage.configured == "true"){

        $("#stream-list").html(localStorage.htmlCapsule);
        addLinks(JSON.parse(localStorage.streams));
        
    }else{

        chrome.tabs.create({ url: "options.html"});

    }

});

function addLinks(data){

    $.each(data, function (index, value) {

        if (localStorage.popup == 'true') {

            $("#stream-" + value.user_id).click(function () { chrome.windows.create({ url: value.stream_url, type: 'popup', focused: true, width: 1050, height: 560 }); });
            
        } else {

            $("#stream-" + value.user_id).click(function () { chrome.tabs.create({ url: value.stream_url }) })
        
        }

    });

}
