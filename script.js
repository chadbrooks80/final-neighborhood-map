var map;
var largeInfoWindow;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 39.6813, lng: -105.0559   },
        zoom: 11
    });

    //create marker and infoWindow objects
    var Marker = google.maps.Marker
    largeInfoWindow = new google.maps.InfoWindow();

    //create new markers and place into observable array
    for(var i=0; i < data.length; i++) {
        
        marker = new Marker({
            map: map,
            location: data[i].location,
            title: data[i].title,
            id: data[i].id
        });
        marker.setPosition(data[i].location);
        vm.markers.push(marker)
        vm.markerData.push(
            {
                title: data[i].title,
                id: data[i].id
            }
        );
        
        marker.addListener('click', function() {
            showInfoWindow(this, largeInfoWindow)
        });
    }

}

vm = {
    self: this,
    markerData: ko.observableArray(),
    markers: [],
    errors: ko.observable(""),
    filter: ko.observable(""),
    displayInfoWindow: function() {
        marker = findMarker(this.id)
        showInfoWindow(marker, largeInfoWindow)
    }
}

vm.checkErrors = ko.computed(function() {
    if (vm.errors() != "") {
        alert(vm.errors())
    }
});

vm.filterResults =  function (data) {
    return ko.computed(function() {        
        id = data.id
        
        title = data.title.toLowerCase()
        filter = vm.filter().toLowerCase()
        marker = findMarker(data.id);
        
        //when the map is still loading it may not find the marker right away
        //this will test that and just set to true until the markers are all loaded
        if (marker==false){
            return true;
        }
        
        if (vm.filter() == "") {
            marker.setMap(map);
            return true;
        }
        if (title.search(filter) != -1) {
            marker.setMap(map)
            return true;
        }
        marker.setMap(null)
        return false;
    }, this);
};

ko.applyBindings(vm);

function showInfoWindow(marker, infoWindow) {
    if (infoWindow.marker != marker) {
        
        infoWindow.marker = marker;
        infoWindow.setContent('<div>' + marker.title + '</div>');
        infoWindow.open(map, marker);
        // Make sure the marker property is cleared if the infoWindow is closed.
        infoWindow.addListener('closeclick',function(){
          infoWindow.setMarker = null;
        });
      }
}

function findMarker(id) {
    
    for(var i=0; i < vm.markers.length; i++) {
        if (vm.markers[i].id == id) {
            return vm.markers[i];
        }
    }
    return false;
}

//Gets 3rd party information from fourSquare
function fourSquareRequest(latLng) {
    //FOURSQUARE DETAILS
    var clientId = 'UVH2XVQVKG32VB0D1SAHCKLIS1VQQBDHUDHCA43WMNJ04VMY';
    var clientSecret = 'F1EIWBO14JZDDY3QSY5MOAE3FJYJ0ID43FSJNAIM1MRDUOH2';    
}