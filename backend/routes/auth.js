const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const user = new User({ username, email, password });
        await user.save();
        
        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user' });
    }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: 'Authentication error' });
        }
        if (!user) {
            return res.status(401).json({ message: info.message || 'Authentication failed' });
        }
        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Session error' });
            }
            return res.json({ 
                user: { 
                    id: user._id, 
                    username: user.username, 
                    email: user.email 
                } 
            });
        });
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ message: 'Error logging out' });
        res.json({ message: 'Logout successful' });
    });
});

router.get('/check-auth', (req, res) => {
  if (req.isAuthenticated()) {
      res.json({ 
          isAuthenticated: true, 
          user: {
              id: req.user._id,
              username: req.user.username,
              email: req.user.email
          }
      });
  } else {
      res.json({ isAuthenticated: false });
  }
});

module.exports = router;