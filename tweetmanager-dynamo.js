'use strict';

let AWS = require('aws-sdk');

var TweetManager = class {

    constructor(config) {
	    AWS.config.update({
            region: 'eu-west-1'
        });

        this.config = config;
        this.client = new AWS.DynamoDB.DocumentClient();
        this.dynamo_table = 'dahoam-workshop-tweets';
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

    ensureTable(table, f) {
        var params = {
            TableName : table,
            KeySchema: [
                { AttributeName: "id", KeyType: "HASH"}
            ],
            AttributeDefinitions: [
                { AttributeName: "id", AttributeType: "N" }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 10,
                WriteCapacityUnits: 10
            }
        };

        let dynamodb = new AWS.DynamoDB();
        dynamodb.createTable(params, function(err, data) {
            if (err) {
                if (err.code == "ResourceInUseException") {
                    // Table already exists ...
                    f();
                } else {
                    console.error("Unable to create table. Error: ", JSON.stringify(err));
                }
            } else {
                f();
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
        let params = {
            TableName: this.dynamo_table,
            AttributeUpdates: {
                'user.location': { Action: "DELETE" },
                location: { Action: "DELETE" },
                description: { Action: "DELETE" }
            },
            Item: tweet
        };

        let that = this;
        this.ensureTable(this.dynamo_table, function() {
            that.client.put(params, function(err, data) {
                if (err) {
                    console.log("Error uploading data: ", err);
                } else {
                    console.log("Successfully uploaded tweet");
                }
            });
        });
    }


    listTweets(f) {
        let params = {
            TableName: this.dynamo_table,

        };

        this.client.scan(params, function(err, data) {
            if(err) {
                console.error(err);
                f(null);
            } else {
                f(data.Items)
            }
        });
    }
}

if (!(typeof exports === 'undefined')) {
    exports.TweetManager = TweetManager;
}
