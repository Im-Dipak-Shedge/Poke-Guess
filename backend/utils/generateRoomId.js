export default function generateRoomId() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let roomId = "";

    for (let i = 0; i < 6; i++) {
        roomId += chars[Math.floor(Math.random() * chars.length)];
    }

    return roomId;
}