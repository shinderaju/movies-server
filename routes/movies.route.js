const auth = require('../services/auth.service');
const express = require('express');
const movieRoutes = express.Router();
const mongoose = require('mongoose');

let movie = require('../models/movies.model');

//get all movies data
function getMovies(req,res) {
    movie.find((error, data) => {
        if (error) {
            return res.status(501).send({ error: error});
        } else {
            res.json(data)
        }
    })
}
function getMovieById(req,res) {
    console.log('req.params.id', req.params.id);
    movie.findOne({ _id: mongoose.Types.ObjectId(req.params.id) }, function (err, docs) {
        if (err){
            console.log(err);
            return res.status(501).send({ error: err});
        }
        else{
            console.log("Result : ", docs);
            return res.json(docs);
        }
    });
}
function addMovie(req,res) {
    console.log('add', req.body);
    try{
        const movieObject = {
            popularity: Number(req.body.popularity),
            director: req.body.director,
            genre: req.body.genre,
            imdb_score: Number(req.body.imdb_score),
            name: req.body.name
        };
        movie.create(movieObject, (error, data) => {
            if (error) {
                return res.status(501).send({ error: error});
            } else {
                res.json(data);
            }
        })
    }catch (e) {
        console.log('adfsfs');
        return res.status(501).send({ error: e});
    }
}
function updateMovie(req,res){
    console.log('req.params.id',req.params.id);
    const movieObject = {
        popularity: Number(req.body.popularity),
        director: req.body.director,
        genre: req.body.genre,
        imdb_score: Number(req.body.imdb_score),
    };
    movie.findByIdAndUpdate(req.params.id, {
        $set: movieObject
    }, (error, data) => {
        if (error) {
            console.log(error);
            return res.status(501).send({ error: error});
        } else {
            res.json(data)
            console.log('Data updated successfully')
        }
    })
}
function deleteMovie(req,res){
    movie.findOneAndRemove(req.params.id, (error, data) => {
        if (error) {
            return res.status(501).send({ error: error});
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
}

movieRoutes.route('/getMovies').get(getMovies);
movieRoutes.route('/getMovies/:id').get(auth.isAuthenticated, auth.isAutherised, getMovieById);
movieRoutes.route('/addMovie', ).post(auth.isAuthenticated,auth.isAutherised, addMovie);
movieRoutes.route('/update/:id').put(auth.isAuthenticated,auth.isAutherised, updateMovie);
movieRoutes.route('/delete/:id').delete(auth.isAuthenticated,auth.isAutherised, deleteMovie);
module.exports = movieRoutes;
