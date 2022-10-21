"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostResolver = exports.Post = void 0;
const client_1 = require("@prisma/client");
const type_graphql_1 = require("type-graphql");
const prisma = new client_1.PrismaClient();
let Post = class Post {
    constructor() {
        this.updatedAt = String;
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int)
], Post.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String)
], Post.prototype, "title", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => String)
], Post.prototype, "createdAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String)
], Post.prototype, "updatedAt", void 0);
Post = __decorate([
    (0, type_graphql_1.ObjectType)()
], Post);
exports.Post = Post;
let PostResolver = class PostResolver {
    posts() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.post.findMany();
        });
    }
    post(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.post.findUnique({
                where: {
                    id: id,
                },
            });
        });
    }
    createPost(title) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.post.create({
                data: {
                    title: title,
                },
            });
        });
    }
    updatePost(title, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.post.update({
                where: {
                    id: id,
                },
                data: {
                    title: title,
                },
            });
        });
    }
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.post.delete({
                where: {
                    id: id,
                },
            });
        });
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [Post])
], PostResolver.prototype, "posts", null);
__decorate([
    (0, type_graphql_1.Query)(() => Post, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int))
], PostResolver.prototype, "post", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Post),
    __param(0, (0, type_graphql_1.Arg)("title", () => String))
], PostResolver.prototype, "createPost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Post),
    __param(0, (0, type_graphql_1.Arg)("title", () => String)),
    __param(1, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int))
], PostResolver.prototype, "updatePost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Post),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int))
], PostResolver.prototype, "deletePost", null);
PostResolver = __decorate([
    (0, type_graphql_1.Resolver)(Post)
], PostResolver);
exports.PostResolver = PostResolver;
