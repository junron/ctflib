import express from "express";
import {QueryError} from "mysql2";

export async function handleDup(promise: Promise<any>, res: express.Response, entity: string, field: string): Promise<boolean> {
  try {
    await promise;
    return false;
  } catch (err) {
    const error = err as QueryError;
    if(error.code == 'ER_DUP_ENTRY') {
      res.failure(`A ${entity} with that ${field} already exists`, field);
      return true;
    }
    throw err;
  }
}
