var client_id = "va97w97mn1qzq0nlrjavlifr92lstz";



chrome.alarms.create("myAlarm", { delayInMinutes: 1, periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener(function () {

  console.log("Alarm Firing");
  getFollows(localStorage.user_id);

});

function getFollows(id) {

  $.ajax({
    type: 'GET',
    url: 'https://api.twitch.tv/helix/users/follows?first=100&from_id=' + id,
    dataType: 'json',
    headers: {
      'Client-ID': client_id
    },
    success: function (data) {

      var add = "";

      $.each(data.data, function (index, value) {
        add += "&user_login=" + value.to_name;
      });

      console.log(data);
      getStreams(add);

    }
  });

}

function getStreams(addon) {

  $.ajax({
    type: 'GET',
    url: 'https://api.twitch.tv/helix/streams?first=100' + addon,
    dataType: 'json',
    headers: {
      'Client-ID': client_id
    },
    success: function (data) {
      localStorage.streams = JSON.stringify(data.data);
      chrome.browserAction.setBadgeText({ text: data.data.length + "" })
      chrome.browserAction.setBadgeBackgroundColor({ color: "#9800ff" })
    }
  });

}


getFollows(localStorage.user_id);