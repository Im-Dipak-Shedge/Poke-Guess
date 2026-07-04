import api from "./axios";

export const createRoom = (data) => {

    return api.post("/rooms/create", data);
};

export const joinRoom = (roomId, playerName) => {
    return api.post("/rooms/join", {
        roomId,
        playerName,
    });
};

export const getRoom = (roomId) => {
    return api.get(`/rooms/${roomId}`);
};