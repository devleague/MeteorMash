#Meteor Mash
####A Meteor + Raspberry Pi maker project
==================================================================================================================================================================================
###Desciption
    TL;DR version: An app to be a DJ at a local party. 
    
    A web app using meteor that allows a party to show a playlist of songs and anyone in the nearby party can queue up and request a song. The app will dynamically add songs into the queue that everyone can see all at once. Also a downvote system that if enough people vote down, the song will dissappear and not play. The app also uses a Raspbery PI to connect to speakers, queue up songs and play them. It will also use spotify/youtube as a backbone to find content and possibly add in ability for local storage and check for music there as well.
    
##Deadlines
    -March 6th for the meteor talk at BoxJellyFish
    -March 16th for the mini maker faire

##MVPs for the deadline
###Meteor Talk
    -Meteor playlist
    -Upvote and downvote of the songs
    -what song is now playing
    -Geolocation
    -Georestriction
    -possibly with twitter intergration

###Mini - Maker Faire
    -all of the above plus
    -admin "party account"
    -party geoers will sign in to customize vote (maybe voting every half an hour if not logged in)
    -Intergration with Raspberry PI to play songs to the speaker
    
##MeteorMash Programming half

###Classes
    checkLocations
    playMusic
    SendCommandsTo
    checkVotse

##Stretch Goals
    add voting restrictions
    Send to twitter as part of Twitter API
    make an actual app on mobile
##MeteorMash Raspberry PI half
##What is required 

##Current Groups
    Derek/Jason working on intergrating the Raspberry PI to play the music
    Tyler working on the upvoting system
    Kingtak working on geolocation
    Ray freelancing

##Dependenciesk
    Meteor, Modinizr, Compass/Sass, Bootstrap, Handlebars

##Equipment
    -Speakers
    -Raspbery PI
    -Bluetooth (?)
    -Wifi Hub (?)
    
##Extra Requirements
    keep meteor notes for talk on the 6th
    clean git workflow (push to development branch)
    clean code
    keep the design document up to date.
