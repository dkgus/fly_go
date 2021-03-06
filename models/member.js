const  bcrypt = require('bcrypt');
const { sequelize, Sequelize : { QueryTypes } } = require('./index');

/**
* 회원 관련 model
*
*/
const member = {
	/**
	* 회원 가입 처리 
	* 
	*  비밀번호 해시는 bcrypt 방식으로 생성
	*  
	* @param Object params : 가입데이터
	* @return Integer|Boolean 성공시 회원번호, 실패시 false /Integer는 여기서 회원번호를 말함
	*/
	join : async function(params) { // params는 들어오는 데이터를 말함
		try {
			const sql = `INSERT INTO fly_member (memId, memPw, memNm, mobile, profile) 
									VALUES (:memId, :memPw, :memNm, :mobile, :profile)`;
									
			const hash = await bcrypt.hash(params.memPw, 10);
			
			const replacements = {
				memId : params.memId,
				memPw : hash,
				memNm : params.memNm,
				mobile : params.mobile,
				profile : params.filename || "",
			};
			const result = await sequelize.query(sql, {
				replacements,
				type : QueryTypes.INSERT,
			});
			
			// result[0] -> primary auto_increment  - memNo
			
			return result[0]; // memNo 
		} catch (err) {
			console.error(err);
			return false;
		}
	},


	login : async function (memId, memPw, req) {
		try {
			const sql = "SELECT * FROM fly_member WHERE memId = ?";
			const rows = await sequelize.query(sql, {
				replacements : [memId],// memId = ?에 치환될 수 있는것이 replacements
				type : QueryTypes.SELECT,
			});
			if (rows && rows[0]) {
				const match = await bcrypt.compare(memPw, rows[0].memPw);//bcrypt.compare는 로그인시 사용자가 입력한 비밀번호의 해시값이 데베에 저장된 해시값과 같은지 비교하는 메소드
				//리턴은 불리언으로 비교해보고 해시값이 같으면 t 다르면 f리턴
				if (match) {
					// 로그인 세션 처리 	
					delete rows[0].memPw;
					req.session.member = rows[0];
					req.session.memNo = rows[0].memNo;
					
					return true;
				} else {
					return false;
				}
			}
		} catch (err) {
			console.error(err);
			return false;
		}
	},
	


    
};

module.exports = member;