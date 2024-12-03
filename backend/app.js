const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const connectDB = require('./config/db');
const studentRoutes = require('./routes/students');
const courseRoutes = require('./routes/courses');
const authRoutes = require('./routes/auth');

const app = express();

connectDB();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/auth', authRoutes);

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));