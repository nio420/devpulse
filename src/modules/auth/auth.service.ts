import type { Sign } from "node:crypto";
import config from "../../config";
import { pool } from "../../db";
import type { loginUser, SignUpUser } from "./auth.interface";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const signUpUserDB = async (payload: SignUpUser) => {
    const { name, email, password, role } = payload;

    const userData = await pool.query(`
        SELECT * FROM users WHERE email = $1;
        ` , [email]);
        
        if(userData.rows.length > 0) {
            throw new Error("User already exists");
        }

        const roleValue = role || "contributor";
        const HashdPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(`INSERT INTO users (name, email, password, role) VALUES($1, $2, $3, $4) RETURNING *`, [name, email, HashdPassword, roleValue])
        const user = result.rows[0];
        delete user.password
        return user;
}

const loginUserDB = async (payload: loginUser) => {
    const { email, password } = payload;
    const userData = await pool.query(`
        SELECT * FROM users WHERE email = $1;
    `, [email]);

    if(userData.rows.length === 0) {
        throw new Error("User not found");
    }
    const user = userData.rows[0];
    const MatchedPassword = await bcrypt.compare(password, user.password)
    if(!MatchedPassword){
        throw new Error("Invalid Credentials!");
    }
    delete user.password;
    const jwtPayload = {id: user.id, email: user.email, role: user.role}
    const token = jwt.sign(jwtPayload, config.jwtSecretKey, {expiresIn: "20d"});
    return {token, user};
}

export const authService = {
    signUpUserDB, loginUserDB
}