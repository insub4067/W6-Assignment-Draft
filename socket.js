const http = require("./app");
const socketIo = require("socket.io");
const io = socketIo(http);

function initSocket(socket) {
  function enterRoom(productId) {
    socket.join(productId);
  }

  function toRoomMembers(productId, event, data) {
    io.to(productId).emit(event, data);
  }

  function getRoom(productId) {
    return io.sockets.adapter.rooms.get(productId);
  }

  return {
    watchHeartUpdate: () => {
      socket.on("HEART_UPDATED_FROM_FRONT", (data) => {
        socket.emit("HEART_UPDATED_FROM_BACK", data);
      });
    },
    watchEnterDetail: () => {
      socket.on("ENTER_DETAIL_FROM_FRONT", (productId) => {
        enterRoom(productId);

        //// 상세 페이지 입장 시 해당 페이지 접속자들에게 접속자 수 보냄
        toRoomMembers(
          productId,
          "ENTER_DETAIL_FROM_BACK",
          getRoom(productId).size
        );

        //// 댓글 작성하거나 삭제 시 프론트로 알려줌
        socket.on("COMMENT_CHANGED_FROM_FRONT", (productId) => {
          toRoomMembers(productId, "COMMENT_CHANGED_FROM_BACK");
        });

        //// 상세 페이지 퇴장 시 해당 페이지 접속자들에게 접속자 수 보냄
        socket.on("disconnect", () => {
          if (getRoom(productId)) {
            toRoomMembers(
              productId,
              "ENTER_DETAIL_FROM_BACK",
              getRoom(productId).size
            );
          }
        });
      });
    },
  };
}

io.on("connect", (socket) => {
  const { watchHeartUpdate, watchEnterDetail } = initSocket(socket);

  watchHeartUpdate();
  watchEnterDetail();
});
