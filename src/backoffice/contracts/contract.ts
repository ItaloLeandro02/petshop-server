import { validate } from "@babel/types";

export interface Contract {
    errors: any[];
    validate(model: any): boolean;
}