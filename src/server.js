import express from 'express';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

app.get('*', (req, res) => res.json({ message: 'Welcome Here!'}));

app.listen(port, () => console.log(`Listening on http://localhost:${port}`));