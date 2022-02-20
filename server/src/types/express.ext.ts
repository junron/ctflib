import {User} from "../models/user";
import {response} from "express";
import {ValidationError} from "class-validator";
import {QueryError} from "mysql2";

declare global {
  namespace Express {
    export interface Request {
      auth: boolean;
      user?: User;
    }

    interface Response {
      success(message: string, data?: any): void;

      failure(message: string, field?: string): void;

      validationFailure(errors: ValidationError[]): void;

      handleDup(promise: Promise<any>, entity: string, field: string): Promise<boolean>;
      handleRefViolation(promise: Promise<any>, field: string): Promise<boolean>;
    }
  }
}

response.success = function (message: string, data?: any) {
  this.json({
    success: true,
    message,
    data
  });
};


response.failure = function (message: string, field?: string) {
  this.json({
    success: false,
    message,
    field
  });
};

response.validationFailure = function (errors: ValidationError[]) {
  this.json({
    success: false,
    errors: errors.map(error => {
      const constraint = error.constraints ?? {error: `${error.property} is invalid`};
      return {
        field: error.property,
        message: constraint[Object.keys(constraint)[0]]
      };
    }),
  });
};

response.handleDup = async function (promise: Promise<any>, entity: string, field: string): Promise<boolean> {
  try {
    await promise;
    return false;
  } catch (err) {
    const error = err as QueryError;
    if (error.code == 'ER_DUP_ENTRY') {
      this.failure(`A ${entity} with that ${field} already exists`, field);
      return true;
    }
    throw err;
  }
};

response.handleRefViolation = async function (promise: Promise<any>, field: string): Promise<boolean> {
  try {
    await promise;
    return false;
  } catch (err) {
    const error = err as QueryError;
    if (error.code == 'ER_NO_REFERENCED_ROW_2') {
      this.failure(`That ${field} does not exist`, field);
      return true;
    }
    throw err;
  }
};
