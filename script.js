//temp var. remove later
var fourSqrData

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
    maxSideBar: ko.observable(true),
    markerData: ko.observableArray(),
    markers: [],
    fourSquareData: ko.observable(""),
    errors: ko.observable(""),
    filter: ko.observable(""),
    displayInfoWindow: function() {
        marker = findMarker(this.id)
        showInfoWindow(marker, largeInfoWindow)
    },
    sidebarToggle: function() {
        if (this.maxSideBar()) {
            this.maxSideBar(false)
        } else {
            this.maxSideBar(true)
        }
    }
}


vm.filterResults =  function (data) {
    return ko.computed(function() {        
        id = data.id 
        title = data.title.toLowerCase()
        filter = vm.filter().toLowerCase()
        marker = findMarker(data.id);
        
        //when the map is still loading it may not find the marker right away
        //this will test that and just set to true until the markers are all loaded
        if (marker == false){
            return true;
        }
        
        if (vm.filter() == "") {
            marker.setMap(map);
            return true;
        }
        // -1 means no search found
        if (title.search(filter) != -1) {
            marker.setMap(map)
            return true;
        }

        //else it sets marker on map to null.
        marker.setMap(null)
        return false;
    }, this);
};

ko.applyBindings(vm);

function showInfoWindow(marker, infoWindow) {
    
    //FOURSQUARE DETAILS
var clientId = 'UVH2XVQVKG32VB0D1SAHCKLIS1VQQBDHUDHCA43WMNJ04VMY';
var clientSecret = 'F1EIWBO14JZDDY3QSY5MOAE3FJYJ0ID43FSJNAIM1MRDUOH2';
var latLng = marker.location.lat + "," + marker.location.lng
url = "https://api.foursquare.com/v2/venues/search?limit=1&v=20170413" + 
    "&ll=" + latLng + 
    "&client_id=" + clientId + 
    "&client_secret=" + clientSecret;
    infoWindow.marker = marker;
infoWindow.setContent(
    '<div>' + marker.title + '</div>' +
    '<div data-bind="text: fourSquareData"></div>'
);

//make marker bounce
marker.setAnimation(google.maps.Animation.BOUNCE);
setTimeout(function() {
marker.setAnimation(null);
}, 2100);

infoWindow.open(map, marker);
// Make sure the marker property is cleared if the infoWindow is closed.
infoWindow.addListener('closeclick',function(){
    infoWindow.setMarker = null;
    vm.fourSquareData("")
});
    
    
    var fourSqrData;
    $.ajax({
        method: "get",
        url: url,
        dataType: "json",
        timeout: 3000,
        success: function(data) {
            
            x = data;
            $.each(data, function() {
                
                fsq = data.response.venues[0]
                vm.fourSquareData("test")
                
                var address = fsq.location.formattedAddress[0] || 'Address was not provided';
                var cityState = fsq.location.formattedAddress[1] || 'City/State was not Provided';
                var phone = fsq.contact.formattedPhone || 'A Phone # was not provided';

                infoWindow.setContent(
                    '<div>' + marker.title + '</div>' +
                    '<div>' + address + 
                    '<div>' + cityState + '</div>' +
                    '<div>' + phone + '</div>' 
                );

            });
        },
        error: function() {
            alert("There was an error retreiving data from FourSquare, Please try again later!");
        }
    });
}

function findMarker(id) {
    
    for(var i=0; i < vm.markers.length; i++) {
        if (vm.markers[i].id == id) {
            return vm.markers[i];
        }
    }
    return false;
}

function mapError() {
    document.write("There was an error loading the map, please try Refreshing your browser and try again");

}