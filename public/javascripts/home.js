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
  const createParkSubmit = document.getElementById("create-park-submit");
  const latElement = document.getElementById("latitude");
  const lngElement = document.getElementById("longitude");

  function redirectToParkWCoord(lat, lng, address) {
    createParkHome.href = `/parks/create-park?lat=${lat}&lng=${lng}&address=${address}`;
  }

  function changeCoordInputs(lat, lng) {
    latElement.value = lat;
    lngElement.value = lng;
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
      const contentString = `<div>
      <h4>${park.name}</h4>
      <img src="${park.photo}" alt="park">
      <a href="/parks/park/${park._id}">View</a>
      </div>`;
      console.log(contentString);
      const infoWindow = new google.maps.InfoWindow({ content: contentString });
      pin.addListener('click', () => { infoWindow.open(map, pin) });
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

  //Function getParkFromHome
  function getParkFromHome(lat, lng, map) {
    const pin = new google.maps.Marker({
      position: { lat: lat, lng: lng },
      map: map,
    });
    console.log(pin);
    map.setCenter(pin.position);
  }

  if (mapElement) {
    //Initialize map
    const map = new google.maps.Map(mapElement, {
      zoom: 13,
      center: defaultLocation,
    });

    //Get parks in map
    getParks(map);

    //Get park from Home
    if (createParkSubmit) {
      getParkFromHome(Number(latElement.value), Number(lngElement.value), map);
    }

    //Initialize geocoder
    const geocoder = new google.maps.Geocoder();

    //Get geolocation from address
    document.getElementById("submit").addEventListener("click", () => {
      if (createParkHome) {
        geocodeAddress(geocoder, map, redirectToParkWCoord);
      }
      if (createParkSubmit) {
        geocodeAddress(geocoder, map, changeCoordInputs);
      }
    });
  }
});