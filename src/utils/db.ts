import { DB_UNIQUE_CONSTRAINT_ERR } from "../constants/error";
import logger from '../utils/logger';

export async function DBErrorHandling(error: any): Promise<string> {
    logger.error(error.message);
    if (error.message.includes(DB_UNIQUE_CONSTRAINT_ERR))
        return "No duplicate allowed. Record already exist.";
    else
        return error.message;
}