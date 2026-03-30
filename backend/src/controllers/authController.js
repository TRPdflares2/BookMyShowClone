const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");
require("dotenv").config();
exports.getMe = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        });

        res.json({
            id: user.id,
            email: user.email,
            role: user.role
        });

    } catch (err) {

        res.status(500).json({
            message: "Failed to fetch user",
            error: err.message
        });

    }
}
exports.signup = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: "email or password not provided"
        });
    }
    try {
        const existinguser = await prisma.user.findUnique({
            where: { email }
        });
        if (existinguser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }
        const hashedpassword = await bcrypt.hash(password, 10);
        const newuser = await prisma.user.create({
            data: {
                email,
                password: hashedpassword
            }
        });
        res.json({
            message: "User created",
            userId: newuser.id
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Signup failed",
            error: err.message
        });
    }
};
exports.login = async (req, res) => {
    if (!req.body) {
    return res.status(400).json({
      message: "Request body missing"
    });
  }
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: "email or password not provided"
        });
    }
    try {
        const existinguser = await prisma.user.findUnique({
            where: { email }
        });
        if (!existinguser) {
            return res.status(400).json({
                message: "User does not exist"
            });
        }
        const validPassword = await bcrypt.compare(password, existinguser.password);

        if (!validPassword) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const token = jwt.sign(
          {
            id: existinguser.id,
            name: existinguser.name,
            email: existinguser.email,
            role: existinguser.role,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" },
        );
        res.json({ message: "logged in succesfully", token: token , email : existinguser.email});
    }
    catch (err) {
        res.status(500).json({
            message: "Signup failed",
            error: err.message
        });
    }
};