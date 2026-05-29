import {applyDecorators, UseGuards} from '@nestjs/common';
import {ValidateRole} from "./validate-role.decorator";
import {AuthGuard} from "@nestjs/passport";
import {ValidateRoleGuard} from "../guards/validate-role.guard";
import {ValidRole} from "../enum/valid-role.enum";

export const Auth = (...roles: ValidRole[]) => applyDecorators(
    ValidateRole(...roles),
    UseGuards(AuthGuard(),ValidateRoleGuard)
);
