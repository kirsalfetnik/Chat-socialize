const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET);
    // return jwt.sign({_id}, process.env.SECRET, { expiresIn: '10d' });
}

// login user
const loginUser = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.login(email, password);

        // create a token
        const token = createToken(user._id);
        const user_Id = user._id;
        const userName = user.name;

        res.status(200).json({email, token, user_Id, userName});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}


// signup user
const signupUser = async (req, res) => {
    const {name, email, password, picture} = req.body;

    try {
        const user = await User.signup(name, email, password, picture);

        // create a token
        const token = createToken(user._id);

        res.status(200).json({name, email, token});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

// GET all users
const getUsers = async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" }}
        ]
    } : {};

    const users = await User.find(keyword).find({ _id: { $ne:req.user._id } });
    return res.status(200).json(users);
}

module.exports = { signupUser, loginUser, getUsers };