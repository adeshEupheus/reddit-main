"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const core_1 = require("@mikro-orm/core");
let Post = class Post {
};
__decorate([
    (0, core_1.PrimaryKey)({ type: "number" })
], Post.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({ type: "date", onCreate: () => new Date() })
    // createdAt = new Date();
    ,
    (0, core_1.Property)({ type: "date", onUpdate: () => new Date() })
    // updatedAt = new Date();
    ,
    (0, core_1.Property)({ type: "string" })
], Post.prototype, "title", void 0);
Post = __decorate([
    (0, core_1.Entity)()
], Post);
exports.Post = Post;
