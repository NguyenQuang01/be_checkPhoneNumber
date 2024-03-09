const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

module.exports = {
    login: (req, res) => {
        const { phone, password } = req.body;
        userModel.getUsers(async (err, users) => {
            if (err) throw err;
            const user = users.find((user) => {
                return user.phone === phone;
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
                            phone: user.phone,
                        },
                        process.env.JWT_SECRET,
                        { expiresIn: "15s" }
                    );
                    const refreshToken = jwt.sign(
                        {
                            id: user.id,
                            phone: user.phone,
                        },
                        process.env.REFRESH_SECRET,
                        {
                            expiresIn: "30d",
                        }
                    );
                    res.json({
                        status: 200,
                        data: {
                            id: user.id,
                            phone: user.phone,
                            token: token,
                            refreshToken: refreshToken,
                        },
                    });
                } else {
                    res.json({
                        status: 400,
                        data: {
                            message: "Invalid phone or password",
                        },
                    });
                }
            } else {
                res.json({
                    status: 400,
                    data: {
                        message: "Invalid phone or password",
                    },
                });
            }
        });
    },
    addUser: (req, res) => {
        const { phone, password, fullName, email } = req.body;
        userModel.getUsers(async (err, users) => {
            if (err) throw err;

            const checkPhone = users.some((user) => user.phone !== phone);
            if (checkPhone) {
                const hashedPassword = await bcrypt.hash(password, 10);
                userModel.addUser(
                    {
                        phone: phone,
                        password: hashedPassword,
                        fullName: fullName,
                        email: email,
                    },
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
                        message: "Phone already exists",
                    },
                });
            }
        });
    },
    getUsers: (req, res) => {
        userModel.getUsers((err, users) => {
            if (err) throw err;
            res.json({
                status: 200,
                data: users,
            });
        });
    },
};
