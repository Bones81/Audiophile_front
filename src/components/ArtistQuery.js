import axios from 'axios'
import {useState} from 'react'
import CSRFToken from './GetCSRFToken'
//MUI Components
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

const getCookie = (name) => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      let cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          let cookie = cookies[i].toString().replace(/^([\s]*)|([\s]*)$/g, "");
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}

const csrftoken = getCookie('csrftoken')

const ArtistQuery = (props) => {
  const [artist, setArtist] = useState({name: 'Default artist name', year: '', image: "default image path"})
  const [showArtist, setShowArtist] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleGetSpotifyArtistData = (e) => {
    e.preventDefault()
    // https://jasonwatmore.com/post/2020/02/01/react-fetch-http-post-request-examples
    // helped us figure out how to execute this particular post request
    fetch('https://audiophile-back.onrender.com/api/artists/spotify_artist', {
      credentials: 'include',
      method: 'POST',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken
      },
      body: JSON.stringify({
        search_query: searchQuery
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      setArtist(data)
      setShowArtist(true)
    })

    // axios.get('http://localhost:8000/api/artists/spotify_artist')
    //      .then((response) => {
    //        console.log(response.data)
    //        setArtist(response.data)
    //        setShowArtist(true)
    //      })
  }

  const handleCreateArtistFromSpotify = (newArtist) => {
    props.handleCreateArtist(artist)
    setShowArtist(false)
  }

  const handleAddButtonRender = (newArtist) => {
    if (props.artists.every(item => item.name !== newArtist.name)) {
      return (
        <button aria-label="Add to Database"  className="card-add-btn" onClick={() => {handleCreateArtistFromSpotify(artist)}}><AddIcon sx={{color: '#FF0000'}}/> <span className="btn-text">Add to database</span></button>
      )
    } else {
      return (
        <button aria-label="Already in database"  className="card-add-btn-open" ><span className="btn-text">Already in database</span></button>
      )
    }
  }

  return (
    <div>
      <Box className="query-div">
        <Typography variant="h4" component="h4" align= 'center'>Find Artists From Spotify's Extensive Library</Typography>
        <Typography variant='h6' align='center'>Can't find an artist that you think should be in our database? Search the Spotify library and add it to the collection!</Typography>
        { showArtist ?
          <Card className="spotify-card">
            <CardMedia component="img" img className="artist-image" src={artist.image} height="320" width="320" alt={artist.name}/>
            <Typography gutterBottom variant="h5" component="div">{artist.name}</Typography>
            <Typography variant="subtitle">{artist.genre}</Typography>
            {handleAddButtonRender(artist)}
            <button aria-label="Go Back" className="card-back-btn" onClick={() => {setShowArtist(false)}}><ClearIcon sx={{color: '#FF0000'}}/></button>
          </Card>
          :
          <CardActions  sx={{alignItems: 'center', color: "#ADD8E6"}}>

          <form onSubmit={handleGetSpotifyArtistData} className="searchForm">
            <CSRFToken />
            <TextField label="Search Spotify for an Artist" name="searchQuery" type="search" onChange={handleChange} fullWidth focused sx={{my:3, input:{color: 'white'}, alignItems: 'center'}}/>
            <button><input type="submit"  value="" /><SearchIcon sx={{p: 2}}/></button>
          </form>
          </CardActions>
        }
      </Box>
    </div>

  )
}

export default ArtistQuery

// <div className="query-div">
//   <h1>Find musical artists from Spotify's massive library</h1>
//   <h2>Are we missing an awesome musical artist that you think should be in our database??</h2>
//   <h4>Search the Spotify library using our API client, and then add them to our collection!</h4>
//   { showArtist ?
//     <div className="spotify-card">
//       <img className="artist-image" src={artist.image} height="320" width="320"/>
//       <h2>{artist.name}</h2>
//       <h3>{artist.genre}</h3>
//       <button className="card-add-btn" onClick={() => {handleCreateArtistFromSpotify(artist)}}>+  <span className="btn-text">Add to database</span></button>
//       <button className="card-back-btn" onClick={() => {setShowArtist(false)}}>X</button>
//     </div>
//     :
//     <form onSubmit={handleGetSpotifyArtistData}>
//       <CSRFToken />
//       <label htmlFor='searchQuery'>Search Spotify: </label>
//       <input name="searchQuery" type="search" placeholder="Frank Sinatra" onChange={handleChange} />
//       <input type="submit" value="Search Spotify for artist" />
//     </form>
//   }
// </div>
