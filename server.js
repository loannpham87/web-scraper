// dependencies and constants
const cheerio = require("cheerio"),
    axios = require("axios"),
    express = require("express"),
    logger = require("morgan"),
    mongoose = require("mongoose"),
    app = express(),
    exphbs = require("express-handlebars"),
    db = require("./models"),
    path = require("path");
    
let PORT = process.env.PORT || 3000;

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "/public")));

//setting up handlebars middleware

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//apiRoutes
require("./routes/apiRoutes")(app);

// Connect to the Mongo DB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines"
mongoose.connect(MONGODB_URI);

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});

