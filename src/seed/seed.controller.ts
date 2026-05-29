import {Controller, Get} from '@nestjs/common';
import {SeedService} from "./seed.service";
import {Auth} from "../auth/decorators";
import {ValidRole} from "../auth/enum/valid-role.enum";

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {
  }

  @Get()
  @Auth(ValidRole.ADMIN)
  execute() {
    return this.seedService.runSeed();
  }
}
