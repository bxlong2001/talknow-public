import { AccessibleFieldsDocument } from "@casl/mongoose";
import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiHideProperty } from "@nestjs/swagger";
import * as bcrypt from "bcryptjs";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDateString, IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";
import mongoose, { Document } from "mongoose";
import { DB_FRIEND_REQUEST, DB_USER } from "../../repository/db-collection";
import { FriendRequestDocument } from "./friend-request.entity";

@Schema({
    collection: DB_USER,
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
})
export class User{
    @IsString()
    @Prop({ required: true, unique: true, trim: true})
    soDienThoai: string;

    @IsString()
    @Prop({ trim: true})
    hoTen?: string;

    @IsString()
    @Prop({ required: true })
    role: string;

    @IsString()
    @ApiHideProperty()
    @Prop({ required: true })
    password: string;

    @IsDateString()
    @Prop({ type: Date })
    lastOnlineAt: Date;

    @IsBoolean()
    @Prop({ default: false })
    isOnline: boolean;

    @IsArray()
    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: DB_USER }])
    friendsId: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre("save", async function save() {
    if (this.isModified("password")) {
        const password = this.get("password");
        this.set("password", password ? await bcrypt.hash(password, 10) : undefined);
    }
});

UserSchema.methods.comparePassword = function comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.get("password"));
};

export interface UserDocument extends User, AccessibleFieldsDocument {
    comparePassword: (password: string) => Promise<boolean>;
}

