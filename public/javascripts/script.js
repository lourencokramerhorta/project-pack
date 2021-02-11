document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');

}, false);

window.addEventListener("load", () => {

  let defaultLocation = {lat: 0, lng: 0}

  if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition((position) => {
      defaultLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      console.log(
        `User position: ${defaultLocation.lat}, ${defaultLocation.lng}`
      );
    }, () => {
      console.log('Error in the geolocation service.');
    });
  } else {
    defaultLocation = {
      lat: 38.71667,
      lng: -9.13333,
    };
    console.log(`Default position: ${defaultLocation}`);
  }

  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: defaultLocation,
  });
});

