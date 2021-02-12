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

document.addEventListener('DOMContentLoaded', () => {
  console.log('IronGenerator JS imported successfully!');
}, false);

window.addEventListener("load", () => {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: defaultLocation,
  });

  //Get parks
  function getParks() {
    axios
      .get("home/api")
      .then((response) => {
        console.log(response);
        placeParks(response.data.parks);
      })
      .catch((err) => console.log(err));
  }

  //Create parks markers

  function placeParks(parks) {
    let markers = [];
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
      markers.push(pin);
    }
  }

  getParks();
});

