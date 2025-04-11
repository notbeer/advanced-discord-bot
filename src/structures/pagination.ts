import {
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder
} from "discord.js";
import { log } from "../utils/log";

export function buttonPagination(buttons: Array<ButtonBuilder>, page = 0, extraButtons: Array<ButtonBuilder> = []) {
    const chunkArray = (arr: Array<ButtonBuilder>, size: number) => {
        const result = [];
        for (let i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
        };
        return result;
    };
    
    const buttonChunks = chunkArray(buttons, 4);
    
    const totalPages = Math.ceil(buttonChunks.length / 3);
    const startIndex = page * 12;
    const paginatedChunks = buttonChunks.slice(startIndex / 4, (startIndex / 4) + 3);
    
    const actionRow = paginatedChunks.map(chunk => new ActionRowBuilder<ButtonBuilder>().setComponents(...chunk));

    const navButtons: Array<ButtonBuilder> = [];
    if(page > 0) navButtons.push(new ButtonBuilder()
        .setCustomId('previous')
        .setLabel('⬅️')
        .setStyle(ButtonStyle.Secondary)
    );
    extraButtons.length > 2 ? log.error('[Button Pagination] Cannot have more than 2 extra buttons.') : navButtons.push(...extraButtons);
    if(page < totalPages - 1) navButtons.push(new ButtonBuilder()
        .setCustomId('next')
        .setLabel('➡️')
        .setStyle(ButtonStyle.Secondary)
    );
    actionRow.push(new ActionRowBuilder<ButtonBuilder>().setComponents(...navButtons));

    return actionRow;
}