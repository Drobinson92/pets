var express = require('express');
var app = express();
var bp = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
app.use(express.static(path.join(__dirname, "/clientapp/dist")));
app.use(bp.json());
mongoose.connect('mongodb://localhost/meanbelt');
const PetSchema = new mongoose.Schema({
    name: {type: String, required: [true, 'Name is required'], minlength: [3, 'Name must contain at least 3 characters']},
    type: {type: String, required: [true, 'Type is required'], minlength: [3, 'Type must contain at least 3 characters']},
    description: {type: String, required: [true, 'Description is required'], minlength: [3, 'Description must contain at least 3 characters']},
    skill1: {type:String, default: 'none'},
    skill2: {type:String, Default: "none"},
    skill3: {type:String, default: 'none'},
    likes: {type: Number, default: 0}
}, {timestamps: true})
mongoose.model('Pet', PetSchema)
const Pet = mongoose.model('Pet')

app.get('/pets', function(req, res){
    
    Pet.find({}).sort('type').exec(function(err, data){
        console.log(data)
        res.json(data)
    })
})

app.post('/pets', function (req, res) {
    console.log('in post')
    var pet = new Pet({
        name: req.body.name,
        type: req.body.type,
        description: req.body.description,
        skill1: req.body.skill1,
        skill2: req.body.skill2,
        skill3: req.body.skill3})
    pet.save(function(err, data){
        console.log(data)
        if (err) {
            console.log("errors");
            res.json(err)
        }
        else{ 
            console.log("successfully added");
            res.json(data);
        }
    })
})

app.get('/pets/:id', function(req, res){
    Pet.findById(req.params.id, function(err, pet){
        if(err){console.log('error retrieving single pet')}
        else{
            console.log('single pet retrieved', pet)
            res.json(pet)
        }
    })
})

app.put('/pets/:id', function(req, res){
    Pet.findById(req.params.id, function(err, pet){
        console.log(pet)
        pet.name = req.body.name;
        pet.type = req.body.type;
        pet.description = req.body.description;
        pet.skill1 = req.body.skill1;
        pet.skill2 = req.body.skill2;
        pet.skill3 = req.body.skill3;
        pet.save(function(err,data){
            if(err){
                console.log('errors in update')
                res.json(err)
            }
            else{
                console.log('you updated playa!')
                res.json(data);
            }
        })
    })
})

app.put('/pets/upvote/:id', function(req, res){
    Pet.findById(req.params.id, function(err, pet){
        console.log(pet)
        pet.likes += 1
        pet.save(function(err,data){
            if(err){
                console.log('errors in update')
                res.json(err)
            }
            else{
                console.log('you upvoted playa!')
                res.json(data)
            }
        })
    })
})


app.delete('/pets/:id', function(req, res){
    Pet.findByIdAndRemove(req.params.id, function(err, data){
        res.json(data)
    })
})


app.all("*", (req, res, next)=>{
    res.sendFile(path.resolve("./clientapp/dist/index.html"))
})
app.listen(8000, function(){
    console.log("Welcome to my exam, favorite instructor!")
})