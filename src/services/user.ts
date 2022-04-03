import { getRepository } from "typeorm";
import { User } from "../entities";

async function getUsers(userIds: number[]): Promise<User[]> {
    const user: User[] = await getRepository(User).createQueryBuilder('user')
        .select(['user.userId AS "userId"', 'user.fullName AS "fullName"'])
        .where('user.userId IN (:...userIds)', { userIds }).getRawMany();

    return user;
}


export default { getUsers };