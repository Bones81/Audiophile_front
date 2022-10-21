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
import { autocompleteClasses } from '@mui/material';

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

const AlbumQuery = (props) => {
  const [album, setAlbum] = useState({name: 'Default album name', year: 2022, image: "default image path"})
  const [showAlbum, setShowAlbum] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleGetSpotifyAlbumData = (e) => {
    e.preventDefault()
    // https://jasonwatmore.com/post/2020/02/01/react-fetch-http-post-request-examples
    // helped us figure out how to execute this particular post request
    fetch('https://audiophile-back.onrender.com/api/albums/spotify_album', {
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
      setAlbum(data)
      setShowAlbum(true)
    })

    // axios.get('http://localhost:8000/api/albums/spotify_album')
    //      .then((response) => {
    //        console.log(response.data)
    //        setAlbum(response.data)
    //        setShowAlbum(true)
    //      })
  }

  const handleCreateAlbumFromSpotify = (newAlbum) => {
    props.handleCreate(album)
    setShowAlbum(false)
  }

  const handleAddButtonRender = (newAlbum) => {
    if (props.albums.every(item => item.name !== newAlbum.name)) {
      return (
        <button aria-label="Add to Database"  className="card-add-btn" onClick={() => {handleCreateAlbumFromSpotify(album)}}><AddIcon sx={{color: '#FF0000'}}/> <span className="btn-text">Add to database</span></button>
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
        <Typography variant="h4" component="h4" align= 'center'>Find Albums From Spotify's Extensive Library</Typography>
        <Typography variant='h6' align='center' >Can't find an album that you think should be in our database? Search the Spotify library and add it to the collection!</Typography>
        { showAlbum ?
          <Card className="spotify-card">
            <CardMedia component="img" img className="album-image" src={album.image} height="320" width="320" alt={album.name}/>
            <Typography gutterBottom variant="h5" component="div">{album.name} ({album.year})</Typography>
            {handleAddButtonRender(album)}
            <button aria-label="Go Back" className="card-back-btn" onClick={() => {setShowAlbum(false)}}><ClearIcon sx={{color: '#FF0000'}}/></button>
          </Card>
          :
          <CardActions  sx={{alignItems: 'center', color: "#ADD8E6"}}>

          <form onSubmit={handleGetSpotifyAlbumData} className="searchForm">
            <CSRFToken />
            <TextField label="Search Spotify for an Album" name="searchQuery" type="search" onChange={handleChange} fullWidth focused sx={{my:3, input:{color: 'white'}}}/>
            <button><input type="submit"  value="" /><SearchIcon sx={{p: 2}}/></button>
          </form>
          </CardActions>
        }
      </Box>
    </div>

  )
}

export default AlbumQuery
