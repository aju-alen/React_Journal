import express from "express";
const router = express.Router()
import {sendContact} from '../controllers/rise-controller.js';


router.post('/send-contact',sendContact);


export default router;