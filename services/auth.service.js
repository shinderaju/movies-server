const jwt = require('jsonwebtoken');
function isAuthenticated(req,res,next) {
    console.log('isAuthenticated', req.body);
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        console.log('token', token);
        console.log('env',process.env.accessTokenSecret);

        jwt.verify(token, process.env.accessTokenSecret, (err, user) => {
            if (err) {
                console.log('err', err);
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
}
function isAutherised(req,res,next){
    const { role } = req.user;
    console.log('isAUtherised',role);

    if (role && role.toLowerCase() !== 'admin') {
        return res.sendStatus(403);
    }
    next();
}
module.exports = {
    isAuthenticated,
    isAutherised
}
