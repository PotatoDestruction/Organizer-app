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
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const mysql = require('mysql2/promise');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { dbConfig, jwtSecret } = require('../../config');
const router = express.Router();
router.get('/:user_name', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let checkIfAlreadyExists = req.params.user_name;
    try {
        const con = yield mysql.createConnection(dbConfig);
        const [response] = yield con.query('SELECT id, user_name FROM organizers WHERE user_name = ?', [checkIfAlreadyExists]);
        con.end();
        res.send(response);
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ error: 'Something went wrong . . .' });
    }
}));
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let newOrganizer = req.body;
    try {
        const hashPassword = bcrypt.hashSync(newOrganizer.password);
        newOrganizer.password = hashPassword;
        const con = yield mysql.createConnection(dbConfig);
        const [response] = yield con.query('INSERT INTO organizers SET ?', [newOrganizer]);
        con.end();
        res.send(response);
    }
    catch (err) {
        res.status(500).send({ error: 'Something went wrong' });
    }
    ;
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let organizerLogin = req.body;
    try {
        const con = yield mysql.createConnection(dbConfig);
        const [response] = yield con.query('SELECT id, password, user_name FROM organizers WHERE user_name = ?', [organizerLogin.user_name]);
        con.end();
        if (!response.length) {
            return res.status(400).send({ loginError: 'Invalid user name or password' });
        }
        const checkPassowrd = bcrypt.compareSync(organizerLogin.password, response[0].password);
        if (!checkPassowrd) {
            return res.status(400).send({ loginError: 'Invalid user name or password' });
        }
        const token = jwt.sign({ organizer_id: response[0].id }, jwtSecret);
        res.send({ token, organizer_id: response[0].id, user_name: organizerLogin.user_name });
    }
    catch (err) {
        res.status(500).send({ error: 'Something went wrong . . .' });
    }
}));
module.exports = router;
