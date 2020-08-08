import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import url from './models/Connect';
import routeMiddleware from './routes/routes';

dotenv.config();

const app = express();

(async () => {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    } catch (err) {
        throw err;
    }
})();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 5000;

app.get('*', (req, res) => res.json({ message: 'Welcome Here!'}));

routeMiddleware(app);

app.listen(port, () => console.log(`Listening on http://localhost:${port}`));

export default app;