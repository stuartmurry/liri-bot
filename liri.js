// Justin and I worked on this together.

// looks for keys file and makes connection
require('dotenv').config();
var keys = require('./keys.js');
var request = require('request');
var fs = require('fs');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
// Takes in all of the command line arguments
var inputString = process.argv;
// Parses the command line argument to capture the data
var selection = inputString[2];
var argumentOne = process.argv[3];
// Based on the selections we run the appropriate if statement
if (selection === "my-tweets") {
    myTweets();
    console.log('myTweets')
} else if (selection == "spotify-this-song") {
    mySpotify(argumentOne);
} else if (selection == "movie-this") {
    omdbData(argumentOne);
} else if (selection == "do-what-it-says") {
    doWhatItSays();
}
//myTweets
function myTweets() {

    var client = new Twitter(keys.twitter);

    var params = { screen_name: 'SteveIr59593907' };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            console.log(tweets);
            for (var i = 0; i < tweets.length; i++) {
                console.log(tweets[i].created_at);
                console.log('');
                console.log(tweets[i].text);
            }
        }
    });
}

function omdbData(movie) {
    var omdbURL = 'http://www.omdbapi.com/?t=' + movie + '&plot=short&tomatoes=true&apikey=trilogy';

    request(omdbURL, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var body = JSON.parse(body);

            console.log("Title: " + body.Title);
            console.log("Release Year: " + body.Year);
            console.log("IMdB Rating: " + body.imdbRating);
            console.log("Country: " + body.Country);
            console.log("Language: " + body.Language);
            console.log("Plot: " + body.Plot);
            console.log("Actors: " + body.Actors);
            // console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
            // console.log("Rotten Tomatoes URL: " + body.tomatoURL);

            //adds text to log.txt

            console.log('Starting title')
            fs.appendFileSync('log.txt', "Title: " + body.Title + '\n');
            fs.appendFileSync('log.txt', "Release Year: " + body.Year + '\n');
            fs.appendFileSync('log.txt', "IMdB Rating: " + body.imdbRating + '\n');
            fs.appendFileSync('log.txt', "Country: " + body.Country + '\n');
            fs.appendFileSync('log.txt', "Language: " + body.Language + '\n');
            fs.appendFileSync('log.txt', "Plot: " + body.Plot + '\n');
            fs.appendFileSync('log.txt', "Actors: " + body.Actors + '\n');

            fs.appendFileSync('log.txt', "-----------------------------" + '\n\n');
            // fs.appendFile('log.txt', "Rotten Tomatoes Rating: " + body.tomatoRating);
            // fs.appendFile('log.txt', "Rotten Tomatoes URL: " + body.tomatoURL);

        } else {
            console.log('Error occurred.')
        }
        if (movie === "Mr. Nobody") {
            console.log("-----------------------");
            console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
            console.log("It's on Netflix!");

            //adds text to log.txt
            fs.appendFile('log.txt', "-----------------------");
            fs.appendFile('log.txt', "If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
            fs.appendFile('log.txt', "It's on Netflix!");
        }
    });

}
var getArtistNames = function (artist) {
    return artist.name;
}
function mySpotify (songName) {
    console.log("myspotify")
    if (songName === undefined) {
        songName = 'The Sign';
    }

    var spotify = new Spotify(keys.spotify);

    spotify.search({ type: 'track', query: songName }, function (err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }
        var songs = data.tracks.items;
        for (var i = 0; i < songs.length; i++) {
            console.log(i);
            console.log('artist(s): ' + songs[i].artists.map(getArtistNames));
            console.log('song name: ' + songs[i].name);
            console.log('preview song: ' + songs[i].preview_url);
            console.log('album: ' + songs[i].album.name);
            console.log('-----------------------------------');
        }
    });
}
function doWhatItSays() {
    fs.readFile('random.txt', "utf8", function (error, data) {
        var txt = data.split(',');

        spotify(txt[1]);
    });
}