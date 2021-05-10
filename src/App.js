import "./App.css";
import Map from "./components/map";
import { useState, useEffect } from "react";
import axios from "axios";
import Amplify from 'aws-amplify'
import { API } from 'aws-amplify'
import awsconfig from './aws-exports'
Amplify.configure(awsconfig)

// const CACHE = {};

const notifyURL = "http://api.open-notify.org/iss-now.json";

function App() {
  const [loading, setLoading] = useState(false);
  const [longitude, setLongitude] = useState(-12.0691);
  const [latitude, setLatitude] = useState(-47.2433);

  useEffect(() => {
    const getLocation = async () => {

      setLoading(true);
      const res = await axios.get(notifyURL);
      console.log("res ********", res);
      if (res) {
        const { longitude, latitude } = await res.data.iss_position;
        console.log(" show res.data ::::::",res.data)
        addLocations (res.data);
        setLatitude(parseFloat(latitude));
        setLongitude(parseFloat(longitude));
        setLoading(false);
      }
    };
    getLocation();
  }, []);

  async function addLocations (response) {
    let apiName = 'locationapi'
    let path = '/location';
    const data = {
      body : {
        iss_position: {
          longitude:response.iss_position.longitude,
          latitude: response.iss_position.latitude
        },
        timestamp: response.timestamp,
        message: response.message
      }
    }
    API.post(apiName, path, data)
    // const apiData = await API.post(apiName, path, data)
    .then(result => {
      this.location = JSON.parse(result.body);
    }).catch(err => {
      console.log(err);
      console.log(err.response);
    });
    // console.log(apiData)
  }

  return (
    <div className="App">
      <div className="iss-header">
        <h3>ISS Tracker</h3>
      </div>
      {!loading ? (
        <Map center={{ lat: latitude, lng: longitude }} />
      ) : (
        <div className="iss-header">
          <h1>loading...</h1>
        </div>
      )}
    </div>
  );
}

export default App;
