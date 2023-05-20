import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { HydratedDocument } from 'mongoose';

// export type UserDocument = HydratedDocument<User>;

@Schema({
  collection: 'user', // Customize collection name
})
export class User {
  @Prop()
  email: string;

  @Prop()
  name: string;

  @Prop([String])
  tags: string[];

  @Prop({ default: Date.now, expires: 10 })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
