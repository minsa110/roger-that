var locations = []
var year = 1970;
var markers
function initMap() {

    d3.csv("./data/globalterrorismdb_0616dist.csv", (data) => {
        var filteredData = data.filter((d,i)=>{
            if (d.iyear == year){
                return d;
            }
        });
        for (var i = 0; i < filteredData.length; i++) {
            locations.push({
                lat: Math.round(+filteredData[i].latitude * 1000000) / 1000000,
                lng: Math.round(+filteredData[i].longitude * 1000000) / 1000000
            });
        }

        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 4,
            center: locations[0]
        });

        markers = locations.map((location)=>{
            return new google.maps.Marker({
                position: location,
                map: map
            })
        })

        var markerCluster = new MarkerClusterer(map, markers,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});

    });
}