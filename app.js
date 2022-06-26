const express = require("express");
const app = express();

// using body-parser to receive form values in the request
const bodyParser = require("body-parser");
// parses the JSON objects in the request
app.use(bodyParser.urlencoded({extended: true}));

// using EJS engine to render dynamic pages
const ejs = require("ejs");
// setting up the EJS as view engine
app.set('view engine', 'ejs');

// to easily connect to mongoDB and make schemas, models easily
const mongoose = require("mongoose");
// connecting to mongoDB
mongoose.connect("mongodb://localhost:27017/wikiDB");

// creating the article schema
const articleSchema = new mongoose.Schema({

    title: String,
    content: String
})

// creating the article document model
const Article = mongoose.model("Article", articleSchema);

// API routes for all articles 
// chained route handlers using app.route()
app.route('/articles')
    .get((req, res) => {

        Article.find({}, (err, results) => {

            if(err){

                res.send(err);
            }else{

                res.send(results);
            }
        })
    })
    .post((req, res) => {

        const newTitle = req.body.title;
        const newContent = req.body.content;

        const newArticle = new Article({

            title: newTitle,
            content: newContent
        });

        newArticle.save( function(err){

            if(err){

                res.send(err);
            }else{

                res.send("successfully added a new article");
            }
        });
    })
    .delete((req, res) => {

        Article.deleteMany({}, function(err) {

            if(err){

                res.send(err);
            }else{

                res.send("Successfully deleted all articles");
            }
        })
    })


// API routes for specific article
app.route("/articles/:articleTitle")
    .get((req, res) => {

        const articleTitle = req.params.articleTitle;

        // find all the articles written by author
        Article.findOne({title: articleTitle}, (err, result) => {

            if(err){

                res.send("No articles matching that title was found.");
            }else{

                // send the articles
                res.send(result);
            }
        })
    })
    .put((req, res) => {

        /*

        we are using the 'update' method to update the article

        synatx:-

        <Model Name>.update(
            {conditions},
            {updates},
            {overwrite: true},
            function (err, results) {

            }
        )

        */

        Article.updateOne({title: req.params.articleTitle}, {content: req.body.content, title: req.body.title}, function(err, results) {

            if(err){

                res.send(err);
            }else{

                res.send("succesfully updated your article");
            }
        })
    })
    .patch((req, res) => {

        Article.updateOne({title: req.params.articleTitle}, {$set: req.body}, function(err) {

            if(err){

                res.send(err);
            }else{

                res.send("successfully updated the article");
            }

        })
    })
    .delete((req, res) => {

        Article.deleteOne({title: req.params.articleTitle}, function(err) {

            if(err){

                res.send(err);
            }else{

                res.send("successfully deleted the article");
            }
        })
    })


app.listen(8080, () => {
    console.log("listening on port 8080");
})