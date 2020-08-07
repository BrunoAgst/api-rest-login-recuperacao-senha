const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;


module.exports = function (req, res, next){

   const authToken = req.headers['authorization'];

   if(authToken != undefined){

        const bearer = authToken.split(' ');
        const token = bearer[1];
    try {
        var decoded = jwt.verify(token, secret);
        
        if(decoded == 1){
            next();
        }else{
            res.status(403);
            res.send("Usuário não autorizado");
            return
        }

    } catch (error) {
        res.status(403);
        res.send("Usuário não autenticado");
        return
    }
        

   }else {
       res.status(403);
       res.send("Usuário não autenticado");
   }

}