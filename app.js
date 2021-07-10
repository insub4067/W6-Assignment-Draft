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
  socket.on("ENTER_DETAIL_FROM_FRONT", (productId) => {
    socket.join(productId);

    // 상세 페이지 입장 시 해당 페이지 접속자들에게 접속자 수 보냄
    io.to(productId).emit(
      "ENTER_DETAIL_FROM_BACK",
      io.sockets.adapter.rooms.get(productId).size
    );

    // 댓글 작성하거나 삭제 시 프론트로 알려줌
    socket.on("COMMENT_CHANGED_FROM_FRONT", (productId) => {
      io.to(productId).emit("COMMENT_CHANGED_FROM_BACK");
    });

    // 상세 페이지 퇴장 시 해당 페이지 접속자들에게 접속자 수 보냄
    socket.on("disconnect", () => {
      if (io.sockets.adapter.rooms.get(productId)) {
        io.to(productId).emit(
          "ENTER_DETAIL_FROM_BACK",
          io.sockets.adapter.rooms.get(productId).size
        );
      }
    });
  });
});

app.use(
  "/",
  express.urlencoded({ extended: false }),
  express.json(),
  mainRouter
);

app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

app.use("/images", express.static("images"));

http.listen(8080, () => {
  console.log("서버가 요청을 받을 준비가 됐어요");
});
