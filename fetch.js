"use strict";

let Twitter = require('twitter-node-client').Twitter;
let TweetManager = require('./tweetmanager-dynamo').TweetManager;

exports.start = function (config) {
    var twitter = new Twitter(config);
    var tweetManager = new TweetManager();

    //Callback functions
    var error = function(err, response, body) {
        console.log('ERROR %s', body);
    };

    var success =function(str) {
        var data = JSON.parse(str);
        var tweetManager = new TweetManager();

        data.statuses.forEach(function(item) {
            tweetManager.storeTweet({
                    id: item.id,
                    text: item.text,
                    user: item.user.name,
                    handle: item.user.screen_name,
                    retweet: !!item.retweeted_status,
                    retweet_count: item.retweet_count
            })
            console.log('Data %s', JSON.stringify(item.text));
        });

        tweetManager.storeState(data.search_metadata);

    };

    tweetManager.getState(function(state) {
        twitter.getSearch({'q': '#dahoam16', 'count': 100, 'since_id': state.max_id, result_type: 'recent'}, error, success);
    });
}

