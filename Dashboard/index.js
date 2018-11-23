// Global Variables
let selected_year = 2018;
let max_bin = 20;
let min_bin = 0;
let max_color = 1000;
let selected_town = "Singapore";
let selected_town_chap_3 = "Ang Mo Kio";
let room_type_selected = '1room'
let chart_type = 'absolute';

// Map stuff
let town_center = {};
let units = [];

// Global Data
let choropleth_data = [];
let dwellings_bar_data = {};
let room_type_data_sold = {
    labels: [],
    sold: [],
}
let room_type_data_rental = {
    labels: [],
    rental: [],
}
let construction_data = [];
let population_data = [];

// Helper Methods
get_difference = (median_values, year) => {
    const difference = median_values.map(value => value+99-year);
    return difference;
}

min_max_normalize = (num, min, max) => {
    return (num-(min-5))/((max+5)-(min-5));
}

get_town_name = (town_class) => {
    switch(town_class){
        case "pasir-ris":
            return "Pasir Ris";
        case "bedok":
            return "Bedok";
        case "tampines":
            return "Tampines";
        case "hougang":
            return "Hougang";
        case "serangoon":
            return "Serangoon";
        case "geylang":
            return "Geylang";
        case "marine-parade":
            return "Marine Parade";
        case "sembawang":
            return "Sembawang";
        case "yishun":
            return "Yishun";
        case "punggol":
            return "Punggol";
        case "sengkang":
            return "Sengkang";
        case "amk":
            return "Ang Mo Kio";
        case "bishan":
            return "Bishan";
        case "toa-payoh":
            return "Toa Payoh";
        case "kallang":
            return "Kallang";
        case "central":
            return "Central Area";
        case "bukit-merah":
            return "Bukit Merah";
        case "queenstown":
            return "Queenstown";
        case "bukit-timah":
            return "Bukit Timah";
        case "bukit-batok":
            return "Bukit Batok";
        case "bukit-panjang":
            return "Bukit Panjang";
        case "woodlands":
            return "Woodlands";
        case "cck":
            return "Choa Chu Kang";
        case "jurong-east":
            return "Jurong East";
        case "jurong-west":
            return "Jurong West";
        case "clementi":
            return "Clementi";
        default:
            return "Town Name";
    }
}

get_town_class = (town_name) => {
    switch(town_name){
        case "Pasir Ris":
            return "pasir-ris";
        case "Bedok":
            return "bedok";
        case "Tampines":
            return "tampines";
        case "Hougang":
            return "hougang";
        case "Serangoon":
            return "serangoon";
        case "Geylang":
            return "geylang";
        case "Marine Parade":
            return "marine-parade";
        case "Sembawang":
            return "sembawang";
        case "Yishun":
            return "yishun";
        case "Punggol":
            return "punggol";
        case "Sengkang":
            return "sengkang";
        case "Ang Mo Kio":
            return "amk";
        case "Bishan":
            return "bishan";
        case "Toa Payoh":
            return "toa-payoh";
        case "Kallang":
            return "kallang";
        case "Central Area":
            return "central";
        case "Bukit Merah":
            return "bukit-merah";
        case "Queenstown":
            return "queenstown";
        case "Bukit Timah":
            return "bukit-timah";
        case "Bukit Merah":
            return "bukit-merah";
        case "Bukit Batok":
            return "bukit-batok";
        case "Bukit Panjang":
            return "bukit-panjang";
        case "Woodlands":
            return "woodlands";
        case "Choa Chu Kang":
            return "cck";
        case "Jurong East":
            return "jurong-east";
        case "Jurong West":
            return "jurong-west";
        case "Clementi":
            return "clementi";
        default:
            return "Town Name";
    }
}

get_stats = (town_name) => {
    for(i in choropleth_data) {
        town = choropleth_data[i].town;
        if(town_name.toUpperCase() === town.toUpperCase()){
            return [choropleth_data[i].number_of_units, choropleth_data[i].number_of_blocks];
        }
    }
    return [0,0];
}

