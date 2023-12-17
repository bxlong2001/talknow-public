import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { DB_FRIEND_REQUEST, DB_USER } from "src/modules/repository/db-collection";
import { EFriendRequest } from "../common/user.constant";

@Schema({
    collection: DB_FRIEND_REQUEST,
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
})
export class FriendRequest {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: DB_USER, required: true })
  senderId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: DB_USER, required: true })
  receiverId: string;

  @Prop({ enum: EFriendRequest, default: EFriendRequest.PENDING })
  status: string;
}

export type FriendRequestDocument = FriendRequest & Document;
export const FriendRequestSchema = SchemaFactory.createForClass(FriendRequest);
FriendRequestSchema.virtual("sender", {
  ref: DB_USER,
  localField: "senderId",
  foreignField: "_id",
  justOne: true,
})

FriendRequestSchema.virtual("receiver", {
  ref: DB_USER,
  localField: "receiverId",
  foreignField: "_id",
  justOne: true,
})
