'use strict';

let TweetManager = require('./tweetmanager-dynamo.js').TweetManager;
let Fiber = require('fibers');

let tm = new TweetManager();

exports.start = function(event, context, callback) {
    let probablity = {};

    tm.listTweets(function(tweets) {
        tweets.filter(function(tweet) {
            return !tweet.retweet
        }).forEach(function(tweet) {
            tweet.text.split(' ').forEach(function (str) {
                str.split("\n").forEach(function(item) {
                    if (item.length > 4) {
                        let word = item.replace(/[\.,\- !\?\s:\+\(\)\[\]]+$/gm,'').trim();
                        probablity[word] = (probablity[word] || 0) + 1;
                    }
                });
            });
        });

        callback(null, probablity);
    });
}

