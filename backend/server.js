require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.SERVER_PORT;
const db = require("./config/dbConnect");
const authRouter = require("./routes/authRoute");
const bodyParser = require('body-parser');
const {notFound, errorHandler} = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");
const morgan = require("morgan"); //used to differentiate the type of request and the time


app.use(morgan());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser);

app.use("/", require("./routes/index"));

//setting the middlewares

app.use(notFound);
app.use(errorHandler);


app.listen(port, () => {
 console.log(`Server is running on port ${port}`);
});