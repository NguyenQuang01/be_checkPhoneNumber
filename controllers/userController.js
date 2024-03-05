const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

module.exports = {
    login: (req, res) => {
        console.log(process.env, "-----------1");
        const { username, password } = req.body;
        console.log("🚀 ~ username:", username, password);
        userModel.getUsers(async (err, users) => {
            if (err) throw err;
            const user = users.find((user) => {
                return user.username === username;
            });
            if (user) {
                const passwordMatch = await bcrypt.compare(
                    password,
                    user.password
                );
                if (passwordMatch) {
                    const token = jwt.sign(
                        {
                            id: user.id,
                            username: user.username,
                        },
                        process.env.JWT_SECRET
                    );
                    res.json({
                        status: 200,
                        data: {
                            id: user.id,
                            username: user.username,
                            token: token,
                        },
                    });
                } else {
                    res.json({
                        status: 400,
                        data: {
                            message: "Invalid username or password",
                        },
                    });
                }
            } else {
                res.json({
                    status: 400,
                    data: {
                        message: "Invalid username or password",
                    },
                });
            }
        });
    },
    addUser: (req, res) => {
        const { username, password } = req.body;
        userModel.getUsers(async (err, users) => {
            if (err) throw err;

            const checkUsername = users.some(
                (user) => user.username !== username
            );
            if (checkUsername) {
                const hashedPassword = await bcrypt.hash(password, 10);
                userModel.addUser(
                    { username: username, password: hashedPassword },
                    (err) => {
                        if (err) throw err;
                        res.json({
                            status: 200,
                            data: {
                                message: "successfully",
                            },
                        });
                    }
                );
            } else {
                res.json({
                    status: 400,
                    data: {
                        message: "Username already exists",
                    },
                });
            }
        });
    },
};
