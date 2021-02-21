import { Injectable } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { use } from 'passport';
import { GOOGLE_CLIENT_ID } from '../../app.constants'
import { GoogleTokenStrategy } from "passport-google-verify-token/lib/strategy";


@Injectable()
export class GoogleVerifyTokenStrategy {
  constructor(
    private readonly userService: UsersService,
  ) {
    this.init();
  }
  init() {
    use(
      new GoogleTokenStrategy(
        {
          clientID: GOOGLE_CLIENT_ID
        },
        function (parsedToken, googleId, done){
          console.log(parsedToken);
          console.log(googleId);
          return done(googleId);
        },
      ),
    );
  }
}