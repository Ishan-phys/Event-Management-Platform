require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const port = process.env.PORT;
const db_connector = process.env.DB_URI.replace('<db_password>', process.env.DB_PASS);

const connectToDb = async () => {
    try {
        await mongoose.connect(db_connector);
        console.log(`Successfully connected to the db`);
    } catch (err) {
        console.log(`Error connecting to the db: ${err}`);
        process.exit(1);
    }
};

(async () => {
    await connectToDb();

    app.listen(port, (err) => {
        if (err) {
            return console.log('Something bad happened', err);
        }
        console.log(`Server is listening on ${port}`);
    });
})();
