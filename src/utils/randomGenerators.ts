export const randomIdGenerator = () => {
    const letters = "0123456789abcdefghijklmnopqrstuvwxyz";
    let word = "";

    for (let i = 0; i < 12; i++) {
        word += letters[Math.floor(Math.random() * letters.length)];
    }

    return word;
};
