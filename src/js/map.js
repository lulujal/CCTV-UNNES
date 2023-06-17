function initMap() {
    const unnes = {lat: -7.0697, lng: 110.8608};
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 16,
        center: unnes
    });
}
    const marker = new google.maps.Marker({
        position: unnes,
        map: map,
    });

window.initMap = initMap;