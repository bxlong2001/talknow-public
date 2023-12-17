import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export const ReqUser = createParamDecorator((prop: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user;
    return prop ? user && user[prop] : user;
});
