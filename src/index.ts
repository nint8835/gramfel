export interface Env {
    DISCORD_WEBHOOK: string;
    OK_WEBHOOK_URL: string;
    GRASS_TOUCHING_WEBHOOK: string;
}

type Channel = 'general' | 'ok' | 'grass-touching';

interface Message {
    content: string;
    channel: Channel;
}

type MessageGenerator = () => Message;

const responses: Record<string, MessageGenerator> = {
    '0 17 * * *': () => ({
        content: '<:harrhy:569924236353994782>',
        channel: 'general',
    }),
    '30 1 * * *': () => ({
        content: 'Go to bed <@335923137558347776> <@163488287951028227> <@489123999889227776>',
        channel: 'general',
    }),
    '0 14 * * 2': () => ({
        content:
            'Set a new goal for this week. You are legally obligated to disclose whether you completed last weeks goal, and chat is permitted to shade you if the goal was not achieved.\n<@224890702218133505> <@742187091475169300> <@480415224164253707> <@163488287951028227>',
        channel: 'ok',
    }),
    '15 18 * * *': () => ({
        content: 'Grass touching <@489123999889227776>',
        channel: 'grass-touching',
    }),
};

export default {
    async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
        const message = responses[controller.cron]();

        const channelToWebhook: Record<Channel, string> = {
            general: env.DISCORD_WEBHOOK,
            ok: env.OK_WEBHOOK_URL,
            'grass-touching': env.GRASS_TOUCHING_WEBHOOK,
        };

        const webhookUrl = channelToWebhook[message.channel];

        if (!webhookUrl) {
            throw new Error(`No webhook URL found for channel: ${message.channel}`);
        }

        console.log(`Sending message to ${message.channel} channel: ${message.content}`);

        const resp = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: message.content,
            }),
        });

        if (!resp.ok) {
            console.error(`Error sending message: ${resp.status} ${resp.statusText}`);
            throw new Error(`Failed to send message: ${resp.status} ${resp.statusText}`);
        }
    },
};
