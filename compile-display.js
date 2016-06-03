'use strict';

let TweetManager = require('./tweetmanager-dynamo.js').TweetManager;
let Fiber = require('fibers');

let tm = new TweetManager();

exports.start = function(event, context, callback) {
    tm.listTweets(function(tweets) {
        let result = tweets.filter(function(tweet) {
            return !tweet.retweet
        }).map(function(tweet) {
            return tweet.user + "(@" + tweet.handle + "): " + tweet.text;
        });

        callback(null, result);
    });
}