get_max_blocks = async (max_bin, min_bin, year)=>{
    const body = {
        year: year,
        max: max_bin,
        min: min_bin
    }
    await fetch('http://127.0.0.1:3000/get_max_blocks',{
        method: 'POST', 
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    })
    .then(res=>res.json())
    .then(responseJson => {
        max_color = responseJson.result;
    })
}

// Data Methods
get_choropleth_data = async (max_bin, min_bin, year)=>{
    const body = {
        year: year,
        max: max_bin,
        min: min_bin
    }
    await fetch('http://127.0.0.1:3000/get_choropleth_data_by_year_and_bin',{
        method: 'POST', 
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    })
    .then(res=>res.json())
    .then(responseJson => {
        choropleth_data = responseJson.result;
    })
    return 1;
}

get_dwellings_bar_data = async (year, town) => {
    const body = {
        year: year,
        town: town
    }
    await fetch('http://127.0.0.1:3000/get_town_dwellings_info',{
        method: 'POST', 
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    })
    .then(res=>res.json())
    .then(responseJson => {
        console.log('hi')
        let result = responseJson.result;
        let data_parse = {}
        for (i in result){
            data_parse[result[i].room_type] = result[i].frequency_of_variable
        }
        dwellings_bar_data = data_parse;
    })

    return 1;
}

get_room_type_bar_data_sold = async (room_type) => {
    const body = {
        room_type: room_type,
    }
    await fetch('http://127.0.0.1:3000/get_room_filter_info',{
        method: 'POST', 
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    })
    .then(res=>res.json())
    .then(responseJson => {
        let result = responseJson.result;
        let data_parse = {
            labels:[],
            sold:[]
        }
        for (i in result){
            data_parse.labels.push(result[i].town.split(' '))
            data_parse.sold.push(result[i].frequency)
        }
        room_type_data_sold = data_parse;
    })

    return 1;
}

get_room_type_bar_data_rental = async (room_type) => {
    const body = {
        room_type: room_type,
    }
    await fetch('http://127.0.0.1:3000/get_room_filter_info',{
        method: 'POST', 
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    })
    .then(res=>res.json())
    .then(responseJson => {
        let result = responseJson.result;
        let data_parse = {
            labels:[],
            rental:[]
        }
        for (i in result){
            data_parse.labels.push(result[i].town.split(' '))
            data_parse.rental.push(result[i].frequency)
        }
        room_type_data_rental = data_parse;
    })

    return 1;
}

get_population_data = async (town) => {
    const body = {
        town: town,
    }
    await fetch('http://127.0.0.1:3000/get_new_population_over_year_data',{
        method: 'POST', 
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    })
    .then(res=>res.json())
    .then(responseJson => {
        let result = responseJson.result;
        let data_parse = []
        for (i in result){
            data_parse.push(result[i].new_population)
        }
        population_data = data_parse;
    })

    return 1;
}

get_construction_data = async (town) => {
    const body = {
        town: town,
    }
    await fetch('http://127.0.0.1:3000/get_construction_over_year_data',{
        method: 'POST', 
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    })
    .then(res=>res.json())
    .then(responseJson => {
        let result = responseJson.result;
        let data_parse = []
        for (i in result){
            data_parse.push(result[i].completed)
        }
        construction_data = data_parse;
    })

    return 1;
}

get_town_center_latlong = async (town) => {
    const body = {
        town: town,
    }
    await fetch('http://127.0.0.1:3000/get_town_center_latlong',{
        method: 'POST', 
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    })
    .then(res=>res.json())
    .then(responseJson => {
        let result = responseJson.result;
        town_center = result;
    })

    return 1;
}

get_unit_data = async (selected_town, max_bin, min_bin, selected_year) => {
    const body = {
        town: selected_town,
        max: max_bin,
        min: min_bin,
        year: selected_year
    }
    await fetch('http://127.0.0.1:3000/get_town_units_latlong_by_town',{
        method: 'POST', 
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    })
    .then(res=>res.json())
    .then(responseJson => {
        let result = responseJson.result;
        units = result;
    })

    return 1;
}

