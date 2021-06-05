import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import * as FacebookTokenStrategy from 'passport-facebook-token';
import { use } from 'passport';
import { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET } from '../app.constants'

@Injectable()
export class FacebookStrategy {
  constructor(
    private readonly userService: UsersService,
  ) {
    this.init();
  }
  init() {
    use(
      new FacebookTokenStrategy(
        {
          clientID: FACEBOOK_APP_ID,
          clientSecret: FACEBOOK_APP_SECRET,
          fbGraphVersion: 'v3.0',
        },
        async (
          accessToken: string,
          refreshToken: string,
          profile: any,
          done: any,

        ) => {
          if(!profile){  throw new BadRequestException('Fao;;;') }
          return done(null, profile);
        },
      ),
    );
  }
}