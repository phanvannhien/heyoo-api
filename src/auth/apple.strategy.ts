import { Injectable } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { use } from 'passport';
import { APPLE_CLIENT_ID } from '../app.constants'
import { AppleTokenStrategy } from "passport-apple-verify-token/lib/strategy";

@Injectable()
export class AppleStrategy {
  constructor(
    private readonly userService: UsersService,
  ) {
    this.init();
  }
  init() {
    use(
      new AppleTokenStrategy(
        {
          clientId: '123'
        },
        async (
          token: string,
          appleId: string,
          done: any,
        ) => {
          return done(null, appleId);
        },
      ),
    );
  }
}