// Chart Methods
// Chapter 1
generate_bar_room_types = async () =>{
    // Generate Data
    room_type_data_sold = {
        labels: [],
        sold: [],
    }
    room_type_data_rental = {
        labels: [],
        rental: [],
    }

    const sold_data_promise = get_room_type_bar_data_sold(`${room_type_selected}_sold`);
    const rental_data_promise =  get_room_type_bar_data_rental(`${room_type_selected}_rental`);

    await sold_data_promise;
    await rental_data_promise;

    if(chart_type==='percentage'){
        for (i in room_type_data_rental.rental){
            let total = room_type_data_rental.rental[i] + room_type_data_sold.sold[i];

            let new_sold = room_type_data_sold.sold[i]/total;
            let new_rental = room_type_data_rental.rental[i]/total;

            room_type_data_sold.sold[i] = new_sold;
            room_type_data_rental.rental[i] = new_rental;

            console.log(i);
        }
    }

    // Prepare variables
    const barData = {
        labels: room_type_data_rental.labels,
        datasets: [
            {
                label: 'Sold',
                data: room_type_data_sold.sold,
                fill: false,
                type: 'bar',
                backgroundColor: "#059bff"
            },
            {
                type: 'bar',
                label: 'Rental',
                backgroundColor: "#ff6384",
                data: room_type_data_rental.rental,
            }]
    }
    const barOptions = {
        scales: {
            xAxes: [{
              ticks: {
                  fontSize: 10
              },
              stacked: true   
            }],
            yAxes: [{
                ticks: {
                    beginAtZero:true
                },
                stacked: true
            }]        
        },
        elements: {
            point:{
                radius: 0
            }
        }
    }

    // Destroy old canvas to make a new one
    $('#chart-room-types-chapter1').remove();
    $('#chapter1').append('<canvas id="chart-room-types-chapter1"></canvas>'); 

    // Create new graph
    var ctx_sold = document.getElementById('chart-room-types-chapter1');
    var myChart = new Chart(ctx_sold, {
        type: 'bar',
        data: barData,
        options:barOptions
    });
}

// Chapter 2
generate_choropleth = async () => {
    let maxPromise = get_max_blocks(max_bin, min_bin, selected_year);
    let choropleth_data_promise = get_choropleth_data(max_bin, min_bin, selected_year)

    await maxPromise;
    await choropleth_data_promise;
    
    for (i in choropleth_data) {
        const normalized_value = min_max_normalize(choropleth_data[i].number_of_blocks, 0, max_color)
        const town_class = get_town_class(choropleth_data[i].town);
        $(".map-hoverables-img-"+town_class).off('mouseenter mouseleave');

        if(choropleth_data[i].number_of_blocks>0){
            $(".map-hoverables-img-"+town_class).css("opacity", normalized_value);
            $(".map-hoverables-img-"+town_class).css("filter", "grayscale(0)");
        } else {
            $(".map-hoverables-img-"+town_class).css("opacity", 1);
            $(".map-hoverables-img-"+town_class).css("filter", "grayscale(1)");
        }
        
        $(".map-hoverables-img-"+town_class).hover(
            function() { 
                $(this).css('cursor', 'pointer');
                const town = get_town_name(this.className.substring(19));
                const stats = get_stats(town);
                const content = `<div>
                        Town Name: ${town} 
                        <br/>
                        Number of Units within this age: ${stats[0]} 
                        <br/>
                        Number of Blocks within this age: ${stats[1]} 
                    </div>`
                tippy(`.${this.className}`, { 
                    content: content,
                    size: 'large'
                })

                if(stats[0]===0){
                    $( this ).fadeTo( 0.1, 0.5); 
                } else{
                    $( this ).fadeTo( 0.1, normalized_value/2); 
                }
            }, // Mouseenter event
            function() {
                $(this).css('cursor', 'default');
                const tip = this._tippy;
                tip.destroy();
                const town = get_town_name(this.className.substring(19));
                const stats = get_stats(town);
                if(stats[0]===0){
                    $( this ).fadeTo( 0.1, 1); 
                } else {
                    $( this ).fadeTo( 0.1, normalized_value); 
                }
                 
            } // Mouseleave event
        );
    }

    
}

