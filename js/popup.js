//Copyright 2019, William Garrison

$("#theme").ready(function(){ //Theme change.

    document.getElementById("theme").href = 'css/themes/' + localStorage.theme + '.css';
    
});

$(document).ready(function () {

    // $('body').contextmenu(function(){return false;});

    setTimeout(function () { //Delay before applying transition properties, helps to avoid color flashes from the theme change.

           if(localStorage.anim == 'true'){document.getElementById("anim").href = "css/anim.css";}

    }, 100);
    
    if(localStorage.configured == "true"){

        $("#stream-list").html(localStorage.htmlCapsule);
        addLinks(JSON.parse(localStorage.streams));
        
    }else{

        chrome.tabs.create({ url: "options.html"});

    }

    scrollPercent = $(window).scrollTop() / ( $(document).height() - $(window).height() );
    console.log(scrollPercent);

    if(scrollPercent == 1){
        $('.scroll-icon').css({'opacity' : 0});
    }else{
        $('.scroll-icon').css({'opacity' : 1});
    }


    $(".spinner").click(function () { requestRefresh(); });
        


    updateScroll();


});

function requestRefresh(){

    console.log("Message sent.");

    chrome.runtime.sendMessage({message: "refresh"});

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
    
            if (request.message == "refreshed"){
            console.log("Message recieved.");
            location.reload();
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

        // var img = document.createElement('img');
        // img.crossOrigin = "Anonymous";
        // img.setAttribute('src', value.thumbnail_url);
        // img.addEventListener('load', function() {
        //     var vibrant = new Vibrant(img);
        //     var swatches = vibrant.swatches();
        //     Color = swatches.Vibrant;
        //     $("#stream-" + value.user_id + " .card-title").css({"color" : Color.getHex()});
            // $("#stream-" + value.user_id + " .card-text").css({"color" : Color.getBodyTextColor()});
        });
        // 
        // $("#stream-"+value.user_id+" .card-title").html(swatches.darkmuted);

}


// $(window).scroll(function(){


//     updateScroll();


// });

function updateScroll(){


    scrollPercent = $(window).scrollTop() / ( $(document).height() - $(window).height() );

    if(scrollPercent == 1){
        $('.scroll-icon').css({'opacity' : 0});
    }else{
        $('.scroll-icon').css({'opacity' : 1});
    }

    setTimeout(function () { updateScroll(); }, 250);
};