const express = require('express');
const multer = require('multer');
const path = require('path');
const member = require("../../models/member"); //데베 연결한 모델
const message = require("../../commonLib/message");
const { joinFormValidator } = require("../../middlewares/validators/join"); // 회원가입 양식 검증 미들웨어
const { loginFormValidator } = require("../../middlewares/validators/login"); // 로그인 양식 검증 미들웨어

const router = express.Router();

const upload = multer({
	storage : multer.diskStorage({
		destination : (req, file, done) => { // 파일을  저장할 디렉토리 
			done(null, "profiles/");
		},
		filename : (req, file, done) => { // 저장될 파일명
			// file -> 업로드된 파일 정보
			const ext = path.extname(file.originalname);
			const filename = path.basename(file.originalname, ext) + Date.now() + ext;
			done(null, filename);
		}
	}),
	limits : { fileSize : 10 * 1024 * 1024 }, // 최대 업로드 용량 10m
});



router.route("/join")
		/** 회원 가입 양식 */
		.get((req, res, next) => {
			const data = { pageTitle : "회원가입"};
			data.addScripts = ["/js/form.js", "/js/number.js"];
			data.addStyles = ["/css/form.css", "/css/number.css"];
			
			res.render("member/form", data );
		})
		/** 
			회원 가입 처리 
			1. 유효성 검사 -> 미들웨어
			2. member 모델 -> join 메서드
			3. req.file
		*/
		.post(upload.single('image'), joinFormValidator, async (req, res, next) => {
			try {
				// 회원 가입 처리 
				if (req.file) {
					req.body.filename = req.file.filename || {};
				}
				await member.join(req.body);
				
				// 가입 성공 -> 로그인 페이지로 이동 
				return res.send("<script>location.href='/member/login';</script>");
			} catch (err) {
				console.error(err);
				next(err); // 에러처리 미들웨어로 이동 
			}
		});

router.route("/login")
		/** 로그인 양식 출력 */
		.get((req, res, next) => {
			res.render("member/login", { pageTitle : "로그인<img src=/images/timer.png>" } );
		})
		/** 로그인 처리 */
		.post(loginFormValidator, async (req, res, next) => {
			try {
				const result = await member.login(req.body.memId, req.body.memPw, req);
				if (result) { // 로그인 성공
					return res.send("<script>location.href='/';</script>");
				} else { // 로그인 실패 
					throw new Error("로그인 실패!");
				}
				
			} catch (err) { // 로그인 실패 
				return message.alertBack(err.message, res);
			}
		});




module.exports = router;