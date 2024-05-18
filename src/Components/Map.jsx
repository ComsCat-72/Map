
import React, { useState, useEffect } from 'react';
import { GoogleMap , DirectionsRenderer,useJsApiLoader } from '@react-google-maps/api';


const Map = () => {
    
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyDcEMUJb_jK28eKG7xzhm2XSkHshQgCtqk"
      })
      const ContainerStyle = {
        width: "100vw",
        height: "100vh"
      }

        const [directionsResponse, setDirectionsResponse] = useState(null);
        const [currentPosition, setCurrentPosition] = useState({ lat: -1.939826787816454, lng: 30.0445426438232 });

        const [nextStop, setNextStop] = useState(null);
        const [dur, setDur] = useState(null);
        const [dis, setDis] = useState(null);
        const [currentPos,setCurrentPos] = useState(null);
      
        const waypoints = [
          { location: { lat: -1.9355377074007851, lng: 30.060163829002217 } },
          { location: { lat: -1.9358808342336546, lng: 30.08024820994666 } },
          { location: { lat: -1.9489196023037583, lng: 30.092607828989397 } },
          { location: { lat: -1.9592132952818164, lng: 30.106684061788073 } },
          { location: { lat: -1.9487480402200394, lng: 30.126596781356923 } },
        ];
      
        const calculateRoute = () => {
          const directionsService = new google.maps.DirectionsService();

          directionsService.route(
            {
              origin: currentPosition,
              destination: { lat: -1.9365670876910166, lng: 30.13020167024439 },
              waypoints: waypoints,
              travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {

              if (status === google.maps.DirectionsStatus.OK) {

                setDirectionsResponse(result);
                setDis(result.routes[0].legs[0].distance.text);
                setDur(result.routes[0].legs[0].duration.text);
                setNextStop(result.routes[0].legs[0].end_address);
                setCurrentPos(result.routes[0].legs[0].start_address);
                
                
              } else {
                console.error(`Error Occured While Fetching Directions ${result}`);
              }
            }
          );
        };
        let updatePositionParams = {

          enableHighAccuracy: true, 
          timeout: 5000, 
          maximumAge: 0


        }
        let UpdatePositionAsMove = (position) => {
          
          setCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });

          calculateRoute();

        }

        let HandleUpdatePositionError = (error) => {
          console.log(error)
        }

        const LivePos = () => {
           
          setInterval(ProcessCoordnates,5000);

        }

        useEffect(() => {

          if (navigator.geolocation) {
            
            navigator.geolocation.watchPosition(
              UpdatePositionAsMove,
              HandleUpdatePositionError,
              updatePositionParams
            );

            LivePos();

          } else {

            console.log("Location Services Not Supported!");

          }


        }, []);

        const ProcessCoordnates = () => {

          if (navigator.geolocation) {
            
            navigator.geolocation.getCurrentPosition(
              UpdatePositionAsMove,
              HandleUpdatePositionError
            );

          } else {

            console.log("Location Services Not Supported!");

          }


        }
      
      
        
      
        return isLoaded ?(

          <div className="main-map-screen">
          <div className="location-holder">
            <div className="frm-to">
              <h2>Nyabugogo -  Kimironko</h2>
            </div>
            <div className="eta-data">
                  <h3>Current: {currentPos}</h3>
          </div>
          <div className="eta-data">
                  <h3>Next Stop: {nextStop}</h3>
          </div>
          <div className="dur-dis">
            <div className="dis">
              Distance: {dis}
            </div>
            <div className="dur">
              Time: {dur}
            </div>
          </div>

          </div>
          <GoogleMap
              mapContainerStyle={ContainerStyle}
              zoom={10}
              center={currentPosition}
              options={{
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: true,
            }}
            >
              {directionsResponse && (
                <DirectionsRenderer
                  directions={directionsResponse}
                />
              )}
            </GoogleMap>
          </div>
        ): <div className='Waiting'><h1>Loading...</h1></div>

};

export default React.memo(Map);
