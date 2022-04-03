import express from "express";
import AgreementController from './agreement';
const router: express.Router = express.Router();

router.use("/agreements", AgreementController);

export default router;

