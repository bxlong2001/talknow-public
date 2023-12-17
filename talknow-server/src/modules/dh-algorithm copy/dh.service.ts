import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { DB_DH } from "../repository/db-collection";
import { Model } from "mongoose";
// import * as twilio from 'twilio';
import { DHDocument } from "./entities/dh.entity";

@Injectable()
export class DHService {
    constructor(
        @InjectModel(DB_DH)
        private readonly dhModel: Model<DHDocument>,
    ) { }

}