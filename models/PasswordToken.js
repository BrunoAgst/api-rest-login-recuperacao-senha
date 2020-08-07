var knex = require("../database/connection");
var User = require("./Users");

class PasswordToken{

    async create(email){
        var user = await User.findByEmail(email);
    
        if(user != undefined){

            const token = Date.now();

            try {
                await knex.insert({
                    user_id: user.id,
                    used: 0,
                    token: token  
                }).table("password-token");

                return {status: true, token: token};

            } catch (error) {
                console.log(err);
                return {status: false, err: err}
    
            }

        }else{
            return {status: false, err: "O email não existe!"}
        }
    }


    async validate(token){

        try {
            var result = await knex.select().where({token: token}).table("password-token");

            if(result.length > 0){
                
                var tk = result[0];

                if(tk.used){
                    return {status: false};
                }else{
                    return {status: true, token: tk};
                }

            }else{
                return false;
            }
            
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async setUsed(token){
        try {
            await knex.update({used: 1}).where({token: token}).table("password-token");
        } catch (error) {
            console.log(error);
        }
    }

}

module.exports = new PasswordToken();