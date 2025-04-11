import {
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
    CommandInteraction,
    User,
    EmbedBuilder,
    InteractionResponse
} from "discord.js";

import i18n from "../../utils/i18n";

const acceptButton = new ButtonBuilder().setLabel('Accept').setCustomId('accept').setStyle(ButtonStyle.Success);
const rejectButton = new ButtonBuilder().setLabel('Reject').setCustomId('reject').setStyle(ButtonStyle.Danger);
const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(acceptButton, rejectButton);

export default function inviteUser(game: string, interaction: CommandInteraction, user: User): Promise<InteractionResponse<boolean> | false> {
    const invitation = new EmbedBuilder()
        .setColor('Aqua')
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ forceStatic: false }) })
        .setTitle(i18n.__mf("game.invitation.requestTitle"))
        .setDescription(i18n.__mf("game.invitation.requestDescription", { user: interaction.user.id, game }))
        .setTimestamp();

    return new Promise(async resolve => {
        const res = await interaction.reply({
            content: `<@${user.id}>`,
            embeds: [invitation],
            components: [buttons]
        }) as InteractionResponse;
        
        const collector = res.createMessageComponentCollector({
            time: 60000,
            filter: async (i) => {
                await i.deferUpdate().catch();
                return user.id === i.user.id;
            },
        });

        collector.on('collect', async (i) => {
            collector.stop(i.customId)
        });

        collector.on('end', async (_, reason) => {
            const rejectEmbed = new EmbedBuilder()
                .setColor('Red')
                .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ forceStatic: false }) })
                .setTimestamp();
            switch(reason) {
                case 'accept':
                    return resolve(res);
                case 'reject':
                    rejectEmbed
                        .setTitle(i18n.__mf("game.invitation.rejectTitle"))
                        .setDescription(i18n.__mf("game.invitation.rejectDescription", { user: interaction.user.id, game }));
                    res.edit({ content: `<@${interaction.user.id}>`, embeds: [rejectEmbed], components: [] });

                    return resolve(false);
                case 'time':
                    rejectEmbed
                        .setTitle(i18n.__mf("game.invitation.timeoutTitle"))
                        .setDescription(i18n.__mf("game.invitation.timeoutDescription", { user: interaction.user.id, game }));
                    res.edit({ content: `<@${interaction.user.id}>`, embeds: [rejectEmbed], components: [] });

                    return resolve(false);
            };
        });
    });
};