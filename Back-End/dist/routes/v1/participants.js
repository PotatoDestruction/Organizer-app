"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("../../middlewares/auth"));
const { dbConfig } = require("../../config");
const mysql = require('mysql2/promise');
const express = __importStar(require("express"));
const Joi = require("joi");
const router = express.Router();
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
router.get('/:organizer_id', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const byOrganizer_id = req.params.organizer_id;
    try {
        const con = yield mysql.createConnection(dbConfig);
        const [response] = yield con.query(`SELECT * FROM participants WHERE organizer_id = ${byOrganizer_id}`);
        con.end();
        res.send(response);
    }
    catch (error) {
        res.status(500).send({ error: error });
    }
}));
router.post('/add', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let participantObj = req.body;
    try {
        participantObj = yield participantsAddSchema.validateAsync(participantObj);
    }
    catch (err) {
        if (err) {
            res.status(400).send(err);
            return;
        }
    }
    try {
        const con = yield mysql.createConnection(dbConfig);
        const [response] = yield con.query("INSERT INTO participants SET ?", [participantObj]);
        con.end();
        res.send(response);
    }
    catch (error) {
        res.status(500).send({ error: 'Something went wrong . . .' });
    }
    ;
}));
router.delete("/delete/:participant_id", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const participant_id = Number(req.params.participant_id);
    try {
        const con = yield mysql.createConnection(dbConfig);
        const [response] = yield con.query("DELETE FROM participants WHERE id = ?", [participant_id]);
        con.end();
        res.send(response);
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
router.patch("/update/:id", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    let participant = req.body;
    console.log(participant);
    try {
        participant = yield participantsEditSchema.validateAsync(participant);
    }
    catch (err) {
        if (err) {
            res.status(400).send(err);
            return;
        }
    }
    try {
        const con = yield mysql.createConnection(dbConfig);
        const [response] = yield con.query("UPDATE participants SET name = ?, surname = ?, email = ?, age = ? WHERE id = ?", [participant.name, participant.surname, participant.email, participant.age, id]);
        con.end();
        res.send(response);
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
module.exports = router;
