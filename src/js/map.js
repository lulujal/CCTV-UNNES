/** @format */

function initMap() {
  const unnes = { lat: -7.0505452, lng: 110.3924254 };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 37,
    center: unnes,
  });

  const marker = new google.maps.Marker({
    position: unnes,
    map: map,
  });
}
window.initMap = initMap;
