import { SetMetadata } from '@nestjs/common';
//import { Role } from '../enums/role.enum';

export const Roles = (args: String[]) => SetMetadata('roles', args);