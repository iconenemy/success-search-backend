import { createParamDecorator, ExecutionContext } from '@nestjs/common';

type User = {
  id: string;
  email: string;
  roles: Array<string>;
};

type Data = keyof User;

export const User = createParamDecorator(
  (data: Data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : (user as User);
  },
);
