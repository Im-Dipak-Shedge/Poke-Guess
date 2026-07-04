import api from "./axios";

export const createRoom = (data) => {

    return api.post("/rooms/create", data);
};

export const joinRoom = (roomCode, trainerName, trainerAvatar) => {
    return api.post("/rooms/join", {
        roomCode,
        trainerName,
        trainerAvatar,
    });
};

export const getRoom = (roomCode) => {
    return api.get(`/rooms/${roomCode}`);
};