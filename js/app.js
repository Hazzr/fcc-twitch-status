/**
 * Created by Hazzr on 20/03/2016.
 */

// List of streamers usernames to query
var default_streamers = [
  "freecodecamp",
  "storbeck",
  "terakilobyte",
  "habathcx",
  "RobotCaleb",
  "thomasballinger",
  "noobs2ninjas",
  "beohoff",
  "brunofin",
  "comster404",
  "test_channel",
  "cretetion",
  "sheevergaming",
  "TR7K",
  "OgamingSC2",
  "ESL_SC2"
];

// Arrays for online and offline html strings; these strings hold the state of the
// streamers after queryTwitch() has been called.
var online_html = [];
var offline_html = [];

// jQuery entry point. Set up even handlers and query the twitch api.
$(document).ready(function () {

  // Add link event handlers
  $('#link-all').on('click', drawAll);
  $('#link-online').on('click', drawOnline);
  $('#link-offline').on('click', drawOffline);

  // Query the twitch api
  queryTwitch(default_streamers);
});

// Query the twich api, with the provided array of twitch username strings.
function queryTwitch(streamers) {

  // Iterate through the list of streamers and query asynchronously.
  streamers.forEach(function (val) {

    // State for each streamer.
    var streamer = val;
    var status, title, thumbnail, url;

    // Query twitch for the stream status.
    $.getJSON('https://api.twitch.tv/kraken/streams/' + val + '?callback=?', function (data) {
      if (data.stream === null) {
        status = 'offline';
      } else if (data.stream === undefined) {
        status = 'deleted';
      } else {
        status = 'online';
      }

      // Query twitch for the stream channel information.
      $.getJSON('https://api.twitch.tv/kraken/channels/' + val + '?callback=?', function (data) {

        // Set stream data
        if (status == 'online') {
          title = data.status;
          thumbnail = data.logo;
          streamer = data.display_name;
          url = data.url;

        } else if (status == 'deleted') {
          title = 'Account has been deleted! / Does not exist!';
          thumbnail = 'http://dummyimage.com/50x50/ecf0e7/5c5457.jpg&text=0x3F';
        } else {
          title = 'Offline';
          thumbnail = data.logo;
          if (thumbnail == null) {
            thumbnail = 'http://dummyimage.com/50x50/ecf0e7/5c5457.jpg&text=0x3F';
          }
          url = data.url;
        }

        // Generate html
        var htmlStr =
          '<div class="stream-container ' + (status == 'online' ? 'stream-online' : '') + '">' +
          '  <div class="col-xs-1 stream-icon">' +
          '    <img class="img-circle img-fluid image" src="' + thumbnail + '">' +
          '  </div>' +
          '  <div class="col-xs-3 text-xs-center streamer"><a href="' + url + '" target="_blank">' + streamer + '</a></div> ' +
          '  <div class="col-xs-8 stream-title ellipsis">' + title + '</div>' +
          '</div>';

        // Push each html string in to the appropriate array.
        if (status == 'online') {
          online_html.push(htmlStr);
        } else {
          offline_html.push(htmlStr);
        }

        // Redraws after each element is generated.
        drawAll();
      });
    });
  });
}

// Draw all streamers in both arrays.
function drawAll() {
  // Clear the streamers dom element
  $('#streamers').empty();

  // Draw online streamers
  online_html.forEach(function (htmlStr) {
    $('#streamers').append(htmlStr);
  });

  // Draw offline streamers
  offline_html.forEach(function (htmlStr) {
    $('#streamers').append(htmlStr);
  });
}

// Draw the streamers in the online array.
function drawOnline() {
  // Clear the streamers dom element
  $('#streamers').empty();

  // Draw online streamers
  online_html.forEach(function (htmlStr) {
    $('#streamers').append(htmlStr);
  });
}

// Draw the streamers in the offline array.
function drawOffline() {
  // Clear the streamers dom element
  $('#streamers').empty();

  // Draw offline streamers
  offline_html.forEach(function (htmlStr) {
    $('#streamers').append(htmlStr);
  });
}