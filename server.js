var express = require("express");
var morgan = require("morgan");
var path = require("path");
var app = express();
app.set('json spaces', 3);
const cors = require('cors');
app.use(cors());
const routerApi= require('./routes/apiRouter');
// app.use(express.static("public"));
app.use('/',routerApi);

// Milddleware function
app.use(morgan("short"));
const imagepath = path.join(__dirname,"images");
app.use(express.static(imagepath));

app.use(express.json());

let propertiesReader=require("properties-reader");
let propertiesPath=path.resolve(__dirname,"conf/db.properties");
let properties= propertiesReader(propertiesPath);
let dbPprefix=properties.get("db.prefix");
let dbPwd=encodeURIComponent(properties.get("db.pwd"));
let dbUrl=properties.get("db.dbUrl");
let dbParams=properties.get("db.params");
let dbName=properties.get("db.dbName");
let dbUsername=encodeURIComponent(properties.get("db.user"));


const url=dbPprefix+dbUsername+":"+dbPwd+dbUrl+dbParams;
const {MongoClient, ServerApiVersion,ObjectId}=require("mongodb");
const client=new MongoClient(url, {serverApi:ServerApiVersion.v1});
let db=client.db(dbName);


app.param('dbcollection',function (req,res,next,dbcollection){
    req.collection=db.collection(dbcollection);
    return next();
});

// trying to print ex
app.get('/', function(req, res, next)
{
    res.send('Select a collection, eg, /Products')
});

app.get('/:dbcollection',function (req,res,next){
    req.collection.find({}).toArray(function(err,results){
        if(err){
            return next(err);
        }
        if(results.length==0){
            return next();
        }
        else{
            res.send(results);
        }
      
    });
});
// Here used the insertone to get through the order

app.post('/:dbcollection',function (req,res,next){
    req.collection.insertOne(req.body,(function(err,results){
        if(err){
            return next(err);
        }
        res.send("Updated");
    }));
});
//          put method used for the lesson update msg 
app.put('/:dbcollection/:id',function (req,res,next){
    console.log(req.params.id)
    let idd=parseInt(req.params.id);
    req.collection.updateOne({id:idd},
        {$set:req.body},
        {safe:true,multi:false},function(err,result){

            if(err){
                return next(err);
            }
            res.send(result);
        });
});
app.get('/:dbcollection/search',function (req,res,next){
    let searchword=req.query.q;
    req.collection.find({subject:
            {$regex:new RegExp(searchword)}}).toArray(function(err,results){
        if(err){
            return next(err);
        }
            res.send(results);
            });

});


// Complex query price
// app.get('/:dbcollection', function(req, res, next) {
// req.collection.find({}, {limit: 3, sort: [["price", -1]]}).toArray(function(err, results) {
// if (err) {
// return next(err);
// }
// res.send(results);
// });
// });

app.use(function(req,res){
    res.status(404).send("Error!! 404 Found");
});



app.listen(3030,function(){
    console.log("App started on port 3030");
});