const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const mysql = require('mysql');
const cors = require('cors');

const port = 3000

app = express();

app.set('port', port);
app.use(cors()) 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// End points
app.get("/", (req, res, next)=>{
    console.log('got request');
    res.json({message: 'server is running'})
})

// CHAPTER 2
// CHART 1
app.post('/get_choropleth_data_by_year_and_bin', (req, res, next)=>{
    const limits = [req.body.min, req.body.max];
    const year = req.body.year;
    
    const query = `SELECT temp.town, IFNULL(count(units),0) as number_of_blocks, IFNULL(SUM(units),0) as number_of_units from final_hdb_info 
                RIGHT OUTER JOIN (
                    SELECT DISTINCT(town) from final_hdb_info
                ) as temp
                ON temp.town = final_hdb_info.town
                AND final_hdb_info.room_type = "total_dwelling_units"
                AND ( ${year} - final_hdb_info.year_completed)>=${limits[0]}
                AND ( ${year} - final_hdb_info.year_completed)<${limits[1]}
                group by temp.town;`;

    const db = createConnection();
    db.connect(function(err) {
        if (err) {
            console.error('Error connecting: ' + err.stack);
            return;
        }
    });
    db.query(query, (error, results)=>{
        if(error===null || error === undefined){
            res.json({result:results});
        }
    })
    db.end();
})

app.post('/get_max_blocks',(req, res, next) => {
    const limits = [req.body.min, req.body.max];
    const year = req.body.year;

    const max_blocks_query = `SELECT MAX(number_of_blocks) as max_value from (
        SELECT temp.town, IFNULL(count(units),0) as number_of_blocks, IFNULL(SUM(units),0) as number_of_units from final_hdb_info 
        RIGHT OUTER JOIN (
            SELECT DISTINCT(town) from final_hdb_info
        ) as temp
        ON temp.town = final_hdb_info.town
        AND final_hdb_info.room_type = "total_dwelling_units"
        AND ( (${year} - final_hdb_info.year_completed))>=${limits[0]}
        AND ( (${year} - final_hdb_info.year_completed))<${limits[1]}
        group by temp.town
        ) as temp;`;
    const db = createConnection();
    db.connect(function(err) {
        if (err) {
            console.error('Error connecting: ' + err.stack);
            return;
        }
    });
    db.query(max_blocks_query, (error, results)=>{
        if(error===null || error === undefined){
            res.json({result:results[0].max_value});
        }
    })
    db.end();
}) 

app.post('/get_town_center_latlong', (req, res, next)=> {
    const town = req.body.town;
    const query = `
        SELECT latitude, longitude from towndata
        WHERE town = "${town}";`

    const db = createConnection();
    db.connect(function(err) {
        if (err) {
            console.error('Error connecting: ' + err.stack);
            return;
        }
    });
    db.query(query, (error, results)=>{
        if(error===null || error === undefined){
            res.json({result:results[0]});
        }
    })
    db.end();
})

app.post('/get_town_units_latlong_by_town', (req, res, next)=> {
    const town = req.body.town;
    const year = req.body.year;
    const limits = [req.body.min, req.body.max];
    const query = `
    SELECT * from final_hdb_info
    WHERE town = "${town}"
        AND final_hdb_info.room_type = "total_dwelling_units"
        AND ( (${year} - final_hdb_info.year_completed))>=${limits[0]}
        AND ( (${year} - final_hdb_info.year_completed))<${limits[1]};`

    const db = createConnection();
    db.connect(function(err) {
        if (err) {
            console.error('Error connecting: ' + err.stack);
            return;
        }
    });
    db.query(query, (error, results)=>{
        if(error===null || error === undefined){
            res.json({result:results});
        }
    })
    db.end();
})

// CHART 5
app.post('/get_town_dwellings_info',(req, res, next) => {
    const town = req.body.town;
    const year = req.body.year;

    let town_clause = "";
    if(town!=="Singapore"){
        town_clause = `AND final_hdb_info.town = "${town}"`;
    }

    const max_blocks_query = `SELECT temp.room_type, IFNULL(SUM(units), 0) as frequency_of_variable from final_hdb_info
        RIGHT OUTER JOIN (
            select distinct room_type from final_hdb_info
        ) as temp
        ON temp.room_type = final_hdb_info.room_type
        AND final_hdb_info.year_completed<=${year}
        ${town_clause}
        GROUP BY room_type;`;
    const db = createConnection();
    db.connect(function(err) {
        if (err) {
            console.error('Error connecting: ' + err.stack);
            return;
        }
    });
    db.query(max_blocks_query, (error, results)=>{
        if(error===null || error === undefined){
            res.json({result:results});
        }
    })
    db.end();
}) 

// CHAPTER 1
// CHART 6
app.post('/get_room_filter_info',(req, res, next) => {
    const room_type = req.body.room_type;

    const max_blocks_query = `SELECT temp.town, IFNULL(SUM(units),0) as frequency from final_hdb_info
        RIGHT OUTER JOIN (
            SELECT DISTINCT(town) from final_hdb_info
        ) as temp
        ON temp.town = final_hdb_info.town
        AND room_type = "${room_type}"
        GROUP BY town
        ORDER BY temp.town ASC;`;

    const db = createConnection();
    db.connect(function(err) {
        if (err) {
            console.error('Error connecting: ' + err.stack);
            return;
        }
    });
    db.query(max_blocks_query, (error, results)=>{
        if(error===null || error === undefined){
            res.json({result:results});
        }
    })
    db.end();
}) 

// CHAPTER 3
// CHART 4
app.post('/get_new_population_over_year_data',(req, res, next) => {
    const town = req.body.town;

    const max_blocks_query = `SELECT financial_year, new_population 
                            from hdb_demand_supply_town
                            WHERE town_or_estate = "${town}"
                            ORDER BY financial_year;`;
    const db = createConnection();
    db.connect(function(err) {
        if (err) {
            console.error('Error connecting: ' + err.stack);
            return;
        }
    });
    db.query(max_blocks_query, (error, results)=>{
        if(error===null || error === undefined){
            res.json({result:results});
        }
    })
    db.end();
}) 

app.post('/get_construction_over_year_data',(req, res, next) => {
    const town = req.body.town;

    const max_blocks_query = `SELECT financial_year, completed 
                            from hdb_demand_supply_town
                            WHERE town_or_estate = "${town}"
                            ORDER BY financial_year;`;
    const db = createConnection();
    db.connect(function(err) {
        if (err) {
            console.error('Error connecting: ' + err.stack);
            return;
        }
    });
    db.query(max_blocks_query, (error, results)=>{
        if(error===null || error === undefined){
            res.json({result:results});
        }
    })
    db.end();
}) 

// Helper methods

createConnection = () =>{
    return connection = mysql.createConnection({
        host     : 'localhost',
        database : 'HDB',
        user     : 'root',
        password : '',
    });
}

const server = http.createServer(app);

server.listen(port);
console.log('listening to port 3000');