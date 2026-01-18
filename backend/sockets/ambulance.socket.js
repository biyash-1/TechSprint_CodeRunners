module.exports = (socket, io) => {

  socket.on("join-ambulance-zone", ({ zoneId }) => {
    socket.join(`zone-${zoneId}`);
    console.log(`Ambulance joined zone-${zoneId}`);
  });

  socket.on("accept-accident", ({ accidentId }) => {
    io.emit("accident-accepted", {
      accidentId,
      driverId: socket.user.id
    });
  });

};
