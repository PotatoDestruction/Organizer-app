const express = require('express');
const mysql = require('mysql2/promise');
const Joi = require("joi");
const { authCheck } = require("../../middlewares/auth");
const { dbConfig } = require("../../config");

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
        console.log(err)
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

router.delete("/delete/:participant_id", authCheck, async (req, res) => {
    const participant_id = req.params.participant_id;
    try {
        const con = await mysql.createConnection(dbConfig);
        const [response] = await con.query("DELETE FROM participants WHERE id = ?", [participant_id]);
        con.end();
        res.send(response)
    }catch(error) {
        res.status(500).send(error);
    }
});

router.patch("/update/:id", authCheck, async (req, res) => {
    const id = req.params.id;
    const participant = req.body;
    console.log(participant)
    try {
        const con = await mysql.createConnection(dbConfig);
        const [response] = await con.query("UPDATE participants SET name = ?, surname = ?, email = ?, age = ? WHERE id = ?",
         [participant.name, participant.surname, participant.email, participant.age, id]);
        con.end();
        res.send(response)
    }catch(error) {
        res.status(500).send(error);
    }
});


module.exports = router;

