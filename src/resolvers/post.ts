import { Post } from "../entities/Post";
import { MyContext } from "../types";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { RequiredEntityData } from "@mikro-orm/core";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() ctx: MyContext) {
    return ctx.em.find(Post, {});
  }

  @Query(() => Post)
  post(@Arg("id", () => Int) _id: number, @Ctx() ctx: MyContext) {
    return ctx.em.findOne(Post, { _id });
  }

  @Mutation(() => Post, { nullable: true })
  async addPost(
    @Arg("title", () => String) title: string,
    @Ctx() ctx: MyContext
  ): Promise<Post | null> {
    const post = ctx.em.create(Post, { title } as RequiredEntityData<Post>);
    await ctx.em.persistAndFlush(post);
    if (!post) {
      return null;
    }
    return post;
  }

  @Mutation(() => Post, { nullable: true })
  async editPost(
    @Arg("id", () => Int) _id: number,
    @Arg("title", () => String, { nullable: true }) title: string,
    @Ctx() ctx: MyContext
  ): Promise<Post | null> {
    const post = await ctx.em.findOne(Post, { _id });
    if (!post) {
      return null;
    }

    if (typeof title !== "undefined") {
      post.title = title;
      await ctx.em.persistAndFlush(post);
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id", () => Int) _id: number,
    @Ctx() ctx: MyContext
  ): Promise<Boolean> {
    try {
      await ctx.em.nativeDelete(Post, { _id });
    } catch (error) {
      return false;
    }

    return true;
  }
}
