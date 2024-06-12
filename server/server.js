require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const apiRouter = express.Router();

// Middleware function to log request information
const logRequestInfo = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}\n`);
    next();
};


app.use(cors());

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

app.use(logRequestInfo)

const authRoutes = require('./api/auth');
const musicRoutes = require('./api/music');

apiRouter.use('/auth', authRoutes);
apiRouter.use('/music', musicRoutes);
apiRouter.get('/test', (req, res) => {
    res.json({mss: 'hello'});
})

app.use('/api', apiRouter);

app.listen(8080, () => {
    console.log('Server running on http://localhost:8080');
});
