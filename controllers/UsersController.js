const User = require("../models/Users");
const PasswordToken = require("../models/PasswordToken");
const bcrypt = require("bcrypt");
const secret = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");

class UserController{

    async index(req, res){
        var users = await User.findAll();
        res.json(users);
    }

    async findUser(req, res){
        var id = req.params.id;
        const user = await User.findById(id);

        if(user == undefined){
            res.status(404);
            res.json({});
        }else{
            res.status(200);
            res.json(user);
        }
    }
    
    async create(req, res){
        const {email, name, password} = req.body;

        if(email == undefined){
            res.status(400);
            res.json({err: "Email inválido!"});
            return;
        }

        if(password == undefined){
            res.status(400);
            res.json({err: "Senha inválida!"});
            return;
        }


        const emailE = await User.findByEmail(email);

        if(emailE){
            res.status(406);
            res.json({err: "Email já cadastrado!"});
            return;
        }

        await User.create(email, password, name);

        res.status(200);
        res.send("Sucesso");
        
    }

    async edit(req, res){
        const {id, name, role, email}= req.body;

        var result = await User.update(id, email, name, role);

        if(result != undefined){
            if(result.status){
                res.status(200);
                res.send("Tudo OK!");
            }
            else{
                res.status(406);
                res.send(result.err);
            }
        }else{
            res.status(406);
            res.send("Ocorreu um erro no servidor");
        }
    }

    async delete(req, res){
        const id = req.params.id;

        var result = await User.delete(id);
        
        if(result.status){
            res.status(200);
            res.send("Tudo Ok");
        } else {
            res.status(406);
            res.send(result.err);
        }

    }

    async recoveryPassword(req, res){
        const email = req.body.email;

        var result = await PasswordToken.create(email);

        if(result.status){
            console.log(result.token);
            res.status(200);
            res.json(result.token);

        }else{
            res.status(406);
            res.send(result.err);
        }
    }
    async changePassword(req, res){
        const token = req.body.token;
        const password = req.body.password;

        var isTokenValid = await PasswordToken.validate(token);

        if(isTokenValid.status){
            try {
                await User.changePassword(password, isTokenValid.token.user_id, token);
                res.status(200);
                res.send("Senha Alterada");
                
            } catch (error) {
                res.status(406);
                res.send("Token inválido");
            }



        }else{
            res.status(400);
            res.send("Token inválido");
        }


    }

    async login(req, res){
        const {email, password} = req.body;

        try {
            var user = await User.findEmail(email);

            if(user != undefined){

               var result = await bcrypt.compare(password, user.password);

               if(result){
                  
                    const token = jwt.sign({ email: user.email, role: user.role}, secret);
                    res.status(200);
                    res.json({token: token});

               }else{
                    res.status(406);
                    res.send("Senha inválida");
               }

            }else {
                res.json({status: false});
            }

        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new UserController();