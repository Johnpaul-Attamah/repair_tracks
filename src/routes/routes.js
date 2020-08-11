import userControllers from '../controllers/user';
import profileControllers from '../controllers/profile';

const router = app => {
    app.use('/api/v1/auth', userControllers);
    app.use('/api/v1/profile', profileControllers);
    app.use((req, res, next) =>{
        res.status(200).json({ greetings: 'Welcome to repairs_tracks' });
    });
};

export default router;

