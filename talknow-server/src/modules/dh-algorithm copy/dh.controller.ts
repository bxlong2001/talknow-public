import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { DHService } from "./dh.service";

@Controller("dh")
@ApiTags("Diffie Hellman")
export class DHController {
    constructor(
        private readonly dhService: DHService,
    ) { }
}
