/*
:::::: Variaveis globais
*/
var map;
var directionsPanel;
var directions;
var from;
var to;
var urlPrint;
var lat, lng;
var bounds;
var geocoder = new google.maps.Geocoder();
var directionsService = new google.maps.DirectionsService();

function CarregarMapa() {
    map = new google.maps.Map(document.getElementById('gmap'), {
        'zoom': 3,
        'center': new google.maps.LatLng(70, 0),
        'mapTypeId': google.maps.MapTypeId.ROADMAP
    });

    //Inicializa a o limite do mapa
    bounds = new google.maps.LatLngBounds();


    //Cria o marcador
    marker1 = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(65, -10),
        draggable: true,
        title: 'Arraste-me!'
    });
    //Redimensiona o limite do mapa, de acordo com o novo ponto 
    bounds.extend(new google.maps.LatLng(65, -10));

    //Carrega valores para a latitude e longitude
    lat = parseFloat($("#hdnLatitude").val());
    lng = parseFloat($("#hdnLongitude").val());

    marker2 = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(lat, lng),
        draggable: true,
        icon: 'http://google-maps-icons.googlecode.com/files/airport.png'
    });
    //Redimensiona o limite do mapa, de acordo com o novo ponto 
    bounds.extend(new google.maps.LatLng(lat, lng));


    //Cria um evento para o marcador, que será disparado ao arrastá-lo
    google.maps.event.addListener(marker1, "drag", function () {

        //Recupera a localizacao do marcador
        var latLng = marker1.getPosition();

        //Passa a localizacao do ponto ao arrastar, para inputs text e hidden
        $("#txtLatitude").val(latLng.lat());
        $("#txtLongitude").val(latLng.lng());
        $("#hdnLatitude").val(latLng.lat());
        $("#hdnLongitude").val(latLng.lng());
    });

    //Cria um evento para o marcador, que será disparado ao terminar arrastá-lo
    google.maps.event.addListener(marker1, "dragend", function () {

        geocodePosition(marker1.getPosition());
    });

    //Cria um evento para o marcador, que será disparado ao ser clicado
    google.maps.event.addListener(marker1, "click", function () {
        //Cria uma janela de mensagem para o marcador
        marker.openInfoWindowHtml("Arraste o ponto, para definir a localização");
    });

    //Redefine os limites
    map.fitBounds(bounds);
    //Redefine o zoom de acordo com o limite
    map.setZoom(map.getZoom());
    //Redefine o centro de acordo com o limite
    map.setCenter(bounds.getCenter());
}

function AdicionarLocalizacao() {
    var marker3 = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(-70, -10),
        draggable: true,
        title: 'Arraste-me!',
        icon: 'http://mapicons.nicolasmollet.com/wp-content/uploads/mapicons/shape-default/color-ff8a22/shapecolor-white/shadow-1/border-color/symbolstyle-color/symbolshadowstyle-no/gradient-no/archery.png'
    });
    //Redimensiona o limite do mapa, de acordo com o novo ponto 
    bounds.extend(new google.maps.LatLng(-70, -10));

    //Redefine os limites
    map.fitBounds(bounds);
    //Redefine o zoom de acordo com o limite
    map.setZoom(bounds.getZoom());
    //Redefine o centro de acordo com o limite
    map.setCenter(bounds.getCenter());
}

function CarregarPeloEndereco() {
    //Recupera o endereço no input text
    var endereco = $('#txtEndereco').val();

    //Carrega o endereco no mapa
    geocoder.geocode({
        address: endereco
    }, function (responses) {
        if (responses && responses.length > 0) {
            //Recupera a localiçao retornada pelo geocoder
            var place = responses[0];


            //Cria Marcador
            var marker4 = new google.maps.Marker({
                map: map,
                position: place.geometry.location,
                draggable: true,
                title: 'Arraste-me!',
                icon: 'http://mapicons.nicolasmollet.com/wp-content/uploads/mapicons/shape-default/color-ffc11f/shapecolor-color/shadow-1/border-dark/symbolstyle-white/symbolshadowstyle-dark/gradient-no/scoutgroup.png'
            });
            //Redimensiona o limite do mapa, de acordo com o novo ponto 
            bounds.extend(place.geometry.location);

            //Atualiza valores nos inputs da pagina
            $('#txtEnderecoImovel').val(place.formatted_address);

            //Redefine os limites
            map.fitBounds(bounds);
            //Redefine o zoom de acordo com o limite
            map.setZoom(map.getZoom());
            //Redefine o centro de acordo com o limite
            map.setCenter(bounds.getCenter());
        } else {
            $('#txtEndereco').val('Nao pode determinar a localizacao.');
        }
    });
}

function CriarRota() {
    //Verifica se o input text esta preenchido
    if (Trim($("#ondeestou").val()) == "") {
        alert("Preencha a sua localizacao.");
        return;
    }
    //Limpa todas os marcadores
    //map.clearOverlays();

    //Define o painel que receberá a rota "escrita"
    directionsPanel = document.getElementById("rota_gmap");
    //Limpa o painel de qualquer html
    directionsPanel.innerHTML = "";

    //Recupera o endereco do input text
    from = $("#ondeestou").val();

    var directionsDisplay = new google.maps.DirectionsRenderer({
        'map': map,
        'preserveViewport': true,
        'draggable': true
    });
    directionsDisplay.setPanel(directionsPanel);

    var request = {
        origin: from,
        destination: new google.maps.LatLng(lat, lng),
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
    });
}

function geocodePosition(pos) {
    geocoder.geocode({
        latLng: pos
    }, function (responses) {
        if (responses && responses.length > 0) {
            $('#txtEndereco').val(responses[0].formatted_address);
        } else {
            $('#txtEndereco').val('Nao pode determinar a localizacao.');
        }
    });
}


/*
::::: SCRIPTS DE SUPORTE
*/
function Trim(str) {
    return str.replace(/^\s+|\s+$/g, "");
}

function Imprimir() {
    var disp_setting = "toolbar=yes,location=no,directories=yes,menubar=yes,";
    disp_setting += "scrollbars=yes,width=643, height=600, left=100, top=25";
    var content_vlue = document.getElementById("rota_gmap").innerHTML;
    var docprint = window.open("", "", disp_setting);
    docprint.document.open();
    docprint.document.write('<html><head><title>Como chegar</title>');
    docprint.document.write('<style type="text/css">body{ font-family:Tahoma;font-size:8pt; margin:10px; }</style>');
    docprint.document.write('</head><body><center>');
    docprint.document.write('<h1>Como chegar</h2>');
    docprint.document.write('<div  style="width: 603px; margin-left:2px;">');
    docprint.document.write(content_vlue);
    docprint.document.write('</div>');
    docprint.document.write('<script>window.print();<\/script><\/body><\/html>');
    docprint.document.close();
    docprint.focus();
} 
