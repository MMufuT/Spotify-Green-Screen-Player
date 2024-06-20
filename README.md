# Spotfy Green Screen Player

**The purpose of this tool is to serve as a green screen player for your current playing spotify tracks.**
![](https://github.com/MMufuT/Spotify-Green-Screen-Player/blob/main/web_app_demo.gif)

In most editing softwares, the green screen can be keyed out and components can be resized to fit your style/preferences
![](https://github.com/MMufuT/Spotify-Green-Screen-Player/blob/main/editing_demo.gif)

## Setting up Codebase
- Clone this repository
- run `npm i` in the client and server folders
- Create a Spotify for Developers account. Create a new web app project and retrieve its Client ID and Client Secret
- Rename the `exampleDotEnv` file to `.env` and replace the Client ID and Client Secret with your own. This needs to be done in the client and server folders
- Make sure your redirect URI in your spotify project matches the redirect URI in `server/.env`

## Setting up Audio
Sound Waves are an important part of this player's aesthetic, but it's a bit tricky to setup. This app uses the devices microphone to listen for an input
and displays that in real time on the sound wave visualiser. The issue is that we want the current spotify song to be playing on the visualizer, not our microphone.

To fix this, you need to reroute your devices output to the devices input. This can be done on MAC with the combination of two tools [Black Hole 2ch](https://existential.audio/blackhole/)
and the "Audio MIDI Setup" app on Mac.
- Install "Black Hole 2ch" on your device (It's Free!)
- Open "Audio MIDI Setup" on your device
- Create a "Multi Output Device"
- In the Multi Output Device dashboard, check the box on the left of "BlackHole 2ch" (required), and whichever device you would like to hear your audio playback through (Not required, but helpful for testing)
- Go to sound settings on your device. Set the input to "BlackHole 2ch" and the output to "Multi-Output Device".
- Your device's audio output should now be rerouted to its input!

## Launching application
- Navigate to the `/client` folder via the terminal
- Run `npm start` and the app should launch in your browser
- After giving the app microphone permission and logging into your spotify, the current song playing on your spotify account should be playing with audio waves and song progress bar

## Application Caveats
### Audio Waves
- The audio waves are a local feature, your device needs to "hear" the song in order to display the audio visualization. Spotify API does not provide any audio data to display so this needs to be done locally
### Song Progress Bar
- The web app player progress bar does not update in real time when you drag the progress bar slider on spotify.
- The Spotify API retrieves the current position and max duration of the currently playing song, and a local web app timer increments as the song progresses.
- When the timer reaches the songs max duration, the page seemlessly refreshes, retrieving the next playing song.

## Troubleshooting
If the player on the webapp is not loading, try the following:
- Make sure your redirect uri in your `/server/.env` file matches your redirect uri in your spotify project dashboard
- Try going to the local browser storage of the web app's tab, delete the access and refresh tokens, then refresh the page
- The application only works for music. It will not display audio books, podcast episodes, or anything that isn't a song.
