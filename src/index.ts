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
};

function is11PMStJohns(): boolean {
    return new Date()
        .toLocaleString('en-US', {
            hour: 'numeric',
            hour12: false,
            timeZone: 'America/St_Johns',
        })
        .startsWith('23');
}

export default {
    async scheduled(controller: ScheduledController, env: Env, _ctx: ExecutionContext): Promise<void> {
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
