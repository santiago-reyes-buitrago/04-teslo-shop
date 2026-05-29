import { SetMetadata } from '@nestjs/common';
import {ValidRole} from "../enum/valid-role.enum";

export const ROLES_KEY = 'roles';

export const ValidateRole = (...roles: ValidRole[]) => SetMetadata(ROLES_KEY, roles);
