let clickAudio = new Audio("/sounds/click.ogg");
clickAudio.preload = "auto";
const sounds = {
    click: new Audio("/sounds/click.ogg"),
    correct: new Audio("/sounds/correct-guess.ogg"),
    "round-start": new Audio("/sounds/round-start.ogg"),
    "round-end": new Audio("/sounds/round-end.ogg"),
    winner: new Audio("/sounds/winner.ogg"),
    whosthatpokemon: new Audio("/sounds/whosthatpokemon.ogg"),
};

Object.values(sounds).forEach((audio) => {
    audio.preload = "auto";
});

export function playSound(name, volume = 1) {
    const audio = sounds[name];
    console.log(name);

    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    audio.volume = volume;
    audio.play().catch(() => { });
}


//button click 
export function playClick() {
    clickAudio.currentTime = 0;
    clickAudio.play().catch(() => { });
}
