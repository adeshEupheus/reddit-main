import { PrismaClient } from "@prisma/client";
import {
  ObjectType,
  Field,
  Int,
  Query,
  Resolver,
  Mutation,
  Arg,
  InputType,
  Ctx,
} from "type-graphql";

import argon2 from "argon2";
import { MyContext } from "../types";
import { v4 } from "uuid";
import { SendEmail } from "../utils/sendEmail";

const prisma = new PrismaClient();

// let d: new Date() = new Date();

@InputType()
class UserNameAndPasswordInput {
  @Field(() => String)
  userName: string;
  @Field(() => String)
  email: string;
  @Field(() => String)
  password: string;
}

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  userName: string;
  @Field(() => String)
  email: string;

  password: string;

  @Field(() => Date)
  createdAt: Date;

  // @Field(() => Date)
  // updatedAt = Date;
}

@ObjectType()
class FieldError {
  @Field(() => String)
  field: string;
  @Field(() => String)
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver(User)
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext) {
    if (!req.session.userId) {
      return null;
    }
    const user = await prisma.user.findUnique({
      where: {
        id: req.session.userId,
      },
    });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options", () => UserNameAndPasswordInput)
    options: UserNameAndPasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    let user;
    try {
      // checking for empty usename and password
      if (!options.password || !options.userName) {
        return {
          errors: [
            {
              field: "empty username and password",
              message: "please provide username and password",
            },
          ],
        };
      }
      const hashedPassword = await argon2.hash(options.password);
      user = await prisma.user.create({
        data: {
          userName: options.userName,
          email: options.email,
          password: hashedPassword,
        },
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        return {
          errors: [
            {
              field: "username",
              message: "username already exist",
            },
          ],
        };
      }
    }
    req.session.userId = user?.id;

    return {
      user,
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail", () => String) usernameOrEmail: string,
    @Arg("password", () => String) password: string,
    // options: UserNameAndPasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    let user;
    if (usernameOrEmail.includes("@")) {
      user = await prisma.user.findUnique({
        where: {
          email: usernameOrEmail,
        },
      });
    } else {
      user = await prisma.user.findUnique({
        where: {
          userName: usernameOrEmail,
        },
      });
    }

    // console.log(user);
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: `Invalid ${
              !usernameOrEmail.includes("@") ? "username" : "email"
            }`,
          },
        ],
      };
    }

    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "wrong password",
          },
        ],
      };
    }

    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    // req.session.destroy()
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie("qid");
        if (err) {
          console.log(err);

          return resolve(false);
        } else {
          resolve(true);
        }
      })
    );
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token", () => String) token: string,
    @Arg("newPassword", () => String) newPassword: string,
    @Ctx() { redis, req }: MyContext
  ) {
    try {
      const userId = await redis.get("forgot_password_" + token);
      console.log(userId);

      if (!userId) {
        return {
          errors: [
            {
              field: "token",
              message: "wrong token",
            },
          ],
        };
      }
      // console.log(userId);

      const user = await prisma.user.findUnique({
        where: {
          id: parseFloat(userId),
        },
      });

      if (!user) {
        return {
          errors: [
            {
              field: "user",
              message: "user no longer exist",
            },
          ],
        };
      }
      const hashedPassword = await argon2.hash(newPassword);
      const newUser = await prisma.user.update({
        where: {
          id: parseInt(userId),
        },
        data: {
          password: hashedPassword,
        },
      });
      console.log(newUser);

      // login user after change password
      req.session.userId = user.id;

      return {
        user: newUser,
      };
    } catch (error) {
      console.log(error);
    }
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email", () => String) email: string,
    @Ctx() { redis }: MyContext
  ) {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return true;
    }

    const token = v4();
    console.log(token);

    await redis.set(`forgot_password_${token}`, user.id);

    await SendEmail(
      email,
      `<a href="http://localhost:3000/change_password/${token}">Reset Password</a>`
      // "hello there"
    );
    return true;
  }
}
