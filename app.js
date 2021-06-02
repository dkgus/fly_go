const express = require('express');
const dotenv =require('dotenv');
const nunjucks = require('nunjucks');
const morgan = require('morgan');
const methodOverride =require('method-override');
const static = require('serve-static');

const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { sequelize } = require('./models');
const loginSession = require('./middlewares/member/login_session'); // 로그인 세션 처리 


//라우터
const mainRouter = require('./routes/main');
const memberRouter = require('./routes/member');


const app  = express();

dotenv.config();



app.set('port',process.env.PORT || 8008);

app.set('view engine', 'html');
nunjucks.configure('views', {
	express : app,
	watch : true,
});



sequelize.sync({ force : false })
		.then(() => {
			console.log("데이터베이스 연결 성공");
		})
		.catch((err) => {
			console.error(err);
		});



app.use(morgan('dev'));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public'))); //기본경로로 생략가능함


app.use(cookieParser(process.env.COOKIE_SECRET)); 

app.use(session({
	resave : false, 
	saveUninitialized : false,
	secret : process.env.COOKIE_SECRET,
	cookie : {
		httpOnly : true, 
		secure : false, 
	},
	name : "YHSESSID",
}));

app.use(loginSession()); // 로그인 세션 처리 



app.use(morgan('dev'));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public'))); //기본경로로 생략가능함


app.use(express.json());
app.use(express.urlencoded({ extended : false})); //post사용

// 라우터 등록
app.use("/main", mainRouter);
app.use("/member", memberRouter);


app.use((req, res, next) => {
	
	const error = new Error(`${req.method} ${req.url}은 없는 페이지 입니다.`);
	error.status = 404;
	next(error); 
});


app.use((err, req, res, next) => {
	
	res.locals.error = err;
	
	res.status(err.status || 500).render("error"); // error.html
});



app.listen(app.get('port'),()=>{
    console.log(app.get('port'), '번 포트에서 대기중');
});
