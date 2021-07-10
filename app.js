const express = require("express");
const connect = require("./config");
const mainRouter = require("./routers/index");
const Http = require("http");
const socketIo = require("socket.io");

const app = express();
const http = Http.createServer(app);
const io = socketIo(http);

io.on("connect", (socket) => {
  // 좋아요 관련 이벤트
  socket.on("HEART_UPDATED_FROM_FRONT", (data) => {
    socket.emit("HEART_UPDATED_FROM_BACK", data);
  });

  // 상세 페이지 관련 이벤트
  socket.on("WATCHING_DETAIL_FROM_FRONT", (productId) => {
    socket.join(productId);

    io.to(productId).emit("WATCHING_DETAIL_FROM_BACK", productId);

    socket.on("COMMENT_CHANGED_FROM_FRONT", () => {});
  });
});

app.use(
  "/",
  express.urlencoded({ extended: false }),
  express.json(),
  mainRouter
);

http.listen(8080, () => {
  console.log("서버가 요청을 받을 준비가 됐어요");
});
