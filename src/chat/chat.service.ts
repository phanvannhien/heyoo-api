import { HttpService, Injectable } from "@nestjs/common";
import { User } from "src/users/interfaces/user.interface";
import { AxiosResponse } from 'axios'
import { Observable } from "rxjs";
import { UsersService } from "src/users/users.service";

interface IChatUser{
    user_id: string;
    nickname: string;
    profile_url: string;
    access_token: string;
}

@Injectable()
export class ChatService {
    constructor(
        private httpService: HttpService,
        private userService: UsersService,
    ){}

    async syncUserSendBirdUser(): Promise<any>{
        const allUser = await this.userService.find();
        return allUser.forEach( user => {
            this.createUserSendBird(user);
        })
    }
    
    async createUserSendBird( user: User ): Promise<AxiosResponse<IChatUser>>{
        const url = `${process.env.SEND_BIRD_API_URL}/users`;
        try{
            const response = await this.httpService.post(url, {
            
                "user_id": user.id,
                "nickname": user.fullname ,
                "profile_url": user.avatar ?? '',
                "issue_access_token": true,
                "issue_session_token": true,
                
            },{
                headers: {
                    'Content-Type': 'application/json; charset=utf8',
                    'Api-Token' : process.env.SEND_BIRD_API_TOKEN
                }
            }).toPromise();

            await this.userService.updateUser( user.id, {
                sendBirdToken: response.data['access_token']
            })

            return response;

        }catch(e){
            
        }
    }

    async updateUserSendBird( user: User ): Promise<any>{
        const url = `${process.env.SEND_BIRD_API_URL}/users/${user.id}`;
        try{
            const response = await this.httpService.post(url, {
                "nickname": user.fullname ,
                "profile_url": user.avatar
            },{
                headers: {
                    'Content-Type': 'application/json; charset=utf8',
                    'Api-Token' : process.env.SEND_BIRD_API_TOKEN
                }
            });
            return response;

        }catch(e){
           
        }
    }

}