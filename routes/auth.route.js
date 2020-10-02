const express = require('express');
const jwt = require('jsonwebtoken');
const accessTokenSecret = process.env.accessTokenSecret;
const refreshTokenSecret = process.env.refreshTokenSecret;
let refreshTokens = [];
const authRoute = express.Router();
let Employee = require('../models/Employee');

function login(req,res) {
    try {
        const { email, password } = req.body;
        Employee.findOne({ 'email': email,'password': password },(err,user)=>{
            if(err){
                res.status(401).send({msg:'Username or password incorrect'});
            }
            if (user) {
                console.log('logedin user',user);
                // generate an access token
                const accessToken = jwt.sign({ username: user.email, role: user.role }, accessTokenSecret);
                const refreshToken = jwt.sign({ username: user.email, role: user.role }, refreshTokenSecret);

                refreshTokens.push(refreshToken);

                res.json({
                    accessToken,
                    refreshToken
                });
            } else {
                res.send('Username or password incorrect');
            }
        });
        console.log('accessTokenSecret', accessTokenSecret);
        console.log('refreshTokenSecret', refreshTokenSecret);
    } catch (e) {
        res.status(401).send({msg:'Username or password incorrect'});
    }
}
function logout(req,res) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        refreshTokens = refreshTokens.filter(t => t !== token);
        res.send({msg:"Logout successful"});
    } else {
        res.sendStatus(401);
    }
}
function refreshToken(req,res){
    const { token } = req.body;

    if (!token) {
        return res.sendStatus(401);
    }

    if (!refreshTokens.includes(token)) {
        return res.sendStatus(403);
    }

    jwt.verify(token, refreshTokenSecret, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }

        const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, { expiresIn: '20m' });

        res.json({
            accessToken
        });
    });
}

authRoute.route('/login').post(login);
authRoute.route('/logout').get(logout);
authRoute.route('/refreshToken').post(refreshToken)
module.exports = authRoute;
