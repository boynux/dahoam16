Steps to go thought this workshop:

* Step 1: Create a IAM role in AWS console:

	* Type: Lambda
	* Policies: S3FullAccess & DynamoDBFullAccess

* Step 2: Create a new Lambda by uploading the content of this repository as a Zip file:

	* Handler: fetch.start
	* Role: Step 1 created role
	* Timeout: 5 minutes

* Step 3: Create a twitter app in https://apps.twitter.com/app:

	* Go to secrets and create Secret keys and token

* Step 4: Execute the lambda you've created in step 2 with the following config:

Please fill in twitter credentials from Step 3 respectively

	{
	    "consumerKey": "",
	    "consumerSecret": "",
	    "accessToken": "",
	    "accessTokenSecret": "",
	    "callBackUrl": ""
	}

	NOTE: Leave callbackUrl empty

* Step 5: Go to Event Source in Lambda created in Step 2 and set Event source to:
		
	* CloudWatch Event: Scheduler for every minute


* Step 6: Create a second Lambda with the same ZIP file:
	
	* Handler: display.start
	* Role: Step 1 created role
	* Timeout: 30 seconds

* Step 7: Create an API Gateway for the Lambda from Step 6 from API Endpoint tab:

	* Type: API Gateway
	* API Name: "DahoamTwitterAPI"
	* From Security choose "Open"
	* (Leave other field as it is)

* Step 8: Click on API Enpoint stage name (redirects to API Gateway page):

	* Choose the enpoint name you've created in step 7
	* From actions menu choose "Enable CORS"
	* From actions menu choose "Deploy API"
		

* Step 9: Edit views/list.html and replace the URL with the one you just created at step 7

	* Launch view/list.html in your browser, you should be able to see tweets

* Step 10: Create the 3rd Lambda from the same Zip file:

	* Handler: statistics.start
	* Role: Step 1 created role
	* Timeout: 30 seconds

* Step 11: Follow steps 7 & 8 for the Lambda created in Step 9

* Step 12: Edit view/cloud.html and replace the URL with the one you just created in API Endpoint

* Step 13: Lanuch view/cloud.html in your browser. You should be able to see the words cloud

* Step 14: **Please delete all resources after the workshop for security purpose.**
