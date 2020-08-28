import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import passport from 'passport';
import url from './models/Connect';
import routeMiddleware from './routes/routes';
import { passportMiddleware } from './middlewares/passport';

dotenv.config();

const app = express();

(async () => {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
    } catch (err) {
        throw err;
    }
})();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
passportMiddleware(passport);

routeMiddleware(app);

app.get('*', (req, res) => res.json({ message: 'Welcome Here!'}));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on http://localhost:${port}`));

export default app;