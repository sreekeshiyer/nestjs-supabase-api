import { Injectable, UnauthorizedException } from "@nestjs/common";
import { getRepository } from "typeorm";
import { User } from "./user.entity";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UsersService {
    constructor(private jwtService: JwtService) {}

    // Validate User

    async validateUser(cookie) {
        if (cookie) {
            const data = await this.jwtService.verifyAsync(cookie);

            if (!data) {
                return false;
            }

            if (await this.findOneUser(data["id"])) {
                return true;
            }
        }

        return false;
    }

    createUser(data: any) {
        getRepository(User).save(data);
    }

    findAllUsers(): Promise<User[]> {
        return getRepository(User)
            .createQueryBuilder("users")
            .select(["users.id", "users.full_name", "users.email_id"])
            .orderBy("users.id", "ASC")
            .getMany();
    }

    findOneUser(id: number): Promise<User> {
        return getRepository(User)
            .createQueryBuilder("users")
            .select(["users.id", "users.full_name", "users.email_id"])
            .where("users.id = :id", { id: id })
            .getOne();
    }

    getUserByEmail(email: string): Promise<User> {
        return getRepository(User)
            .createQueryBuilder("users")
            .where("users.email_id = :email_id", { email_id: email })
            .getOne();
    }
}
