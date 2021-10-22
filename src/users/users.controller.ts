import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    Post,
    Req,
    Res,
    HttpException,
    HttpStatus,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { Request, Response } from "express";

@Controller("users")
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private jwtService: JwtService
    ) {}

    // Register User

    @Post("/register")
    async register(
        @Body("full_name") full_name: string,
        @Body("email_id") email_id: string,
        @Body("password") password: string
    ) {
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = {
            full_name: full_name,
            email_id: email_id,
            password: hashedPassword,
        };

        this.usersService.createUser(user);

        return {
            full_name,
            email_id,
        };
    }

    // Login

    @Post("/login")
    async login(
        @Body("email_id") email_id: string,
        @Body("password") password: string,
        @Res({ passthrough: true }) response: Response
    ) {
        const user = await this.usersService.getUserByEmail(email_id);

        if (!user || !bcrypt.compare(password, user.password)) {
            return new BadRequestException("Invalid Credentials");
        }

        const jwt = await this.jwtService.signAsync({
            id: user.id,
        });

        response.cookie("jwt", jwt, { httpOnly: true });

        return "Signed In";
    }

    @Get("/all")
    async findAllUsers(@Req() request: Request) {
        if (await this.usersService.validateUser(request.cookies["jwt"])) {
            console.log("user valid");
            return await this.usersService.findAllUsers();
        } else {
            throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
        }
    }

    @Post("/logout")
    async logout(@Res({ passthrough: true }) response: Response) {
        response.clearCookie("jwt");

        return {
            message: "Signed Out",
        };
    }

    @Get("/:id")
    async findOneUser(@Param("id") id: number) {
        if (!isNaN(id)) {
            return await this.usersService.findOneUser(id);
        }
    }
}
