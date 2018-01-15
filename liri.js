var dataKeys = require("./keys.js");

var fs = require("fs");
var twitter = require("twitter");
var spotify = require("node-spotify-api");
var request = require("request");
var inquire = require("inquirer")
var whatToDo = process.argv[2];
var parameter = process.argv[3];


//Getting my tweets//



var getTweets = function() {
	
	var clientTwitter = new twitter(dataKeys.twitterKeys);
	//console.log(client);
	var params = {screen_name: 'BarackObama', count: 20};

	clientTwitter.get('statuses/user_timeline', params, function(error, tweets, response) {
		//console.log(error);

		if (!error) {
			//console.log(tweets);

			//console.log(response);
			var data = [];
			for (var i = 0; i < tweets.length; i++) {
				//data.push({
					
					var tweeteronis = '\n' + '> Tweet #: ' + (i+1) +
										'\n' + '> Created at: ' + tweets[i].created_at +
										'\n' + '> Barack Tweeted: ' + tweets[i].text + '\n';

					console.log(tweeteronis);
					data.push(tweeteronis);	

		
		

			} 
			fs.appendFile('./log.txt', '\n***TWEETS LOGGED' + data + '\n', function() {
			console.log('\nTWEETS HAVE BEEN LOGGED TO log.txt FILE' + '\n');
		})
			//console.log(data);
			} else {
				var errors = "Oops...Something went wrong with Barack's tweets. Try again..";
				console.log(errors);
				data.push(errors);

				fs.appendFile('./log.txt', '\n***TWEET ERROR lOGGED: ' + data + '\n', function() {
			console.log('\nERROR HAS BEEN LOGGED TO log.txt FILE' + '\n');
			//console.log(data);

		})
			}
		
		
	});
}

var spotifyThisSong = function(song) {
	//var song = parameter;
	var clientSpotify = new spotify(dataKeys.spotifyKeys);

	clientSpotify.search({type: 'track', query: song, limit: 1})
	.then(function(data) {
		//var result = JSON.stringify(data, null, 2);
		//console.log(data);
		//console.log(song);
		

		var songInfo = data.tracks.items[0];

		var songResult = "\n" +
							"<--------YOUR SONG SEARCH RESULTS-------->\n" +
						  
						  	"* Song: " + songInfo.name + '\n' +
						  	"* Album: " + songInfo.album.name + '\n' +
						  	"* Artist: " + songInfo.artists[0].name + '\n' +
						  	"* Preview (CMD+DBLCLICK -->): " + songInfo.preview_url + '\n';

		console.log(songResult);
		fs.appendFile('./log.txt', '\n*** SONG INFO LOGGED' + songResult + '\n', function() {
			console.log('\nSONGINFO HAS BEEN LOGGED TO log.txt FILE' + '\n');
		})
	 
		

	})
	.catch(function(err) {
		//console.log(err);

		console.log("\nOops...Something went wrong with your song search...");
fs.appendFile('./log.txt', '\n***SONG SEARCH ERROR LOGGED SONG NOT FOUND' + '\n', function() {
	console.log('\nERROR HAS BEEN LOGGED TO log.txt FILE' + '\n');
})

	})
}

var movieInfo = function(movie) {
var queryUrl = "http://omdbapi.com/?apikey=40e9cece&t=" + movie;

request(queryUrl, function(error,response,body) {
	// console.log(error);
	// console.log(response);


	if (!error && JSON.parse(body).Response !== 'False') {

		var reqData = '\n' + '<---- Here It Goes ----> ' +
						'\n' + '> Title: ' + JSON.parse(body).Title +
						'\n' + '> Year Released: ' + JSON.parse(body).Year +
						'\n' + '> IMDB Rating: ' + JSON.parse(body).Ratings[0].Value +
						'\n' + '> Rotten Tomatoes Rating: ' + JSON.parse(body).Ratings[1].Value +
						'\n' + '> Countries: ' + JSON.parse(body).Country +
						'\n' + '> Available in: ' + JSON.parse(body).Language +
						'\n' + '> Starring: ' + JSON.parse(body).Actors +
						'\n' + '> Here is a gist of it: ' + JSON.parse(body).Plot + '\n';

						console.log(reqData);

						fs.appendFile('./log.txt', '\n***MOVIE INFO LOGGED' + reqData + '\n', function() {
	console.log('\nMOVIE INFO HAS BEEN LOGGED TO log.txt FILE' + '\n');
})

	

} else {
	console.log("\nOops...something went wrong with you movie search. Try again...");
	fs.appendFile('./log.txt', '\n***MOVIE SEARCH ERROR LOGGED ' + JSON.parse(body).Error + '\n', function() {
	console.log('\nMOVIE SEARCH ERROR HAS BEEN LOGGED TO log.txt FILE' + '\n');
})
}
	})
}


var doWhatItSays = function() {
 	fs.readFile("./random.txt", 'utf8', function(error,data) {
 		var pickUpData = data.split(',');
 		var liriCommand = pickUpData[0].trim();
 		var liriParam = pickUpData[1].trim();
 		//console.log(liriParam);
 		//console.log(liriCommand);
 		
 		switch(liriCommand) {
 			case "my-tweets":
 				getTweets();
 				break;

 			case "spotify-this-song":
 				spotifyThisSong(liriParam);
 				break;

 			case "movie-this":
 				movieInfo(liriParam);
 				break;	

 		}
//console.log(data);
 	});
 	//console.log(parameter);
}


if (whatToDo === "my-tweets") {
	getTweets();
} else if (whatToDo === "spotify-this-song") {
	spotifyThisSong(parameter);
} else if (whatToDo === "movie-this") {
	movieInfo(parameter);

} else if (whatToDo === "do-what-it-says") {
	doWhatItSays();
} else {
	//var inquire = require("inquirer")
inquire.prompt([{
		type: "confirm",
		message:'\n' + "Avalable Commands Are: node liri.js + _ _ _ " + '\n' +
				"my-tweets (diplays tweets from the great Barack Obama)" + '\n' +
				"spotify-this-song '<type your song in quotes>'" + '\n' +
				"movie-this '<type your movie in quotes>'" + '\n' +
				"do-what-it-says <will run the command from  random.txt file>" + '\n' +
				"ARE YOU READY TO PLAY AGAIN ???",
		name: "confirm",
		default: true		

	}])
//fs.appendFile('./log.txt', 'INCORRECT COMMAND ENTERED', function() {
			//console.log('ERROR HAS BEEN LOGGED TO log.txt FILE');
		//})
	}
