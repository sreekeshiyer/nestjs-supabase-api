import {
    Controller,
    Get,
    Param,
    Req,
    HttpException,
    HttpStatus,
} from "@nestjs/common";
import { PostsService } from "./posts.service";
import { Request } from "express";
import { UsersService } from "src/users/users.service";

@Controller("posts")
export class PostsController {
    constructor(
        private readonly postsService: PostsService,
        private readonly usersService: UsersService
    ) {}

    @Get("/all")
    async findAll(@Req() request: Request) {
        if (await this.usersService.validateUser(request.cookies["jwt"])) {
            return await this.postsService.findAll();
        } else {
            throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
        }
    }

    @Get("/:id")
    async findOne(@Param("id") id: number, @Req() request: Request) {
        if (await this.usersService.validateUser(request.cookies["jwt"])) {
            return await this.postsService.findOne(id);
        } else {
            throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
        }
    }
}
