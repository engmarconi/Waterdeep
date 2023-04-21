var modal = document.getElementById("myModal");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
const iconSelector = document.getElementById('IconSelector');
const valueSelector = document.getElementById('ValueSelector');

var heatmapData = []
var kmlLayers = [];
var markers = []
var heatmap = null
var isHeatMapToggle = false;
var isMarkersToggle = false;
var isKmlToggle = false;
var isOverlyToggle = false;
var currentValue = "";
var selectedIcon = "";
var selectedValue = "";
var infoWindow = null;
function initMap() {
    map = new google.maps.Map(document.getElementById("BaseMap"), {
        center: { lat: 37.880042, lng: -80.654766 },
        zoom: 15,
        //mapTypeId: google.maps.MapTypeId.SATELLITE

    });
    infoWindow = new google.maps.InfoWindow();

    heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmapData
    });
    heatmap.setMap(map);
    getData("Value")
    getData("Icon")

    buildOverlays();
    BuildKml();


    map.addListener("click", (mapsMouseEvent) => {
        //console.log(mapsMouseEvent.latLng)
        var w = Number(document.getElementById("NumberSelector").value);
        if (currentValue == "") {
            addHeatmapRecord(mapsMouseEvent.latLng, w, "")
        }
        else if (currentValue == "Value") {
            addHeatmapRecord(mapsMouseEvent.latLng, selectedValue, "")
        }
        else {
            addFeatureRecord(mapsMouseEvent.latLng, selectedIcon, "Number:" + w);
        }
    });
}

function buildOverlays() {
    overlays = [];
    overlays.push(new google.maps.GroundOverlay("IMG/Waterdeep15,000px(Grid).jpg", { north: 37.90077202867024, south: 37.86657434334332, east: -80.6393290615508, west: -80.67183799999999 }));
    overlays[0].clickable = true;
    overlays[0].setOpacity(1);

    google.maps.event.addListener(overlays[0], 'click', (mapsMouseEvent) => {
        google.maps.event.trigger(map, 'click', mapsMouseEvent);
    });

}

function getData(message) {
    PageMethods.GetData(message, onSuccess, onError);

    function onSuccess(result) {
        if (result) {
            if (message == "Value") {
                heatmapData = []
                for (var i = 0; i < result.length; i++) {
                    let obj = result[i];
                    let latLng = new google.maps.LatLng(obj.lat, obj.lng);
                    heatmapData.push({ location: latLng, weight: obj.weight },);
                }
            }
            else if (message == "Icon") {
                markers = [];
                for (var i = 0; i < result.length; i++) {
                    let obj = result[i];
                    let marker = new google.maps.Marker({ position: { lat: obj.lat, lng: obj.lng }, draggable: false, icon: obj.icon, title: obj.name });
                    markers.push(marker);
                    marker.addListener("click", () => {
                        infoWindow.setContent(`<div style = 'width:200px;min-height:40px'> ${obj.name}</div>`);
                        infoWindow.open(map, marker);
                    });
                }
            }
        }
        else {
            console.log("False response");
        }
    }

    function onError(result) {
        console.log("Error");
        console.log(result);
    }
}


function addHeatmapRecord(latlng, w, n) {
    var Coordinate = {
        lat: latlng.lat(),
        lng: latlng.lng(),
        weight: w
    };
    PageMethods.AddHeatmapRecord(Coordinate, onSuccess, onError);

    function onSuccess(result) {
        if (result == true) {
            heatmap.setMap(null);
            heatmapData.push({ location: new google.maps.LatLng(latlng.lat(), latlng.lng()) , weight: w },);
            heatmap.setData(heatmapData);
            heatmap.setMap(map);
        }
        else {
            console.log("False response");
        }
    }

    function onError(result) {
        console.log("Error");
        console.log(result);
    }
}

function addFeatureRecord(latlng, icon, name) {
    var obj = {
        lat: latlng.lat(),
        lng: latlng.lng(),
        name: name,
        icon: icon
    };
    PageMethods.AddFeatureRecord(obj, onSuccess, onError);

    function onSuccess(result) {
        if (result == true) {
            let marker = new google.maps.Marker({ position: { lat: obj.lat, lng: obj.lng }, draggable: false, icon: obj.icon, title: obj.name });
            markers.push(marker);
            marker.setMap(map);
            marker.addListener("click", () => {
                infoWindow.setContent(`<div style = 'width:200px;min-height:40px'> ${obj.name}</div>`);
                infoWindow.open(map, marker);
            });
            document.getElementById("NumberSelector").value = Number(document.getElementById("NumberSelector").value) + 1;
        }
        else {
            console.log("False response");
        }
    }

    function onError(result) {
        console.log("Error");
        console.log(result);
    }
}

function BuildKml() {
    kmlLayers.push(new google.maps.KmlLayer('https://raw.githubusercontent.com/ClaytonGreene/codespaces-blank/main/Waterdeep%20Base/Buildings.kml', {
        suppressInfoWindows: true,
        preserveViewport: false,
    }));
    kmlLayers.push(new google.maps.KmlLayer('https://raw.githubusercontent.com/ClaytonGreene/codespaces-blank/main/Waterdeep%20Base/_City%20Of%20The%20Dead.kml', {
        suppressInfoWindows: true,
        preserveViewport: false,
    }));
    kmlLayers.push(new google.maps.KmlLayer('https://raw.githubusercontent.com/ClaytonGreene/codespaces-blank/main/Waterdeep%20Base/Contour.kml', {
        suppressInfoWindows: true,
        preserveViewport: false,
    }));
}

function ToggleHeatMap() {
    if (isHeatMapToggle == false) {
        heatmap.setMap(map);
    }
    else {
        heatmap.setMap(null);
    }
    isHeatMapToggle = !isHeatMapToggle;
}


function ToggleOverlay() {
    for (var i = 0; i < overlays.length; i++) {
        overlays[i].setMap(isOverlyToggle ? null : map);
    }
    isOverlyToggle = !isOverlyToggle;
}

function ToggleMarker() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(isMarkersToggle ? null : map);
    }
    isMarkersToggle = !isMarkersToggle;
}

function ToggleKML() {
    for (var i = 0; i < kmlLayers.length; i++) {
        kmlLayers[i].setMap(isKmlToggle ? null : map);
    }
    isKmlToggle = !isKmlToggle;
}

function SetValue(value) {
    currentValue = value;
}

iconSelector.addEventListener('change', function handleChange(event) {
    selectedIcon = event.target.value
});

valueSelector.addEventListener('change', function handleChange(event) {
    selectedValue = Number(event.target.value)
    console.log(selectedValue)
})

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

window.onload = function () {
    window.initMap = initMap();
    modal.style.display = "block";
}