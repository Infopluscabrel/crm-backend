import { validate } from "class-validator";
import { User } from "../entity/user";
import bcrypt from 'bcrypt';
import {
    createOrUpdateUser, deleteUser, getAllChild, getOneUserById,
    getOneUserByID, getOneUserByLoginOrEmail, getOneUserByLoginAndRole, getAllUser,
}
    from "../repository/userRepository";
import { emptyOrRows } from "../helper";
import { generateToken } from "../security/jwt.Utils";
require('dotenv').config();


export async function addUser(user: User) {
    let message = "user created successfully";
    let data;
    const errors = await validate(user)
    if (errors.length > 0) {
        message = "Error in creating user";
        throw new Error(`Validation failed! ` + errors);
    } else {
        let tmp = process.env.SALT_ROUNDS || 10;
        const saltRounds = +tmp;
        const salt = await bcrypt.genSalt(saltRounds);
        user.password = await bcrypt.hash(user.password, salt);
        const rows = createOrUpdateUser(user);
        data = emptyOrRows(rows);
    }
    return {
        data,
        message
    }
}

export async function UpdateUser(user: User) {
    let message = "user created successfully";
    let data;
    const errors = await validate(user)
    if (errors.length > 0) {
        message = "Error in creating user";
        throw new Error(`Validation failed! ` + errors);
    } else {
        const rows = createOrUpdateUser(user);
        data = emptyOrRows(rows);
    }
    return {
        data,
        message
    }
}

export async function findOneUser(user_id: number) {
    return getOneUserByID(user_id);
}

export async function findOneUserByLoginOrEmail(loginOrEmail: string) {
    return getOneUserByLoginOrEmail(loginOrEmail);
}

export async function findOneUserById(id: number) {
    return getOneUserById(id);
}

export async function findAllChild(page = 1, parrain: number) {
    return getAllChild(page, parrain);
}

export async function findAllUser(page = 1) {
    return getAllUser(page);
}

export async function deleteOneUser(id: number) {
    return deleteUser(id);
}

export async function login(login: string, password: string, niveau: number) {
    let status = 200;
    let userToken;
    let data: User = new User();
    await getOneUserByLoginAndRole(login, niveau)
        .then(async (value) => {
            if (value.length != 0) {
                if (value[0].password == null) {
                    return { message: "User must login with Web SSO ", status: 401 }
                }

                const isMatch = await bcrypt.compare(password, value[0].password);
                if (!isMatch) {
                    return {
                        message: "Invalid credentials",
                        status: 401
                    };
                }
                userToken = generateToken(value[0], 60 * 60);
                data = value[0];
                data.date_connexion = new Date();
                UpdateUser(data);
            } else {
                return {
                    message: "User don't exist:",
                    status: 404
                };
            }
        });

    return {
        status,
        data,
        userToken
    };
}

export async function refreshToken(loginOrEmail: string) {
    await getOneUserByLoginOrEmail(loginOrEmail)
        .then((value) => {
            if (value.length != 0) {
                return generateToken(value[0], 60 * 60 * 20);
            } else {
                return "User don't exist ";
            }
        });
}

export async function updatepassword(id: number, oldPassword: string, newPassword: string) {
    let message = "";
    await getOneUserByID(id).then(async (value) => {
        const isMatch = await bcrypt.compare(oldPassword, value[0].password)
        if (!isMatch) {
            message = 'Incorrect old password';
        } else {
            value.password = await bcrypt.hash(newPassword, 8);
            createOrUpdateUser(value[0]);
            message = "user password updated successfully";
        }
    })

    return { message };
}

// update umage profile 
export async function updateProfile(id: number, name: string) {
    let message = "user profile image updated successfully";
    let url = process.env.url || "http://localhost:5000";
    let link = url + "/uploads/" + name;
    getOneUserByID(id).then((value) => {
        value.image = link;
        createOrUpdateUser(value);
        return { message, link };
    })
    message = "Error when uploading image profile ";
    return { message };
}