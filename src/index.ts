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
        content: 'Go to bed <@335923137558347776> <@489123999889227776>',
        channel: 'general',
    }),
    '30 2 * * *': () => ({
        content: 'Go to bed <@335923137558347776> <@489123999889227776>',
        channel: 'general',
    }),
    '0 14 * * 2': () => ({
        content:
            'Set a new goal for this week. You are legally obligated to disclose whether you completed last weeks goal, and chat is permitted to shade you if the goal was not achieved.\n<@224890702218133505> <@742187091475169300>',
        channel: 'ok',
    }),
};

function is11PMStJohns(): boolean {
    return new Date().toLocaleString('en-US', {
        hour: 'numeric',
        hour12: false,
        timeZone: 'America/St_Johns'
    }).startsWith('23');
}

export default {
    async scheduled(controller: ScheduledController, env: Env, _ctx: ExecutionContext): Promise<void> {
        // Both crons, and check if it is 11pm, if not skip.
        if (controller.cron === '30 1 * * *' || controller.cron === '30 2 * * *') {
            if (!is11PMStJohns()) {
                console.log(
                    `Skipping "go to bed" message - not 11 PM in America/St_Johns (current cron: ${controller.cron})`
                );
                return;
            }
        }

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
