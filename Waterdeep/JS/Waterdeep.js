﻿var modal = document.getElementById("myModal");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
const iconSelector = document.getElementById('IconSelector');
const valueSelector = document.getElementById('ValueSelector');

var heatmapData = []
var kmlLayers = [];
var overlays = [];
var markers = []
var heatmap = null
var isHeatMapToggle = false;
var isMarkersToggle = false;
var isKmlToggle = false;
var isOverlyToggle = false;
var isPolyToggle = false;
var currentValue = "";
var selectedIcon = "";
var selectedIconName = "";
var selectedValue = "";
var infoWindow = null;
var polygon = null;

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

    BuildWaterdeep15Overlays();
    BuildOverlays();
    BuildPolygon();
    BuildKml();


    map.addListener("click", (mapsMouseEvent) => {
        //console.log(mapsMouseEvent.latLng)
        var w = Number(document.getElementById("NumberSelector").value);
        if (selectedIcon == "") {
            addHeatmapRecord(mapsMouseEvent.latLng, w, "")
        }
        else if (currentValue == "Value") {
            addHeatmapRecord(mapsMouseEvent.latLng, selectedValue, "")
        }
        else {
            if (selectedIcon.indexOf("Mail Box") > 0)
                addFeatureRecord(mapsMouseEvent.latLng, selectedIcon, "Number:" + w);
            else

                addFeatureRecord(mapsMouseEvent.latLng, selectedIcon, selectedIconName);
        }
    });
}

function BuildWaterdeep15Overlays() {
    overlay = new google.maps.GroundOverlay("IMG/Waterdeep 15,000 px (Grid).jpg", { north: 37.90077202867024, south: 37.86657434334332, east: -80.6393290615508, west: -80.67183799999999 });
    overlay.clickable = true;
    overlay.setOpacity(1);
    overlay.setMap(map);
    google.maps.event.addListener(overlays, 'click', (mapsMouseEvent) => {
        google.maps.event.trigger(map, 'click', mapsMouseEvent);
    });
}


function BuildOverlays() {
    overlays.push(new google.maps.GroundOverlay("IMG/Map_of_Waterdeep's_Sewers.jpg", { north: 37.9002825388484, south: 37.86637486801817, east: -80.64036910809656, west: -80.66978062131493}));
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
                document.getElementById("HeatCount").innerHTML  = "Elements:" + heatmapData.length;
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
                document.getElementById("IconCount").innerHTML  = "Icon:" + markers.length;
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
            document.getElementById("HeatCount").innerHTML  = "Elements:" + heatmapData.length;
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
            document.getElementById("IconCount").innerHTML = "Icon:" + markers.length;
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
    kmlLayers.push(new google.maps.KmlLayer('https://raw.githubusercontent.com/Dhalizm/METH6005Exam/main/OKAFOR.kml', {
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

function ToggleGradient() {
    var gradient = [
        'rgba(0, 255, 255, 0)',
        'rgba(0, 255, 255, 1)',
        'rgba(0, 191, 255, 1)',
        'rgba(0, 127, 255, 1)',
        'rgba(0, 63, 255, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(0, 0, 223, 1)',
        'rgba(0, 0, 191, 1)',
        'rgba(0, 0, 159, 1)',
        'rgba(0, 0, 127, 1)',
        'rgba(63, 0, 91, 1)',
        'rgba(127, 0, 63, 1)',
        'rgba(191, 0, 31, 1)',
        'rgba(255, 0, 0, 1)'
    ]
    heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
}

function BuildPolygon() {
    var polystr = "-80.65007054614142,37.87360500238003,16 -80.64999943924461,37.8736617955915,16 -80.65003349921307,37.87369224773454,16 -80.65009673342941,37.87363808916336,16 -80.65007054614142,37.87360500238003,16";
    var coordArray = polystr.split(' ');

    var coordinates = [];
    for (var i = 0; i < coordArray.length; i++) {
        var params = coordArray[i].split(',');
        coordinates.push({ lat: parseFloat(params[1]), lng: parseFloat(params[0],) });
    }
    console.log(coordinates)

    polygon = new google.maps.Polygon({
        paths: coordinates,
        strokeColor: '#ffaa00',
        strokeOpacity: 1.0,
        strokeWeight: 1,
        fillColor: '#aaaa00',
        fillOpacity: 0.5
    });

}

function TogglePoly() {
    polygon.setMap(!isPolyToggle ? map : null);
    isPolyToggle = !isPolyToggle;
}

function SetValue(value) {
    currentValue = value;
}

iconSelector.addEventListener('change', function handleChange(event) {
    selectedIconName = iconSelector.options[iconSelector.selectedIndex].text;
    selectedIcon = event.target.value
    console.log(selectedIcon)
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

