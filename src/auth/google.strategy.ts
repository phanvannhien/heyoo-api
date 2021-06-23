import { Injectable } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { use } from 'passport';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../app.constants'

var GoogleTokenStrategy = require('passport-google-id-token');

@Injectable()
export class GoogleAuthStrategy {
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
          return done(googleId);
        },
      ),
    );
  }
}