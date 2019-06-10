// Paramètrage de  la map
var mymap = L.map('worldmap',
            {
              center: [48.866667, 2.333333],
              zoom: 13
            }
           );

// Choix du service de cartographie
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(mymap);

//  Création du marqueur avec un pop up
L.marker([48.857762, 2.279725]).addTo(mymap);
L.marker([48.857762, 2.279725]).addTo(mymap).bindPopup('Notre boutique BikeShop');


// Customisation du marquueur
var customIcon = L.icon({
    // taille des images
    iconSize:     [38, 95],
    shadowSize:   [50, 64],

    // position  des images par rapport a la position du marqueur
    iconAnchor:   [22, 94],
    shadowAnchor: [4, 62],

    // position  de  la  popup
    popupAnchor:  [-3, -76]
});

L.marker([48.858370, 2.294481], {icon: customIcon}).addTo(mymap);

// Manipulation des popup
var marker = L.marker([48.858370, 2.294481]).addTo(mymap);
marker.bindPopup('La Tour Eiffel');

var marker = L.marker([48.858370, 2.294481]).addTo(mymap);
marker.bindPopup('La Tour Eiffel').openPopup();

// Utilisation des  événements pour l'ouverture de la map
mymap.on('click', function onMapClick(e) {

    console.log(e.latlng);

});


$(function() {
    /**
    * Smooth scrolling to a specific element
    **/
    function scrollTo( target ) {
        if( target.length ) {
            $("html, body").stop().animate( { scrollTop: target.offset().top }, 1500);
        }
    }
    // exemple
    scrollTo( $("#ancre") );
});
