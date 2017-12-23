let accessToken = ""
const redirectUri = "http://localhost:3000/"
const clientId = "a14d6ba77d924442bd2e40cb8c124f39"



const Spotify = {
  getAccessToken () {
    if (accessToken) {
      return accessToken;
    }
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expire = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expire) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expire[1]);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      let accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = accessUrl;
    }
  },

  search (term) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}` , {
      headers: {Authorization: `Bearer ${accessToken}`}
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if (jsonResponse.tracks) {
        return jsonResponse.tracks.items.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }));
      } else {
        return [];
      }
    })
  },

  savePlaylist (playlistName, trackUris) {
    if (!(playlistName && trackUris)) {
      return;
    }
    const headers = {
      "Authorization:": "Bearer" + accessToken
    };
    let userId;
    fetch("https://api.spotify.com/v1/me", {headers: headers}).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if (!jsonResponse.id) {
        return;
      }

      userId = jsonResponse.id;
      fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({name: playlistName})
      }).then(response => {
        return response.json();
      }).then(jsonResponse => {
        if (!jsonResponse.id) {
          return;
        }

        let playlistId = jsonResponse.id;

        fetch(`https://api.spotify.com/v1/users/{userId}/playlists/{playlistId}/tracks`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({uris: trackUris})
        })
      })
    })
  }
}



export default Spotify;
