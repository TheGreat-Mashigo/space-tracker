import './App.css';
import Map from './components/map';
import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [loading, setLoading] = useState(false)
  const [longitude, setLongitude] = useState(-12.0691)
  const [latitude, setLatitude] = useState(-47.2433)

  useEffect(() => {
    getLocation()
  }, [])


  const getLocation = async () => {
    setLoading(true)
    const res = await axios.get('http://api.open-notify.org/iss-now.json')
    const { longitude, latitude } = await res.data.iss_position

    setLatitude(parseFloat(latitude))
    setLongitude(parseFloat(longitude))
    setLoading(false)
  }
  return (
    <div className="App">
      <h3>ISS Tracker</h3>
      {!loading ? (

        <Map center={{lat: latitude, lng: longitude}} />
      ) : (
        <h1>loading</h1>
      )

      }
    </div>
  );
}

export default App;
