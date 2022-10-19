const express = require('express');
const mysql = require('mysql2/promise');
const { auth, authCheck } = require("../../middlewares/auth");
const { dbConfig } = require("../../config");
const Joi = require("joi");

const router = express.Router();

const participantsAddSchema = Joi.object({
    name: Joi.string().required(),
    surname: Joi.string().required(),
    email: Joi.string().required(),
    age: Joi.number().required(),
    organizer_id: Joi.number().required(),
});

router.get('/:organizer_id', authCheck, async (req, res) => {
    const byOrganizer_id = req.params.organizer_id
    try {
        const con = await mysql.createConnection(dbConfig);
        const [response] = await con.query(`SELECT * FROM participants WHERE organizer_id = ${byOrganizer_id}`)
        con.end();
        res.send(response);
    } catch (error) {
        res.status(500).send({ error: error })
    }
});

router.post('/add', authCheck,async (req, res) => {
    let participantObj = req.body
    try {
        participantObj = await participantsAddSchema.validateAsync(participantObj);
    } catch (err) {
        res.status(400).send(err.details[0].message);
        return;
    }
    try {
        const con = await mysql.createConnection(dbConfig);
        const [response] = await con.query("INSERT INTO participants SET ?", [participantObj]);
        con.end();
        res.send(response);
    } catch (error) {
        res.status(500).send({ error: 'Something went wrong . . .' });
    };
});

router.delete("/:userId", authCheck, async (req, res) => {
    const userId = req.params.userId;
    try {
        const con = await mysql.createConnection(dbConfig);
        const [deleteUser] = await con.query("DELETE FROM users WHERE id = ?", [userId]);
        con.end();
        res.send(deleteUser)
    }catch(error) {
        res.status(500).send(error);
    }
});

router.patch("/update/:id", authCheck, async (req, res) => {
    const id = req.params.id;
    let user = req.body;
    console.log(user)
    try {
        const con = await mysql.createConnection(dbConfig);
        const [editUser] = await con.query("UPDATE users SET vardas = ?, pavarde = ?, pastas = ?, amzius = ? WHERE id = ?", [user.vardas, user.pavarde, user.pastas, user.amzius, id]);
        con.end();
        res.send(editUser)
    }catch(error) {
        res.status(500).send(error);
    }
});



module.exports = router;