import { Module } from "@nestjs/common";
import { DHController } from "./dh.controller";
import { DHService } from "./dh.service";
@Module({
  controllers: [DHController],
  providers: [DHService],
  exports: [DHService]
})
export class DHModule { }