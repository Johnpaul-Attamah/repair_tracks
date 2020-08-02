import dotenv from 'dotenv';
dotenv.config();

let url = '';

if (process.env.NODE_ENV.trim() === 'production') {
    url = process.env.PROD_DB_URI;
}
if (process.env.NODE_ENV.trim() === 'test') {
    url = process.env.TEST_DB_URI;
}
if (process.env.NODE_ENV.trim() === 'development') {
    url = process.env.DEV_DB_URI;
}

export default url;