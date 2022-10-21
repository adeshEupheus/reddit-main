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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = exports.User = void 0;
const client_1 = require("@prisma/client");
const type_graphql_1 = require("type-graphql");
const argon2_1 = __importDefault(require("argon2"));
const uuid_1 = require("uuid");
const sendEmail_1 = require("../utils/sendEmail");
const prisma = new client_1.PrismaClient();
// let d: new Date() = new Date();
let UserNameAndPasswordInput = class UserNameAndPasswordInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => String)
], UserNameAndPasswordInput.prototype, "userName", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String)
], UserNameAndPasswordInput.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String)
], UserNameAndPasswordInput.prototype, "password", void 0);
UserNameAndPasswordInput = __decorate([
    (0, type_graphql_1.InputType)()
], UserNameAndPasswordInput);
let User = class User {
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int)
], User.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String)
], User.prototype, "userName", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String)
], User.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Date)
], User.prototype, "createdAt", void 0);
User = __decorate([
    (0, type_graphql_1.ObjectType)()
], User);
exports.User = User;
let FieldError = class FieldError {
};
__decorate([
    (0, type_graphql_1.Field)(() => String)
], FieldError.prototype, "field", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String)
], FieldError.prototype, "message", void 0);
FieldError = __decorate([
    (0, type_graphql_1.ObjectType)()
], FieldError);
let UserResponse = class UserResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [FieldError], { nullable: true })
], UserResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => User, { nullable: true })
], UserResponse.prototype, "user", void 0);
UserResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], UserResponse);
let UserResolver = class UserResolver {
    me({ req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.userId) {
                return null;
            }
            const user = yield prisma.user.findUnique({
                where: {
                    id: req.session.userId,
                },
            });
            return user;
        });
    }
    register(options, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const hashedPassword = yield argon2_1.default.hash(options.password);
                user = yield prisma.user.create({
                    data: {
                        userName: options.userName,
                        email: options.email,
                        password: hashedPassword,
                    },
                });
            }
            catch (error) {
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
            req.session.userId = user === null || user === void 0 ? void 0 : user.id;
            return {
                user,
            };
        });
    }
    login(usernameOrEmail, password, 
    // options: UserNameAndPasswordInput,
    { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            let user;
            if (usernameOrEmail.includes("@")) {
                user = yield prisma.user.findUnique({
                    where: {
                        email: usernameOrEmail,
                    },
                });
            }
            else {
                user = yield prisma.user.findUnique({
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
                            message: `Invalid ${!usernameOrEmail.includes("@") ? "username" : "email"}`,
                        },
                    ],
                };
            }
            const valid = yield argon2_1.default.verify(user.password, password);
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
        });
    }
    logout({ req, res }) {
        // req.session.destroy()
        return new Promise((resolve) => req.session.destroy((err) => {
            res.clearCookie("qid");
            if (err) {
                console.log(err);
                return resolve(false);
            }
            else {
                resolve(true);
            }
        }));
    }
    changePassword(token, newPassword, { redis, req }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = yield redis.get("forgot_password_" + token);
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
                const user = yield prisma.user.findUnique({
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
                const hashedPassword = yield argon2_1.default.hash(newPassword);
                const newUser = yield prisma.user.update({
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
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    forgotPassword(email, { redis }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma.user.findUnique({
                where: {
                    email: email,
                },
            });
            if (!user) {
                return true;
            }
            const token = (0, uuid_1.v4)();
            console.log(token);
            yield redis.set(`forgot_password_${token}`, user.id);
            yield (0, sendEmail_1.SendEmail)(email, `<a href="http://localhost:3000/change_password/${token}">Reset Password</a>`
            // "hello there"
            );
            return true;
        });
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => User, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)())
], UserResolver.prototype, "me", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("options", () => UserNameAndPasswordInput)),
    __param(1, (0, type_graphql_1.Ctx)())
], UserResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("usernameOrEmail", () => String)),
    __param(1, (0, type_graphql_1.Arg)("password", () => String)),
    __param(2, (0, type_graphql_1.Ctx)())
], UserResolver.prototype, "login", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Ctx)())
], UserResolver.prototype, "logout", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("token", () => String)),
    __param(1, (0, type_graphql_1.Arg)("newPassword", () => String)),
    __param(2, (0, type_graphql_1.Ctx)())
], UserResolver.prototype, "changePassword", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("email", () => String)),
    __param(1, (0, type_graphql_1.Ctx)())
], UserResolver.prototype, "forgotPassword", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)(User)
], UserResolver);
exports.UserResolver = UserResolver;
