import React, { Component } from 'react';
import './App.css';
import Spotify from'../../Util/Spotify';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';



class App extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      searchResults:[],
      playlistName : "Playlist",
      playlistTracks : []
    };
    this.addTrack = this.addTrack.bind(this)
    this.removeTrack = this.removeTrack.bind(this)
    this.updatePlaylistName = this.updatePlaylistName.bind(this)
    this.savePlaylist = this.savePlaylist.bind(this)
    this.search = this.search.bind(this)
  }

  addTrack (track) {
    let tracks = this.state.playlistTracks
    if (!this.state.playlistTracks.includes(track)) {
      tracks.push(track);
      this.setState({playlistTracks : tracks});
    }
  }
  removeTrack (track) {
    let tracks = this.state.playListTracks
    if (this.state.playlistTracks.includes(track)) {
      tracks.splice(tracks.indexOf(track), 1);
      this.setState({playlistTracks: tracks});
    }
  }

  updatePlaylistName (name) {
    this.setState({playlistName : name})
  }

  savePlaylist (name) {
    const trackUris = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackUris);
    this.setState({
      playlistName: "New Playlist",
      playListTracks: []
    })
  }

  save (term) {
    console.log(term)
  }

  search(term) {
    Spotify.search(term).then(tracks => {
      this.setState({searchResults: tracks})
    })
  }



//probably going to have to go back over playListTracks and searchResults they seem wrong

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch = {this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults = {this.state.searchResults} onAdd = {this.addTrack}/>
            <Playlist
              playlistName = {this.state.playlistName}
              playlistTracks = {this.state.playlistTracks}
              onRemove = {this.removeTrack}
              onNameChange = {this.updatePlaylistName}
              onSave = {this.savePlaylist} />
          </div>
        </div>
      </div>
    )
  }
}
//above was copy and pasted from codeacedmy


export default App;
