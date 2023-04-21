var modal = document.getElementById("myModal");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
const iconSelector = document.getElementById('IconSelector');
const valueSelector = document.getElementById('ValueSelector');

var heatmapData = []
var kmlLayers = [];
var overlays = [];
var markers = []
var labels = [];
var polylines = [];
var junctions = [];
var heatmap = null
var isHeatMapToggle = false;
var isMarkersToggle = false;
var isKmlToggle = false;
var isOverlyToggle = false;
var isPolyToggle = false;
var isLabelToggle = false;
var isSewerToggle = false;
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

    BuildLogo();
    BuildWaterdeep15Overlays();
    BuildOverlays();
    BuildPolygon();
    BuildKml();
    BuildLabels();
    BuildSewer();

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

function BuildLabels() {
    labels = [];
    labels.push(new google.maps.Marker({
        position: new google.maps.LatLng(37.877294, -80.654958),
        icon: 'https://www.google.com/support/enterprise/static/geo/cdate/art/dots/red_dot.png',
        label: {
            text: "Dock ward",
            color: "#FFF",
            fontSize: "20px",
            fontWeight: "bold"
        }
    }));
}

function BuildOverlays() {
    overlays.push(new google.maps.GroundOverlay("IMG/Map_of_Waterdeep's_Sewers.jpg", { north: 37.9002825388484, south: 37.86637486801817, east: -80.64036910809656, west: -80.66978062131493}));
    overlays[0].clickable = true;
    overlays[0].setOpacity(1);

    google.maps.event.addListener(overlays[0], 'click', (mapsMouseEvent) => {
        google.maps.event.trigger(map, 'click', mapsMouseEvent);
    });
}

function BuildLogo() {
    const image =
        "https://raw.githubusercontent.com/Dhalizm/Logo/main/logo.jpg";
    const logoMarker = new google.maps.Marker({
        position: { lat: 37.885896, lng: -80.667151 },
        map,
        icon: image,
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
    var polystr = "37.876587,-80.658660 37.878210,-80.658845 37.879321,-80.659125 37.879700,-80.658656 37.879704,-80.657325 37.879753,-80.656869 37.879739,-80.656289 37.879732,-80.655137 37.879673,-80.654996 37.879573,-80.654902 37.879658,-80.654671 37.879249,-80.654659 37.879200,-80.653284 37.879150,-80.653207 37.879010,-80.653188 37.879000,-80.652979 37.879107,-80.652599 37.879070,-80.652536, 37.878828,-80.652460 37.878976,-80.651424 37.879387,-80.651458 37.879416,-80.650811 37.876413,-80.651974 37.875237,-80.651958 37.874731,-80.651686 37.874265,-80.650657 37.874091,-80.649954 37.873113,-80.649734 37.872863,-80.650095 37.872687,-80.650523 37.872850,-80.650901 37.873124,-80.651729 37.873463,-80.652480 37.873704,-80.653035 37.874098,-80.653933 37.874202,-80.654550 37.874782,-80.655643 37.875429,-80.656662 37.875855,-80.657381 37.876221,-80.658249 37.876532,-80.658621 37.876587,-80.658660";
    var coordArray = polystr.split(' ');

    var coordinates = [];
    for (var i = 0; i < coordArray.length; i++) {
        var params = coordArray[i].split(',');
        coordinates.push({ lat: parseFloat(params[0]), lng: parseFloat(params[1],) });
    }
    console.log(coordinates)

    polygon = new google.maps.Polygon({
        paths: coordinates,
        strokeColor: '#ff0000',
        strokeOpacity: 1.0,
        strokeWeight: 1,
        fillColor: '#ff0000',
        fillOpacity: 0.5
    });
}

function BuildSewer() {
    polylines = [];
    junctions = [];

    var pathsStr = [
        "37.885286,-80.652668 37.884389,-80.652663",
        "37.884389,-80.652663 37.883317,-80.654475",
        "37.885433,-80.653442 37.883194,-80.653188",
        "37.884550,-80.654082 37.883735,-80.653834",
        "37.884167,-80.652826 37.883132,-80.652012",
        "37.883418,-80.652263 37.882883,-80.652751",
        "37.883811,-80.652496 37.884149,-80.651191 37.884315,-80.650538",
        "37.884101,-80.651225 37.883924,-80.650830",
        "37.882295,-80.652523 37.883181,-80.650827",
        "37.882824,-80.651562 37.883409,-80.651651",
        "37.882464,-80.652120 37.882006,-80.651245",
    ];

    var junctionstr = [
        "37.88367721248483,-80.65437932647114",
        "37.88524689448721,-80.65276690447769",
        "37.88567248092298,-80.65375021027079",
        "37.88342574334474,-80.65321900816085",
        "37.88213048006437,-80.65230742259526",
    ]

    for (var i = 0; i < pathsStr.length; i++) {
        var coordArray = pathsStr[i].split(' ');
        var coordinates = [];
        for (var j = 0; j < coordArray.length; j++) {
            var params = coordArray[j].split(',');
            coordinates.push({ lat: parseFloat(params[0]), lng: parseFloat(params[1],) });
        }

        polylines.push(new google.maps.Polyline({
            path: coordinates,
            geodesic: true,
            strokeColor: "#00137F",
            strokeOpacity: 0.5,
            strokeWeight: i < 3 ? 8 : 5,
        }));
    }

    for (var j = 0; j < junctionstr.length; j++) {
        var params = junctionstr[j].split(',');
        junctions.push(new google.maps.Circle({
            strokeColor: "#fffff",
            strokeOpacity: 0.5,
            strokeWeight: 2,
            fillColor: "#00137F",
            fillOpacity: 0.5,
            center: { lat: parseFloat(params[0]), lng: parseFloat(params[1],) },
            radius: 15,
        }));
    }
    document.getElementById("SewerCount").innerHTML = "Sewers:" + polylines.length;
}

function TogglePoly() {
    polygon.setMap(!isPolyToggle ? map : null);
    isPolyToggle = !isPolyToggle;
}

function ToggleLabel() {
    for (var i = 0; i < labels.length; i++) {
        labels[i].setMap(isLabelToggle ? null : map);
    }
    isLabelToggle = !isLabelToggle;
}

function ToggleSewer() {
    for (var i = 0; i < polylines.length; i++) {
        polylines[i].setMap(isSewerToggle ? null : map);
    }

    for (var i = 0; i < junctions.length; i++) {
        junctions[i].setMap(isSewerToggle ? null : map);
    }
    isSewerToggle = !isSewerToggle;
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