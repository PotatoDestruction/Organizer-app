const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require('joi');
const { dbConfig, jwtSecret } = require('../../config');


const router = express.Router();

const organizerRegistationSchema = Joi.object({
    user_name: Joi.string().required(),
    password: Joi.string().required(),
    regTime: Joi.date().required()
});

const organizerLoginSchema = Joi.object({
    user_name: Joi.string().required(),
    password: Joi.string().required()
});



router.get('/:user_name', async (req, res) => {
    let checkIfAlreadyExists = req.params.user_name
    try {
        const con = await mysql.createConnection(dbConfig);
        const [response] = await con.query('SELECT id, user_name FROM organizers WHERE user_name = ?', [checkIfAlreadyExists]);
        con.end();
        res.send(response);
    }catch(err){
        console.log(err)
        res.status(500).send( { error: 'Something went wrong . . .' } )
    }
});

router.post('/register', async (req, res) => {
    let newOrganizer = req.body;

    try {
        newOrganizer = await organizerRegistationSchema.validateAsync(newOrganizer);
    } catch (err) {
        res.status(400).send(err.details[0].message);
        return;
    }

    try {
        const hashPassword = bcrypt.hashSync(newOrganizer.password);
        newOrganizer.password = hashPassword;

        const con = await mysql.createConnection(dbConfig);
        const [response] = await con.query('INSERT INTO organizers SET ?', [newOrganizer]);
        con.end();
        res.send(response);

    }catch(err){
        res.status(500).send( { error: 'Something went wrong' } );
    };
});

router.post('/login', async (req, res) => {
    let organizerLogin = req.body;

    try{
        organizerLogin = await organizerLoginSchema.validateAsync(organizerLogin);
    }catch(err){
        res.status(500).send(err.details[0].message);
        return;
    }


    try {
        
        const con = await mysql.createConnection(dbConfig);
        const [response] = await con.query('SELECT id, password, user_name FROM organizers WHERE user_name = ?', [organizerLogin.user_name]);

        con.end();

        if(!response.length) {
            return res.status(400).send({loginError: 'Invalid user name or password'});
        }

        const checkPassowrd = bcrypt.compareSync(organizerLogin.password, response[0].password);
        if(!checkPassowrd) {
            return res.status(400).send({loginError: 'Invalid user name or password'});
        }
        const token = jwt.sign({organizer_id: response[0].id}, jwtSecret);
        
        res.send( { token, organizer_id: response[0].id, user_name: organizerLogin.user_name } );
    }catch(err){
        res.status(500).send( { error: 'Something went wrong . . .' } );
    }
});



module.exports = router;