const checkGuess = (guess, guesses) => !guesses.find(g => g.x === guess.x && g.y === guess.y);


module.exports = checkGuess;