/** @format */

//marker dan map inisialisasi
function initMap() {
  const unnes = { lat: -7.0505452, lng: 110.3924254 };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 16,
    center: unnes,
  });

  const getData = () => {
    fetch("/src/json/Data.json")
    .then (CCTV => {
      return CCTV.json();
    }).then (CCTV => {
      const cctv = CCTV.CCTV;
      console.log(cctv);
      // fill the features array
      var features = [ ];
      
      for(let i=0; i<cctv.length; i++){
        var lat = parseFloat(cctv[i].pos.lat);
        var lng = parseFloat(cctv[i].pos.lng);
         features.push({
            position: {lat: lat,lng: lng},
            type: cctv[i].type,
            url: cctv[i].url,
          });
        
      }

    // Create markers.
    let currentInfoWindow = null;
      for (let i = 0; i < features.length; i++) {
        
        //menentukan marker jalan atau gedung
        let iconbase;
        if (cctv[i].type === "street") {
          iconbase = "./src/img/street_icon_marker_cctv.png";
        }
        else if (cctv[i].type === "building") {
          iconbase = "./src/img/building_icon_marker_cctv.png";
        }
        
        //membuat marker
        const marker = new google.maps.Marker({
            position: features[i].position,
            icon: iconbase,
            map: map,
          });

        //membuat infowindow        
        function createCustomInfoWindow(content) {
          return new google.maps.InfoWindow({
            content: content,
            maxwidth: 100,
          });
        }

        //tab baru untuk menampilkan video stream cctv
        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>${cctv[i].nama} CCTV</title>
            <link
              href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
              rel="stylesheet"
              integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM"
              crossorigin="anonymous" />
            <link rel="stylesheet" href="/src/css/map.css" />
            </head>
          <body>
              <nav class="navbar fixed-top bg-body-tertiary" data-bs-theme="dark">
              <div class="container-fluid">
                <a class="navbar-brand" href="#">
                  <img
                    src="https://unnes.ac.id/lppm/wp-content/uploads/sites/16/2015/08/Logo-Transparan-Warna-1.png"
                    alt="Logo"
                    width="24"
                    height="30"
                    class="d-inline-block align-text-top" />
                  UNNES CCTV
                </a>
              </div>
            </nav>
            <div style="text-align: center;">
              <iframe src="${cctv[i].url}" width="1080" height="720" allowfullscreen autoplay></iframe>
            </div>
          </body>
          </html>
          `;

        function handleButtonClick() {
          const newWindow = window.open();
          newWindow.document.write(htmlContent);
          newWindow.document.close();
        }
         
        //make a function that will create a button
        function createButton(buttonText, buttonId, buttonClass) {
          const button = document.createElement("button");
          button.setAttribute("type", "button");
          button.setAttribute("class", buttonClass);
          button.setAttribute("id", buttonId);
          button.innerHTML = buttonText;
          return button.outerHTML;

        }

        let content = `
        <div id="content">
        <div id="siteNotice">
        </div>
        <h1 id="firstHeading" class="firstHeading">${cctv[i].nama}</h1>
        <div id="bodyContent">
        <p>${cctv[i].content}</p>
        <p>pilih cctv untuk memantau</p>
        ${createButton("CCTV NORMAL", "cctvnormal", "btn btn-primary")}
        <a href= "./src/dist/cctv-thermal.html" class="btn btn-primary">CCTV THERMAL</a>
        <a href= "./src/dist/cctv-helm.html" class="btn btn-primary">CCTV HELM Recognition</a>
        </div>
        </div>
        `;


        const tempElement = document.createElement("div");
        tempElement.innerHTML = content;
        const myInfoWindow = createCustomInfoWindow(tempElement);

        //membuat event listener untuk menampilkan infowindow
        marker.addListener("click", () => {
          if (currentInfoWindow) {
            currentInfoWindow.close();
          }
          myInfoWindow.open(map, marker);
          currentInfoWindow = myInfoWindow;
          
          // Add event listener to the "CCTV NORMAL" button
          const cctvNormalButton = tempElement.querySelector("#cctvnormal");
          cctvNormalButton.addEventListener("click", handleButtonClick);
        });

        // membuat event listener untuk menutup infowindow
        google.maps.event.addListener(map, "click", function () {
          myInfoWindow.close();
        }); 
      }
        console.log(features);
    }).catch (error => {
      console.log(error);
    })
  }
  document.addEventListener("DOMContentLoaded", getData);
  
}

window.initMap = initMap;