generate_bar_dwellings = async () =>{
    // Generate Data
    await get_dwellings_bar_data(selected_year, selected_town);
    
    // Destroy old graph
    $('#chart-dwellings').remove();
    $('.dwellings-container').append('<canvas id="chart-dwellings"></canvas>'); 

    // Prepare data
    const barData = {
        labels: ["1-room", "2-rooms", "3-rooms", "4-rooms", "5-rooms"],
        datasets: [
            {
                type: 'bar',
                label: 'Sold',
                backgroundColor: "#059bff",
                data: [dwellings_bar_data["1room_sold"], dwellings_bar_data["2room_sold"], dwellings_bar_data["3room_sold"], dwellings_bar_data["4room_sold"], dwellings_bar_data["5room_sold"]]
            },
            {
                type: 'bar',
                label: 'Rental',
                backgroundColor: "#ff6384",
                data: [dwellings_bar_data["1room_rental"], dwellings_bar_data["2room_rental"], dwellings_bar_data["3room_rental"], 0, 0],
            }, 
        ]
    }

    const barOptions = {
        scales: {
          xAxes: [{
            stacked: true
          }],
          yAxes: [{
            stacked: true
          }]
        },
        responsive: true
    }

    // Create Chart
    var ctx = document.getElementById('chart-dwellings');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: barData,
        options: barOptions
    });
    
}

generate_map = async () => {
    const town_latlong_promise = get_town_center_latlong(selected_town);
    const units_promise = get_unit_data(selected_town, max_bin, min_bin, selected_year);

    await town_latlong_promise;
    await units_promise;
    console.log(units.length)
    $('#mapid').remove();
    $('.dwellings-container').append('<div id="mapid"></div>')

    var mymap = L.map('mapid').setView([town_center.latitude, town_center.longitude], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 25,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoibGV0aGFuaGFuIiwiYSI6ImNqbmsyNjhvZTEwNmwzd25yYzlzMTBmbzAifQ.olBkK2sOMJQsQga6Na1D7A'
    }).addTo(mymap);

    // Set markers
    let clusterGroup = L.markerClusterGroup();
    for (i in units) {
        let current_unit = units[i];
        var marker = L.marker([current_unit.latitude, current_unit.longitude]);
        marker.bindPopup(`
            <b>Block:</b> ${current_unit.blk_no} <br/>
            <b>Street:</b> ${current_unit.street} <br/>
            <b>Units:</b> ${current_unit.units} <br/>
            <b>Age:</b> ${selected_year-current_unit.year_completed} years old <br/>
        `);
        clusterGroup.addLayer(marker);
    }
    mymap.addLayer(clusterGroup);
    
}
// Chapter 3
generate_line_population_vs_construction = async () => {
    await get_population_data(selected_town_chap_3);
    await get_construction_data(selected_town_chap_3);

    console.log(population_data)
    console.log(construction_data)
    // Prepare data
    const barData = {
        labels: [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016],
        datasets: [
            {
                type: 'line',
                label: 'New Population',
                backgroundColor: '#ff6384',
                borderColor:'#ff6384',
                fill: false,
                data: population_data,
                lineTension: 0
            },
            {
                type: 'line',
                label: 'Housing Stock in Units',
                backgroundColor: '#059bff',
                borderColor:'#059bff',
                fill: false,
                data: construction_data,
                lineTension: 0
            },
        ]
    }

    const aggregatePopulationData = [];
    const aggregateConstructionData = [];

    for(i in population_data) {
        let current_population = population_data[i];
        let current_construction = construction_data[i];

        if(i>0){
            current_population = current_population + aggregatePopulationData[i-1];
            current_construction = current_construction + aggregateConstructionData[i-1];
        }

        aggregatePopulationData.push(current_population);
        aggregateConstructionData.push(current_construction);
    }

    const aggregateBarData = {
        labels: [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016],
        datasets: [
            {
                type: 'line',
                label: ' Cumulative New Population',
                backgroundColor: '#ff6384',
                borderColor:'#ff6384',
                fill: false,
                data: aggregatePopulationData,
                lineTension: 0
            },
            {
                type: 'line',
                label: ' Cumulative Housing Stock in Units',
                backgroundColor: '#059bff',
                borderColor:'#059bff',
                fill: false,
                data: aggregateConstructionData,
                lineTension: 0
            },
        ]
    }

    const barOptions = {
        scales: {
            xAxes: [{
                ticks: {
                    fontSize: 10
                }   
            }]      
        },
        backgroundColor: '',
    }

    // Destroy old graph
    $('#population-vs-construction').remove();
    $('#population-vs-construction-aggregate').remove();
    $('#chap-3-aggregate').append('<canvas id="population-vs-construction"></canvas>'); 
    $('#chap-3-absolute').append('<canvas id="population-vs-construction-aggregate"></canvas>'); 

    // Create new graph
    var ctx_sold = document.getElementById('population-vs-construction');
    var ctx_aggregate = document.getElementById('population-vs-construction-aggregate');

    var myChart = new Chart(ctx_sold, {
        type: 'line',
        data: aggregateBarData,
        options:barOptions
    });

    var myChart2 = new Chart(ctx_aggregate, {
        type: 'line',
        data: barData,
        options:barOptions
    });
}

