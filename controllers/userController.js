const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const register = async function (req, res) {
    // User Signup
    try {
        if (!req.body.email || !req.body.password || !req.body.name) {
            return res.status(400).send({body: "Missing Fields"})
        }

        // Create the user in the db
        const user = await User.create({
            email: req.body.email,
            password: req.body.password,
            name: req.body.name,
            roles: req.body.roles
        })
        res.status(200).send({body: user});
    } catch (err) {
      console.log(`Error occured in registering the user. Error: ${err}`);
      res.status(400).send({body: `Error: ${err}`});
    }
}

const login = async function (req, res) {
    try {  
      const { email, password } = req.body;
      
      // Check if the email and password is entered
      if (!email || !password) {
        return res.status(400).json({ message: "Email or Password missing" });
      }
      
      // Check if the user exists in the db
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      
      // Verify the user password
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ message: "Incorrect password" });
      }
      
      // Generate the JWT token
      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '24h',
      });
  
      res.status(200).json({ token });
    } catch (err) {
      console.error(`Login error: ${err}`);
      res.status(500).json({ message: "Internal server error", error: err.message });
    }
};
  
const getPreferences = async function (req, res) {
    // Fetch the user preferences
    try {
        const userEmail = req.user.email;

        if (userEmail) {
            const user = await User.findOne({email: userEmail});
            return res.status(200).send({preferences : user.preferences});
        } else {
            return res.status(401).send({message: "User Not Found"});
        }
    } catch (err) {
      console.log(`Error in fetching user preferences: ${err}`);
      res.status(400).send({body: `Error: ${err}`});
    }
}

module.exports = { register, login, getPreferences };