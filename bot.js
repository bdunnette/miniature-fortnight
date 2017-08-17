var twit = require('twit'),
  Datastore = require('nedb'),
  db = new Datastore({ filename: './trumoji.db', autoload: true }),
  config = require('./config.js'),
  translate = require('moji-translate'),
  Twitter = new twit(config);

var options = { screen_name: 'realDonaldTrump', count: 10, exclude_replies: true, include_rts: false};

// console.log(db);

Twitter.get('statuses/user_timeline', options , function(err, data) {
  data.forEach(function(t){
    var tweetText = t.text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
    var allEmoji = translate.translate(tweetText, true);
    if (allEmoji.length > 3) {
      console.log(tweetText);
      console.log(allEmoji.length, allEmoji);
      var emojiTweet = { status: `@realDonaldTrump says: ${allEmoji}`, in_reply_to_status_id: t.id, in_reply_to_user_id: t.user.id };
      console.log(emojiTweet);
      Twitter.post('statuses/update', emojiTweet, function(err, data, response) {
          console.log(data);
      });
    }
  });
});