// Operations Methods
init = async () => {
    // Chapter 1
    generate_bar_room_types();

    // Chapter 2
    generate_choropleth(2018);
    generate_bar_dwellings();
    generate_map();

    // Chapter 3
    generate_line_population_vs_construction();

    // Chapter 4
    // generate_bullet_chart();
    generate_price_chart();

}

// Input Handlers
handle_dropdown = () => {
    var room_type_dropdown = document.getElementById("room_type_dropdown");
    room_type_dropdown.oninput = function() {
        room_type_selected = this.value;
        generate_bar_room_types();
    }

    var chart_type_dropdown = document.getElementById("chart_type_dropdown");
    chart_type_dropdown.oninput = function() {
        chart_type = this.value;
        generate_bar_room_types();
    }

    var room_type_chap3_dropdown = document.getElementById("line_dropdown");
    room_type_chap3_dropdown.oninput = function() {
        selected_town_chap_3 = this.value;
        generate_line_population_vs_construction();
    }
}

handle_time_slider = () => {
    var slider = document.getElementById("myRange");
    var output = document.getElementById("demo");
    var town = document.getElementById('selected_town')
    output.innerHTML = slider.value; // Display the default slider value

    // Update the current slider value (each time you drag the slider handle)
    slider.oninput = function() {
        output.innerHTML = this.value;
        town.innerHTML = "Selected Town: Singapore"
        selected_year = parseInt(this.value);
        selected_town = "Singapore";
    }
    slider.addEventListener('mouseup', ()=>{
        generate_choropleth();
        generate_bar_dwellings();
        generate_map();
    })
}

handle_range_slider = () => {
    var town = document.getElementById('selected_town')
    $( "#slider-range" ).slider({
        range: true,
        min: 0,
        max: 99,
        values: [ 0, 20 ],
        slide: function( event, ui ) {
          $( "#amount" ).val( ui.values[ 0 ] + " years - " + ui.values[ 1 ] + " years " );
        },
        stop: function(event, ui) {
            max_bin = ui.values[ 1 ];
            min_bin = ui.values[ 0 ];
            selected_town = "Singapore"
            town.innerHTML = "Selected Town: Singapore"

            generate_choropleth();
            generate_bar_dwellings();
            generate_map();
        }
      });
    $( "#amount" ).val( $( "#slider-range" ).slider( "values", 0 ) +
      " years - " + $( "#slider-range" ).slider( "values", 1 ) + " years " );
}

set_town = (e) => {
    selected_town = get_town_name(event.target.className.substring(19))
    var output = document.getElementById("selected_town");
    output.innerHTML = `Selected Town: ${selected_town}`
    generate_bar_dwellings();
    generate_map();
}

// Main
$(document).ready(function(){
    init();
    
    handle_dropdown();
    handle_time_slider();
    handle_range_slider();
});