import authCheck from '../../middlewares/auth';
const { dbConfig } = require("../../config");
const mysql = require('mysql2/promise');
import * as express from "express";
import { error } from 'console';
const Joi = require("joi");

const router = express.Router();

interface ParticipantAdd {
    name: string
    surname: string
    email: string
    age: number
    organizer_id: number
}

interface EditParticipant {
    name: string
    surname: string
    email: string
    age: number
}

const participantsAddSchema = Joi.object({
    name: Joi.string().required(),
    surname: Joi.string().required(),
    email: Joi.string().required(),
    age: Joi.number().required(),
    organizer_id: Joi.number().required(),
});

const participantsEditSchema = Joi.object({
    name: Joi.string().required(),
    surname: Joi.string().required(),
    email: Joi.string().required(),
    age: Joi.number().required(),
});


router.get('/:organizer_id', authCheck, async (req: any, res: any) => {
    const byOrganizer_id: number = req.params.organizer_id;
    try {
        const con = await mysql.createConnection(dbConfig);
        const [response] = await con.query(`SELECT * FROM participants WHERE organizer_id = ${byOrganizer_id}`)
        con.end();
        res.send(response);
    } catch (error) {
        res.status(500).send({ error: error })
    }
});

router.post('/add', authCheck, async (req, res) => {
    let participantObj: ParticipantAdd = req.body
    try {
        participantObj = await participantsAddSchema.validateAsync(participantObj);
    } catch (err) {
        if (err) {
            res.status(400).send(err);
            return;
        }

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
    const participant_id: number = Number(req.params.participant_id);
    try {
        const con = await mysql.createConnection(dbConfig);
        const [response] = await con.query("DELETE FROM participants WHERE id = ?", [participant_id]);
        con.end();
        res.send(response)
    } catch (error) {
        res.status(500).send(error);
    }
});

router.patch("/update/:id", authCheck, async (req: any, res: any) => {
    const id: number = Number(req.params.id);
    let participant: EditParticipant = req.body;
    console.log(participant)

    try {
        participant = await participantsEditSchema.validateAsync(participant);
    } catch (err) {
        if (err) {
            res.status(400).send(err);
            return;
        }
    }
    try {
        const con = await mysql.createConnection(dbConfig);
        const [response] = await con.query("UPDATE participants SET name = ?, surname = ?, email = ?, age = ? WHERE id = ?",
            [participant.name, participant.surname, participant.email, participant.age, id]);
        con.end();
        res.send(response)
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;