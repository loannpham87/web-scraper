// dependencies and constants
const cheerio = require("cheerio"),
    axios = require("axios"),
    express = require("express"),
    logger = require("morgan"),
    mongoose = require("mongoose"),
    app = express(),
    exphbs = require("express-handlebars"),
    db = require("./models"),
    PORT = process.env.PORT || 3000;

    

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("./public"));

//setting up handlebars middleware

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//apiRoutes
require("./routes/apiRoutes")(app);

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost:27017/articles", { useNewUrlParser: true });

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});

