import {
    SlashCommandBuilder,
    AttachmentBuilder,
    EmbedBuilder,
    User
} from "discord.js";
import Canvas from "canvas";

import userRankSchema from "../../model/userRank";

import i18n from "../../utils/i18n";

import { Command } from "@types";

export const command: Command = {
    cooldown: '10s',
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Get users rank card')
        .addUserOption(option => option
            .setName('target')
            .setDescription('Get targets rank card')
        ),
    async execute(_, interaction) {
        const target = (interaction.options.getUser('target')) as User || interaction.user;
        if(target.bot) return interaction.reply({ content: i18n.__("rank.userIsBot"), flags: ['Ephemeral'] });

        const guildRank = await userRankSchema.findOne({ guildId: interaction.guildId });
        if(!guildRank) return interaction.reply({ content: i18n.__("rank.userNoMessage"), flags: ['Ephemeral'] });

        const userRank = guildRank.ranks.find(v => v.userId === target.id);
        if(!userRank) return interaction.reply({ content: i18n.__("rank.userNoMessage"), flags: ['Ephemeral'] });

        const canvas = Canvas.createCanvas(850, 350);
        const ctx = canvas.getContext("2d");

        //! background with image
        const background = await Canvas.loadImage("./src/assets/rank/card.jpeg");
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        //! background with gradient
        // const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        // gradient.addColorStop(0, '#FF7F50'); // Orange at the top
        // gradient.addColorStop(1, '#FFD700'); // Yellow at the bottom
        // ctx.fillStyle = gradient;
        // ctx.fillRect(0, 0, canvas.width, canvas.height);

        const accent = '#42f560';

        //! Profile border
        const centerX = 95;
        const centerY = 85;
        const radius = 68;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        ctx.strokeStyle = accent;
        ctx.lineWidth = 5;
        ctx.stroke();

        //! Draw full progress bar
        const barX = 200;
        const barY = 215;
        ctx.beginPath();
        ctx.fillStyle = 'gray';
        ctx.globalAlpha = 0.55;
        ctx.roundRect(barX, barY, 600, 60, 15);
        ctx.fill();
        ctx.globalAlpha = 1;

        //! progress calculation
        const xp = userRank.xp;
        const nextLevelXp = Math.floor(100 * Math.pow(1.1, userRank.level) * Math.log(userRank.level + 1));
        const progress = xp / nextLevelXp;
        let progressWidth = 600 * progress;
        
        //! Draw progress bar
        if(progressWidth !== 0) {
            if(progressWidth < 10) progressWidth = 12;
            ctx.beginPath();
            ctx.fillStyle = '#fff';
            if(progress < 1) {
                ctx.moveTo(barX, barY + 15); // Start from top-left with radius
                ctx.arcTo(barX, barY, barX + 15, barY, 15); // Top-left corner (rounded)
                ctx.lineTo(barX + progressWidth, barY); // Top-right (no rounding)
                ctx.lineTo(barX + progressWidth, barY + 60); // Bottom-right
                ctx.lineTo(barX + 15, barY + 60); // Bottom-left
                ctx.arcTo(barX, barY + 60, barX, barY + 60 - 15, 15); // Bottom-left corner (rounded)
            } else ctx.roundRect(barX, barY, 600 * progress, 60, 15);
            ctx.closePath();
            ctx.fill();
        };

        const shadowColor = (ctx: Canvas.CanvasRenderingContext2D) => {
            ctx.shadowColor = "rgba(0, 0, 0, 1)"; // Shadow color
            ctx.shadowBlur = 5; // Blur level
            ctx.shadowOffsetX = 3; // Horizontal shadow offset
            ctx.shadowOffsetY = 3; // Vertical shadow offset
        };

        const fontStyle = 'Comic Sans MS';

        //! Username
        ctx.font = `bold 30px ${fontStyle}`;
        ctx.fillStyle = '#fff';
        ctx.textAlign = "left";
        shadowColor(ctx);
        ctx.fillText(target.username, barX + 5, barY - 10);

        //! XP
        ctx.font = `bold 25px ${fontStyle}`;
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "right";
        shadowColor(ctx);
        ctx.fillText(`${xp} / ${nextLevelXp} XP`, barX + 595, barY - 10);

        //! Level number
        ctx.font = `bold 35px ${fontStyle}`;
        ctx.fillStyle = accent;
        ctx.textAlign = "right";
        shadowColor(ctx);
        const levelNumber = `${userRank.level}`;
        const levelNumberW = ctx.measureText(levelNumber).width;
        ctx.fillText(levelNumber, barX + 595, 65);
        // Word "Level"
        ctx.font = "bold 25px Arial"; 
        ctx.fillStyle = "white";
        ctx.fillText("Level", barX + 585 - levelNumberW, 67);

        //! Rank number
        const sortedRanks = guildRank.ranks.sort((a, b) => {
            if(b.level !== a.level) return b.level - a.level; // Sort by level first (descending)
            return b.xp - a.xp; // If levels are equal, sort by xp (descending)
        });

        // Find the user's rank position (index + 1 because rank is 1-based)
        const userRankIndex = sortedRanks.findIndex(v => v.userId === target.id);
        ctx.font = `bold 35px ${fontStyle}`;
        ctx.fillStyle = accent;
        ctx.textAlign = "right";
        shadowColor(ctx);
        const rankNumber = `#${userRankIndex + 1}`;
        const rankNumberW = ctx.measureText(rankNumber).width;
        ctx.fillText(rankNumber, barX + 505 - levelNumberW, 65);
        // Word "Rank"
        ctx.font = "bold 25px Arial"; 
        ctx.fillStyle = "white";
        shadowColor(ctx);
        ctx.fillText("Rank", barX + 493 - (rankNumberW + levelNumberW), 67);

        //! avatar
        ctx.arc(centerX, centerY, 60, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.clip();
        
        //! draw avatar
        const avatar = await Canvas.loadImage(target.displayAvatarURL({ extension: 'png', size: 4096 }));
        ctx.drawImage(avatar, 35, 25, 120, 120); //25, 25, 150, 150

        const rankcardEmbed = new EmbedBuilder()
            .setColor(accent)
            .setImage("attachment://rankcard.png")
            .setTimestamp();
        interaction.reply({ embeds: [rankcardEmbed], files: [new AttachmentBuilder(canvas.toBuffer(), { name: "rankcard.png", description: 'Example rank card' })] });
    }
};