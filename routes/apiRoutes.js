const db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");
require("mongoose");

module.exports = function(app) {
    app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.nytimes.com/section/us/").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        let $ = cheerio.load(response.data);
        
        // Now, we grab every h2 within an article tag, and do the following:
        $("article h2").each(function (i, element) {
        // Save an empty result object
        let result = {};

        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
            .children("a")
            .text();
        result.link = $(this)
            .children("a")
            .attr("href");
        result.saved = false;

        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
            .then(function (dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
            })
            .catch(function (err) {
            // If an error occurred, log it
            console.log(err);
            });
        });

        // Send a message to the client
        res.send("Scrape Complete");
    });
    });


    // Route for getting all Articles from the db
    app.get("/api/articles", function (req, res) {
        db.Article.find({})
            .then(function (err, dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
            // If an error occurs, send it back to the client
            res.json(err);
        });
    });

    app.get("/articles", function(req, res) {
        // console.log(req);
        db.Article.find({saved: false},
            function(err, dbarticles) {
                if (err) {
                    console.log(err);
                }
                let hbsObject = {
                    articles: dbarticles
                };
                res.render("index", hbsObject);
        }).catch(function(err) {
            console.log("err displaying articles", err);       
        })
    })

    app.put("/api/articles/:id", function(req, res) {
        db.Article.updateOne({_id: req.params.id},
            {saved: req.body.saved})
        .then(function(dbSavedArticle) {
            console.log(dbSavedArticle);
            res.json(dbSavedArticle);
        }).catch(function(err) {
        console.log(err);
        });
    })

    app.get("/savedArticles", function(req, res) {
        // console.log(req);
        db.Article.find({saved: true},
            function(err, dbarticles) {
                if (err) {
                    console.log(err);
                }
                let hbsObject = {
                    articles: dbarticles
                };
                res.render("savedArticles", hbsObject);
        }).catch(function(err) {
            console.log("err displaying articles", err);       
        });
    })

    // Create a new note
//   app.post("/notes/save/:id", function(req, res) {
//     // Create a new note and pass the req.body to the entry
//     const newNote = new Note({
//       title: req.body.text,
//       body: req.params.id
//     });
//     console.log(req.body);
//     // And save the new note the db
//     newNote.save(function(error, note) {
//       // Log any errors
//       if (error) {
//         console.log(error);
//       }
//       // Otherwise
//       else {
//         // Use the article id to find and update it's notes
//         Article.findOneAndUpdate(
//           { _id: req.params.id },
//           { $push: { notes: note } }
//         )
//           // Execute the above query
//           .exec(function(err) {
//             // Log any errors
//             if (err) {
//               console.log(err);
//               res.send(err);
//             } else {
//               // Or send the note to the browser
//               res.send(note);
//             }
//           });
//       }
//     });
//   });
// ​
//   // Delete a note
//   app.delete("/notes/delete/:note_id/:article_id", function(req, res) {
//     // Use the note id to find and delete it
//     Note.findOneAndRemove({ _id: req.params.note_id }, function(err) {
//       // Log any errors
//       if (err) {
//         console.log(err);
//         res.send(err);
//       } else {
//         Article.findOneAndUpdate(
//           { _id: req.params.article_id },
//           { $pull: { notes: req.params.note_id } }
//         )
//           // Execute the above query
//           .exec(function(err) {
//             // Log any errors
//             if (err) {
//               console.log(err);
//               res.send(err);
//             } else {
//               // Or send the note to the browser
//               res.send("Note Deleted");
//             }
//           });
//       }
//     });
//   });


    // Route for grabbing a specific Article by id, populate it with it's note
    // app.get("/articles/:id", function (req, res) {
    // db.Article.findOne({ _id: req.params.id })
    //     .populate("note")
    //     .then(function(dbArticle) {
    //     // If we were able to successfully find an Article with the given id, send it back to the client
    //     res.json(dbArticle);
    //     }).catch(function(err) {
    //          console.log(err);
    //     // If an error occurred, send it to the client
    //     });
    // })
       }