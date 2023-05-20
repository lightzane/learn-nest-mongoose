# Learn Nest Mongoose

Learning how to connect to `MongoDB` using `NestJS`

## Create Nest Application

```
nest new <app_name>
```

If permission denied for **MacOS**:

```
sudo nest new <app_name>
```

If permission denied for modification of the directory:

Run command `ls -l` in Terminal, if **root** user is displayed, means it does not owned by the User. Then, run the following command:

```
sudo chown -R $USER .
```

The period (.) means it is the root directory

## Install NestJS Config

```
npm i @nestjs/config
```

## Import Config Module

`app.module.ts`

```ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
```

## Write Environment Variables

`.env`

```env
MONGO_CONNECTION=
```

## Install Mongoose

```
npm i @nestjs/mongoose mongoose
```

## Import Mongoose

`app.module.ts`

```ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGO_CONNECTION'),
      }),
    }),
  ],
})
export class AppModule {}
```

## Create REST Resource

```
npx nest g resource user
```

## Create Schema

`src/user/schemas/user.schema.ts`

```ts
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
```

The `expires: 10` - will let the document to be automatically deleted after 10 seconds when not used.

## Referring another schema class

```ts
import * as mongoose from 'mongoose';
import { Room } from '../room/schemas/room.schema';

@Schema()
export class User {
  // inside the class definition
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Room' })
  room: Room;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }] })
  rooms: Room[];
}
```

## Register the Schema

`user.module.ts`

```ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
})
export class UserModule {}
```

## Model Injection and Usage

`user.service.ts`

```ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    const userCreated = new this.userModel(createUserDto);
    return userCreated.save();
  }

  findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
```

## Multiple Databases

`app.module.ts`

```ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      connectionName: 'usersConnection', // Used for multiple databases
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGO_CONNECTION'),
      }),
    }),
    MongooseModule.forRootAsync({
      connectionName: 'roomsConnection', // Used for multiple databases
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('OTHER_CONNECTION'),
      }),
    }),
  ],
})
export class AppModule {}
```

`user.module.ts`

```ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: User.name,
          schema: UserSchema,
        },
      ],
      'usersConnection',
    ),
  ],
})
export class UserModule {}
```
