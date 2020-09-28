import userControllers from '../controllers/user';
import profileControllers from '../controllers/profile';
import requestControllers from '../controllers/request';
import adminControllers from '../controllers/admin';
import supervisorControllers from '../controllers/supervisor';
import cancelControllers from '../controllers/cancel';
import repairControllers from '../controllers/repairs';


const router = app => {
    app.use('/api/v1/auth', userControllers);
    app.use('/api/v1/profile', profileControllers);
    app.use('/api/v1/user', adminControllers);
    app.use('/api/v1/request', requestControllers);
    app.use('/api/v1/supervisor', supervisorControllers);
    app.use('/api/v1/cancel', cancelControllers);
    app.use('/api/v1/repairs', repairControllers);
    app.use((req, res, next) =>{
        res.status(200).json({ greetings: 'Welcome to repairs_tracks' });
    });
};

export default router;

