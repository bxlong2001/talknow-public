import { PageableDto } from "../../../common/dto/pageable.dto";
import { User } from "../entities/user.entity";

export class UserPageableDto extends PageableDto<User> {
    result: User[];
}
