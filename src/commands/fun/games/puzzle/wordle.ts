import {
    SlashCommandBuilder,
    AttachmentBuilder,
    TextChannel
} from 'discord.js';
import Canvas from 'canvas';

import { Words } from '../../../../constants/wordle';

import { Command } from '@types';

const cols = 5, rows = 6;
const cellSize = 80, padding = 10;
const canvasWidth = cols * (cellSize + padding) + padding, canvasHeight = rows * (cellSize + padding) + padding;
const border = '#818384', greenHex = '#538d4e', yellowHex = '#b59f3b', incorrectHex = '#3a3a3c';

function drawBoard(wordOfTheDay: string, guesses: Array<string>) {
    const canvas = Canvas.createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    ctx.font = 'bold 50px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for(let row = 0; row < rows; row++) {
        for(let col = 0; col < cols; col++) {
            const x = padding + col * (cellSize + padding);
            const y = padding + row * (cellSize + padding);

            // Default color (gray for incorrect letters)
            ctx.strokeStyle = border;
            ctx.fillStyle = 'transparent';

            if(row < guesses.length) {
                const guessedWord = guesses[row];
                const correctWord = wordOfTheDay;

                if(guessedWord[col] === correctWord[col]) { // Correct letter position
                    ctx.strokeStyle = greenHex;
                    ctx.fillStyle = greenHex;
                } else if(correctWord.includes(guessedWord[col])) { // Correct letter, but incorrect position
                    ctx.strokeStyle = yellowHex;
                    ctx.fillStyle = yellowHex;
                } else ctx.fillStyle = incorrectHex; // Incorrect
            };

            // Fill the square
            ctx.fillRect(x, y, cellSize, cellSize);

            // Draw border
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, cellSize, cellSize);

            // Draw the letter if a guess exists
            if(row < guesses.length) {
                ctx.fillStyle = 'white';
                ctx.fillText(guesses[row][col], x + cellSize / 2, y + cellSize / 2);
            };
        };
    };
    
    return new AttachmentBuilder(canvas.toBuffer(), {
        name: 'wordle.png'
    });
};

export const command: Command = {
    guildOnly: true,
    data: new SlashCommandBuilder()
        .setName('wordle')
        .setDescription('Find the word of the day'),
    async execute(client, interaction) {
        const wordOfTheDay = Words[Math.floor((Date.now() - new Date(2022, 0, 1).getTime()) / 1000 / 60 / 60 / 24)].toUpperCase();
        const guesses: Array<string> = [];
        
        await interaction.reply({ files: [drawBoard(wordOfTheDay, guesses)] });
        
        const collector = (interaction.channel as TextChannel).createMessageCollector({
            filter: (msg) => msg.author.id === interaction.user.id,
            time: 300000
        });
        collector.on('collect', async (msg) => {
            const guess = msg.content.toUpperCase();
            if(guess.length !== cols || !Words.includes(guess.toLowerCase())) return msg.reply('Make sure it is a 5-letter word that is valid.');

            guesses.push(guess);
            
            if(guess === wordOfTheDay) {
                msg.reply(`🎉 You have found the word of the day!`);
                collector.stop();
            };
            
            if(guesses.length === 6) {
                collector.stop();
                msg.reply(`You have ran out of chances. The word was ${wordOfTheDay}!`);
            };

            await interaction.editReply({ files: [drawBoard(wordOfTheDay, guesses)] });
        });
    }
};