var knex = require("../database/connection");
var bcrypt = require("bcrypt");
const PasswordToken = require("./PasswordToken");

class Users{

    async findAll(){

        try {
            
            var result = await knex.select(["id","email", "name","role"]).table("users");
            if(result.length > 0){
                return result;
            }else{
                return undefined;
            }
            
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async findById(id){
        try {
            
            const result = await knex.select(["id","email", "name","role"]).where({id:id}).table("users");
            return result[0];
            
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async findEmail(email){
        try {
            
            const result = await knex.select(["id","email", "password", "name","role"]).where({email: email}).table("users");
            return result[0];
            
        } catch (error) {
            console.log(error);
            return [];
        }
    }
    
    async create(email,password,name){

        try {

            const hash = await bcrypt.hash(password, 10);

            await knex.insert({name, email, password: hash, role: 0}).table("users");
            
        } catch (error) {
            console.log(error);
        }
    }

    async findByEmail(email){

        try {
            var result =  await knex.select("*").from("users").where({email: email});
            
            if(result.length > 0){
                return true;
            }else{
                return false;
            }

        } catch (error) {
            console.log(error);
        }

    }

    async update(id, email, name, role){

        var user = await this.findById(id);

        if(user != undefined){

            var editUser = {};

            if(email != undefined){
                if(email != user.email){
                    var result = await this.findByEmail(email);
                    if(result == false){
                        editUser.email = email;
                    }else{
                        return {status: false, err: "O email já está cadastrado!"}

                    }
                }
            }

            if(name != undefined){
                editUser.name = name;
            }

            if(role != undefined){
                editUser.role = role;
            }

            try {
                await knex.update(editUser).where({id: id}).table("users");
                return {status: true};
                
            } catch (error) {
                return {status: false, err: error}

            }


        }else{
            return {status: false, err: "O usuário não existe!"}
        }

    }

    async delete(id){
        
        var user = await this.findById(id);

        if(user != undefined){

            try {
                await knex.delete().where({id: id}).table("users");
                return {status: true};

            } catch (error) {
                return {status: false, err: error};
            }

        }else{
            return {status: false, err: "O usuário não existe!"}
        }

    }


    async changePassword(newPassword, id, token){
        const hash = await bcrypt.hash(newPassword, 10);

        try {
            await knex.update({password: hash}).where({id: id}).table("users");
            await PasswordToken.setUsed(token);
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new Users();