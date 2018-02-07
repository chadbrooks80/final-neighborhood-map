var x;
var map;
var Marker;
markers = ko.observableArray();
var InfoWinow;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 39.6813, lng: -105.0559   },
        zoom: 11
    });

    //create marker and infoWindow objects
    Marker = google.maps.Marker
    Infowindow = google.maps.InfoWindow

    //create new markers and place into observable array
    for(var i=0; i < data.length; i++) {
        marker = new Marker({
            map: map,
            location: data[i].location,
            title: data[i].name,
            id: i
        });
        marker.setPosition(data[i].location);
        markers.push(marker);
    }
}

vm = {
    self: this,
    markers: markers,
    filter: ko.observable(""),
    showInfoWindow: function() {
        alert(this);
    },
}

vm.filterResults =  function (marker) {
    return ko.computed(function() {
        x = marker
        title = marker.title.toLowerCase()
        filter = vm.filter().toLowerCase()
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