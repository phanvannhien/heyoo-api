import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DuetLiveStreamEntityDocument } from "./entities/duet.entity";

@Injectable()
export class DuetService {
    constructor(
        @InjectModel('Duet') private readonly duetModel: Model<DuetLiveStreamEntityDocument>
    ){}

    async create( data ): Promise<DuetLiveStreamEntityDocument>{
        const duet = new this.duetModel(data);
        return await duet.save();
    }

    async getCurrentLiveStreamDuetPlayGame( liveStreamId: string ): Promise<DuetLiveStreamEntityDocument>{
        return await this.duetModel.findOne({ 
                    status: "ACCEPTED_DUET",
                    liveStream: liveStreamId
                })
                .sort({ _id: -1 }).limit(1)
    }

}