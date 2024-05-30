import express from "express";

//middlewares
import { prisma } from "../utils/prisma/index.js";
import authMiddlware from "../middlewares/auth.middlware.js";


//이력서 지원 router
const router=express.Router();

router.post("/resume/apply",authMiddlware,async(req,res,next)=>{
    const {content}=req.body;

    const userid=req.user.userid;

    //이력서를 만들기 위해 회원의 필요한 정보만 불러오기
    const userinfo=await prisma.userinfos.findFirst({
        where: {
            Userid:+userid
        },
        select: {
            name:true,
            age:true,
        }
    });

    const createcontent=await prisma.resume.create({
        data: {
            name:userinfo.name,
            age:+userinfo.age,
            Userid:+userid,
            content,
            
        }
    });

    return res.status(200).json({Message:"이력서 지원이 완료되었습니다."});
});

//회원의 이력서 상세조회
router.get("/resume/:resumeid",authMiddlware,async(req,res,next)=>{
    const resumeid=req.params.resumeid;
    const userid=await req.user.userid;

    const resume=await prisma.resume.findFirst({
        where:{
            resumeid:+resumeid,
            Userid:+userid
        },select: {
            name:true,
            age:true,
            content:true,
            createdAt:true,
            updatedAt:true,
        }
    })
    if (!resume) return res.status(404).json({ErrorMessage:"존재하지 않거나 권한이 없습니다!"});
    console.log(resume);
    return res.status(200).json({resume});
});

//회원의 이력서 수정
router.put("/resume/:resumeid",authMiddlware,async(req,res,next)=>{
    const resumeid=req.params.resumeid;
    const userid=req.uesr.userid;



    const resume=await prisma.resume.findFirst({
        where:{
            resumeid:+resumeid,
            Userid:+userid
        },select: {
            content:true,
            createdAt:true,
            updatedAt:true,
        }
    })
    
    return res.status(200).json({Message:"코드 검증 완료"});
});

//관리자 이력서 수정


export default router;