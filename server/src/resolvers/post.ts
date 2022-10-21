import { PrismaClient } from "@prisma/client";
import {
  ObjectType,
  Field,
  Int,
  Query,
  Resolver,
  Mutation,
  Arg,
} from "type-graphql";

const prisma = new PrismaClient();

@ObjectType()
export class Post {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  title: string;

  @Field((type) => String)
  createdAt: string;

  @Field(() => String)
  updatedAt = String;
}

@Resolver(Post)
export class PostResolver {
  @Query(() => [Post])
  async posts() {
    return await prisma.post.findMany();
  }
  @Query(() => Post, { nullable: true })
  async post(@Arg("id", () => Int) id: number) {
    return await prisma.post.findUnique({
      where: {
        id: id,
      },
    });
  }
  @Mutation(() => Post)
  async createPost(@Arg("title", () => String) title: string) {
    return await prisma.post.create({
      data: {
        title: title,
      },
    });
  }

  @Mutation(() => Post)
  async updatePost(
    @Arg("title", () => String) title: string,
    @Arg("id", () => Int) id: number
  ) {
    return await prisma.post.update({
      where: {
        id: id,
      },
      data: {
        title: title,
      },
    });
  }

  @Mutation(() => Post)
  async deletePost(@Arg("id", () => Int) id: number) {
    return await prisma.post.delete({
      where: {
        id: id,
      },
    });
  }
}
