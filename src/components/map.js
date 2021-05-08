import GoogleMapReact from 'google-map-react'
import iss from './images/ISS_spacecraft_model_1.png'

function Map( {center, zoom}) {
  return (
    <div className="map-container">
     <GoogleMapReact
        bootstrapURLKeys={{ key:  process.env.GOOGLE_MAP_API_KEY}}
        defaultCenter={center}
        defaultZoom={zoom}
     >
         <img src={iss} alt="ISS Icon" className='iss-icon'/>
     </GoogleMapReact>
    </div>
  );
}

Map.defaultProps = {
    center: {
        lat: 51.5074,
        lng: 0.1278
    },
    zoom: 4,
}

export default Map;
