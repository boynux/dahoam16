'use strict';

let AWS = require('aws-sdk');
let Fiber = require('fibers');

var TweetManager = class {
    constructor(config) {
        this.config = config;
    }

    getFile(bucket, key, callback) {
        var s3 = new AWS.S3();
        var params = {Bucket: bucket, Key: key};

        s3.getObject(params, callback);
    }

    putFile(bucket, key, content, errback) {
        var s3bucket = new AWS.S3({params: {Bucket: bucket}});
        s3bucket.createBucket(function() {
            var params = {Key: key, Body: content};
            s3bucket.upload(params, function(err, data) {
                if (err) {
                    errback(err);
                }
            });
        });

    }

    getState(f) {
        var s3 = new AWS.S3();
        var params = {Bucket: 'dahoamLambdaWorkshop', Key: 'state.json'};

        s3.getObject(params, function(err, data) {
            if(err) {
                f({'since_id': 0});
            } else {
                f(JSON.parse(data.Body))
            }
        });
    }

    storeState(state) {
        var s3bucket = new AWS.S3({params: {Bucket: 'dahoamLambdaWorkshop'}});
        s3bucket.createBucket(function() {
            var params = {Key: 'state.json', Body: JSON.stringify(state)};
            s3bucket.upload(params, function(err, data) {
                if (err) {
                    console.log("Error uploading data: ", err);
                } else {
                    console.log("Successfully uploaded state");
                }
            });
        });
    }

    storeTweet(tweet) {
        var id = tweet.id_str;
        var s3bucket = new AWS.S3({params: {Bucket: 'dahoamLambdaWorkshop'}});

        s3bucket.createBucket(function() {
            var params = {Key: 'tweet_' + id, Body: JSON.stringify(tweet)};
            s3bucket.upload(params, function(err, data) {
                if (err) {
                    console.log("Error uploading data: ", err);
                } else {
                    console.log("Successfully uploaded tweet");
                }
            });
        });
    }


    listTweets(f) {
        let s3 = new AWS.S3();
        s3.listObjects({Bucket: 'dahoamLambdaWorkshop', Prefix: 'tweet'}, function(err, data) {
            if(err) {
                f(null);
            } else {
                f(data.Contents.map(function(obj) {
                    return obj.Key;
                }));
            }
        });
    }

    getTweet(id, f) {
        let s3 = new AWS.S3();
        let params = {Bucket: 'dahoamLambdaWorkshop', Key: id};

        s3.getObject(params, function(err, data) {
            if(err) {
                f(null);
            } else {
                f(JSON.parse(data.Body))
            }
        });
    }
}

if (!(typeof exports === 'undefined')) {
    exports.TweetManager = TweetManager;
}
