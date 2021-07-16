import { HttpService, Injectable } from "@nestjs/common";
import { User } from "src/users/interfaces/user.interface";
import { AxiosResponse } from 'axios'
import { Observable } from "rxjs";

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
    ){}
    
    async createUser( user: User ): Promise<AxiosResponse<IChatUser>>{
        const url = `${process.env.SEND_BIRD_API_URL}/users`;
        try{
            const response = await this.httpService.post(url, {
            
                "user_id": user.id,
                "nickname": user.fullname ,
                "profile_url": user.avatar,
                "issue_access_token": true,
                "issue_session_token": true,
                
            }).toPromise();

            return response;

        }catch(e){
            console.log(e.response.data);
        }
    }

    async updateUser( user: User ): Promise<any>{
        const url = `${process.env.SEND_BIRD_API_URL}/users/${user.id}`;
        try{
            const response = await this.httpService.post(url, {
                "nickname": user.fullname ,
                "profile_url": user.avatar
            });
            return response;

        }catch(e){
            console.log(e.response.data);
        }
    }

}