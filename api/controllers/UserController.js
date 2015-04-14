/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var MisfitAPI = require('misfit-cloud-api');
var passport = require('passport');
var fs = require('fs');
var https = require('https');

module.exports = {

	login: function(req, res){
		res.view();
	},

	logout: function(req, res){
		req.session.user = null;
		req.session.flash = 'you have logged out';
		res.redirect('/user/login');
	},

	/*
	Handles hooking up to the Misfit subscriptionAPI.

	TODO:
	Update user models when notification is received.
	*/
	notification: function(req, res){
		//subscrition handler
		var subscribeURL = req.body['SubscribeURL'];
		if(subscribeURL){
			https.get(subscribeURL, function(res){
				console.log("Got response: " + res.statusCode);
			}).on('error', function(err){
				console.log("Got error: " + err.message);
			});
		}
		//if not a subscription message, its probably a notification
		else{
			var message = req.body['Message'];
			res.redirect('/leaderboard');
		}
	},

	/*
	Uses the MisfitAPI to get basic user data over a given date range.
	Gets points, steps, calories, activity calories, and distance for each
	date in the given range.
	*/
	getsummary: function(req, res){
		if (req.session.authenticated){
			var user = req.session.user;
			var accessToken = req.session.user.accessToken;

			//setup misfitapi
			var misfitApi = new MisfitAPI({
      			clientID: '',
      			clientSecret: ''
			});

			//get username
			var username;
			misfitApi.getProfile({
				token:accessToken
			}, function(err,result){
				if(err || !result){
					console.log("error: " + err);
					return callback(err);
				}
				username = result.name;
			});

			//get summary
			var dates = getMonthRange();
			misfitApi.getSummary({
				token: accessToken,
				start_date: dates['monthAgo'],
				end_date: dates['today'],
				detail: true
			}, function(err,result){
				if(err || !result){
					console.log("error: " + err);
					return callback(err);
				}

				//load test user data
				var genUsers = genTestData(result.summary, 20);
				genUsers[username] = result.summary;
				User.massCreate(genUsers);
				res.json(genUsers);
			});
		}
		else{
			res.redirect('/auth/misfit');
		}

	}
	
};

/*
Returns an object storing two dates represented as strings.
'today' - stores todays date in the form 'yyyy-mm-dd'
'monthAgo' - stores a date roughly one month ago from today's date.
			Because misfitAPI places a max date span of 31 days,
			this is at most 31 days away.
*/
var getMonthRange = function(){
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1;
	var yyyy = today.getFullYear();
	var daysInMonth = [31,30,31,30,31,30,31,31,30,31,30,31];
	var monthAgo = mm - 1;
	var monthAgoDay = dd;
	
	if(monthAgo == 0)
		monthAgo = 12;

	//make sure range is no more than 31 days
	var numDays = dd + (daysInMonth[monthAgo-1] - monthAgoDay + 1);
	console.log("numdays: " + (daysInMonth[monthAgo-1] - monthAgoDay) );
	if(numDays > 31){
		for(var i = 0; i < (numDays-31); i++)
			monthAgoDay++;	
	}
	

	//add leading zero if single digit
	if(monthAgo < 10)
		monthAgo='0'+monthAgo;

	if(monthAgoDay<10)
		monthAgoDay = '0' + monthAgoDay;

	if(dd<10) {
	    dd='0'+dd
	} 

	if(mm<10) {
	    mm='0'+mm
	} 

	today = yyyy + '-' + mm + '-' + dd;
	var monthAgo = yyyy + '-' + monthAgo + '-' + monthAgoDay;
	return {today:today,monthAgo:monthAgo};
}

/*
Generate random data for fake users
@param userData - an array of objects with the current user's data (from the Misfit server)
@param num - an integer representing the number of fake users to generate

@returns a JSON object in the same format as [@param userData] but with the possibility for multiple users
*/
var genTestData = function(userData,num){
	var numDays = userData.length;
	var testUsers = {};

	for(var i = 0; i < num; i++){
		var tUserData = [];
		//for each test user, generate data for the same dates as the current user
		for(var j = 0; j < numDays; j++){
			var dayData = {};
			dayData['date'] = userData[j]['date'];
			dayData['points'] = Math.round(((Math.random() * 500)) * 10) / 10;
			dayData['steps'] = Math.floor((Math.random() * 500));
			dayData['calories'] = Math.round(((Math.random() * 500)) * 10) / 10;
			dayData['activityCalories'] = dayData['calories'];
			dayData['distance'] = Math.round(((Math.random() * 11)) * 1000) / 10000;

			//add day_data to this TEST user's data
			tUserData.push(dayData);
		}
		testUsers["User" + (i + 1)] = tUserData;
	}
	return testUsers;
}

