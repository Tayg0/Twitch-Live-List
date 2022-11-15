//Copyright 2019, William Garrison

$("#theme").ready(function(){ //Theme change.

    document.getElementById("theme").href = 'css/themes/' + localStorage.theme + '.css';
    
});

$(document).ready(function () {

    $('body').contextmenu(function(){return false;});

    setTimeout(function () { //Delay before applying transition properties, helps to avoid color flashes from the theme change.

           if(localStorage.anim == 'true'){document.getElementById("anim").href = "css/anim.css";}

    }, 100);
    
    if(localStorage.authorized == 'true'){

        $("#stream-list").html(localStorage.htmlCapsule);
        addLinks(JSON.parse(localStorage.streams));
        
    }else{

        chrome.tabs.create({ url: "options.html"});

    }

    scrollPercent = $(window).scrollTop() / ( $(document).height() - $(window).height() );

    if(scrollPercent == 1){
        $('.scroll-icon').css({'opacity' : 0});
    }else{
        $('.scroll-icon').css({'opacity' : 1});
    }


    $(".spinner").click(function () { requestRefresh(); });
        


    updateScroll();


});

function requestRefresh(){ //Sends a message to background script requesting a refresh.

    chrome.runtime.sendMessage({message: "refresh"});

    chrome.runtime.onMessage.addListener(

        function (request, sender, sendResponse) {
    
            if (request.message == "refreshed"){

            location.reload(); //Refresh once content is generated in background script.

            }
        }
    );
    
};


function addLinks(data){

    $.each(data, function (index, value) {

        if (localStorage.popup == 'true') {

            $("#stream-" + value.user_id).click(function () { chrome.windows.create({ url: value.stream_url, type: 'popup', focused: true, width: 1050, height: 560 }); });
            
        } else {

            $("#stream-" + value.user_id).click(function () { chrome.tabs.create({ url: value.stream_url }) })
        
        }

        });


}

function updateScroll(){

    if( ($(document).height() - $(window).height()) > 0 ){
        scrollPercent = $(window).scrollTop() / ( $(document).height() - $(window).height() );

        if(scrollPercent == 1){
            $('.scroll-icon').css({'opacity' : 0});
        }else{
            $('.scroll-icon').css({'opacity' : 1});
        }
    }else{
        $('.scroll-icon').css({'display' : 'none', 'opacity' : 0});
    }

    setTimeout(function () { updateScroll(); }, 300);
};