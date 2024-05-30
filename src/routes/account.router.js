import express from "express";

//middlewares
import { prisma } from "../utils/prisma/index.js";
import authMiddlware from "../middlewares/auth.middlware.js";

import jwt from "jsonwebtoken";
import bcrypt, { compareSync } from "bcrypt";


const router = express.Router();

console.log("<===Applyed account.Router===>");

const AccessTokenKey = "first_token";
const RefreshTokenKey = "second_token";

//회원 가입 router====================
router.post("/set-in", async (req, res, next) => {
  const { email, password, name, age, gender, profilimage } = req.body;
  if (!email || !password || !name || !gender)
    return res.status(400).json({
      Message: "필수적인 정보를 입력해주세요!",
    });
  //같은 이메일이 있는지 확인
  const findemail = await prisma.users.findFirst({
    where: {
      email: email,
    },
  });

  if (findemail.email === email) {
    return res.status(403).json({
      Message: "이미 존재하는 계정입니다. --계정생성 불가능",
    });
  }

  //비밀번호 암호화
  const hashedpassword = await bcrypt.hash(password, 10); //비밀번호 암호화, 10번 복호화 과정을 거침    //비동기이기에 자기자신 참조 불가

  const user = await prisma.users.create({
    data: {
      email,
      password: hashedpassword,
    },
  });

  const info = await prisma.userinfos.create({
    data: {
      Userid: user.userid,
      name,
      age: +age,
      gender,
      profilimage,
    },
  });

  return res.status(200).json({ Message: "성공적으로 계정이 생성되었습니다!" });
});

//로그인 router====================
router.get("/log-in", async (req, res, next) => {
  const { email, password } = req.body;
  const user = await prisma.users.findFirst({
    where: {
      email: email,
    },
  });

  if (!user)
    return res
      .status(400)
      .json({ ErrorMessage: "해당 계정이 존재하지 않습니다" });

  if (!(await bcrypt.compare(password, user.password)))
    return res.status(400).json({ ErrorMessage: "비밀번호가 틀립니다." });

  const userinfo = await prisma.userinfos.findFirst({
    where: {
      Userid: user.userid,
    },
  });

  const token = jwt.sign(
    {
      userid: user.userid,
    },
    AccessTokenKey,
    { expiresIn: "15m" }
  );

  res.cookie("authorization", `Bearer ${token}`,{expiresIn:'15m'});

  return res.status(200).json({ Message: "성공적으로 로그인 되었습니다!" });

  //계정 정보 조회 router ====================
});

router.get("/myinfo",authMiddlware,(req, res, next) => {



    return res.status(200).json({Message:"코드 완료"});
});

export default router;