import http from "http";
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
  socket.on("join_room", (roomName) => {
    socket.join(roomName);
    socket.to(roomName).emit("welcome");
  });
  socket.on("offer", (offer, roomName) => {
    socket.to(roomName).emit("offer", offer);
  });
  socket.on("answer", (answer, roomName) => {
    socket.to(roomName).emit("answer", answer);
  });
  socket.on("ice", (ice, roomName) => {
    socket.to(roomName).emit("ice", ice);
  });
});

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);

/*
nodemon은 프로젝트를 살펴보고 변경사항이 있을시 서버를 재시작해주느 프로그램
서버를 재시작하는 대신에 babe-node를 실행하게 되는데 Babel은 우리가 작성한 코드를 일반 Node.JS코드로 컴파일 해준다
그 작업을 src/server.js 파일에 해주며
server.js 파일에서는 express를 import하고, express 어플리케이션을 구성하고, 1~3번째 줄
여기에 view engine을 Pug로 설정하고, views 디렉토리가 설정되며, 그리고 public 파일들에 대해서도 똑같은 작업을 해주고 있다. 5~7
public 파일들은 FrontEnd에서 구동되는 코드(중요) 왜 중요하냐면 여기 저기서 Js코드들을 다루다 보면 어떤게 FrontEnd고 어떤게 BackEnd인지 헷갈릴 수 있기에 주석을 담
그래서 이름은 app.js랑 server.js로 구분 server.js는 백엔드에서 구동될거고 app.js는 프론트엔드에서 구동된다
유저는 쉽게 서버 내 모든 폴더들을 들여다 볼 수 없다, 보안상 좋은일
지금 같은 경우에는 유저는 /public 으로 이동 할 시 public 폴더 내용을 볼 수 있다 7
홈페이지로 이동시 사용될 템플릿을 렌더해준다 8
views 폴더에 있는 home.pug를 렌더
express를 사용한 일반적인 NodeJS 설정임, packge.json, script 생성, babel 등등
babel-node를 실행시키면 babel-node는 바로 babel.config.json을 찾을테고 거기서 코드에 적용돼야 하는 preset을 실행시킨다.
*/
