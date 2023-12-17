import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsString } from "class-validator";
import { Document } from "mongoose";
import { DB_DH } from "src/modules/repository/db-collection";

@Schema({
    collection: DB_DH,
    timestamps: true,
})

export class DH {
    @IsString()
    @Prop()
    p: string;

    @IsString()
    @Prop()
    g: string;
}

export const DHSchema = SchemaFactory.createForClass(DH);
export type DHDocument = DH & Document;