import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db';

const router = express.Router();
 
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 30 * 24 * 60 * 1000 // 30 days
}

const generateToken = (id) => {
    return jwt.sign((id), process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
}

router.post('/register', async (req, res) => {
    const {username, email, password} = req.body;

    if (!username || !email || !password) {
    return res.status(400).join({ message: 'please provide all required rields'});
}
const userExists = await pool.query('SELECT * FROM user WHERE email = $1', [email]);

if (userExists.rows.length > 0) {
    return res.status(400).json({ message: 'user already exists'});
}

const hashedPassword = await bcrypt.hash(password, 10);

const newuser = await pool.query(
    'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
    [username, email, hashedPassword]
);

const token = generateToken(newuser.rows[0].id);
res.cookie('token', token, cookieOptions);
return res.status(201).json({user: newuser.rows[0]});

})

//Login

router.post('/login', async (req, res) => {
    const { mail, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({message: 'Please provide all requied fields'});
    }
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if(user.row.length === 0) {
        return res.status(400).json({message: 'Invalid credentials'});
    }

    const userData = user.rows[0];
    const isMatch = await bcrypt.compare(password, userData.password)

    if(!isMatch){
        return res.status(400).json({message: 'Invalid credentials'});
    }

    const token = generateToken(userData.id);

    res.cookie('token', token, cookieOptions);
    res.json({user: {id: userData.id, username: userData.username, 
        email: userData.email}});
})

// the data of the loged in user

router.get("/me", async (req, res) => {
    res.json(req.user);
    //return info of the logged in user from protection middleware
})


