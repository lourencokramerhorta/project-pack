//Get default location
let defaultLocation = { lat: 38.71667, lng: -9.13333 };
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      defaultLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    },
    () => {
      console.log("Error in the geolocation service.");
    }
  );
}

//LOAD WINDOW
window.addEventListener("load", () => {
  const mapElement = document.getElementById("map");
  const createParkHome = document.getElementById("create-park-home");

  function redirectToParkWCoord(lat, lng, address) {
  createParkHome.href = `/parks/create-park?lat=${lat}&lng=${lng}&address=${address}`;
}

  //Function geocodeAddress
  function geocodeAddress(geocoder, resultsMap, dataFunction) {
    const address = document.getElementById("address").value;
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === "OK") {
        resultsMap.setCenter(results[0].geometry.location);
        let marker = new google.maps.Marker({
          map: resultsMap,
          position: results[0].geometry.location,
        });
        dataFunction(
          results[0].geometry.location.lat(),
          results[0].geometry.location.lng(),
          address
        );
       
      } else {
        console.log(
          `Geocode was not successful for the following reason: ${status}`
        );
      }
    });
  }

  //Function placeParks
  function placeParks(parks, map) {
    for (let park of parks) {
      const center = {
        lat: park.location.coordinates[1],
        lng: park.location.coordinates[0],
      };
      const pin = new google.maps.Marker({
        position: center,
        map: map,
        title: park.name,
      });
    }
  }

  //Function getParks
  function getParks(map) {
    axios
      .get("/home/api")
      .then((response) => {
        console.log(response);
        placeParks(response.data.parks, map);
      })
      .catch((err) => console.log(err));
  }

  if (mapElement) {
    //Initialize map
    const map = new google.maps.Map(mapElement, {
      zoom: 13,
      center: defaultLocation,
    });

    //Get parks in map
    getParks(map);

    //Initialize geocoder
    const geocoder = new google.maps.Geocoder();

    //Get geolocation from address
    document.getElementById("submit").addEventListener("click", () => {
      geocodeAddress(geocoder, map, redirectToParkWCoord);
    });
  }
});
