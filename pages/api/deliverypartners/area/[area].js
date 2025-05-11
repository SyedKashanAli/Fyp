import mongoose from "mongoose";
import { NextResponse } from "next/server"
import dbConnect from "@/middleware/mongoose";
import DeliveryPartner from "@/models/DeliveryPartner";

export async function GET(request,content){
    let area=content.params.area
    let success=false;
    await mongoose.connect(dbConnect);
    let filter={area:{$regex:new RegExp(area,'i')}}
    const result = await DeliveryPartner.find(filter)
    return NextResponse.json({result})

}