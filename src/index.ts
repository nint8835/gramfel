export interface Env {
    DISCORD_WEBHOOK: string;
    OK_WEBHOOK_URL: string;
}

type Channel = 'general' | 'ok';

interface Message {
    content: string;
    channel: Channel;
}

type MessageGenerator = () => Message;

function computeSuffix(): string {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const currentDate = now.getDate();

    if (Math.random() < currentDate / (daysInMonth + 1)) {
        return '.' + computeSuffix();
    }

    return '';
}

const responses: Record<string, MessageGenerator> = {
    '0 17 * * *': () => ({
        content: '<:harrhy:569924236353994782>',
        channel: 'general',
    }),
    '30 12 * * *': () => ({
        content: '<@365268923240677396> PAPERS PLEASE',
        channel: 'general',
    }),
    '30 13 * * *': () => {
        let postfix = computeSuffix();

        if (postfix.length > 1950) {
            postfix = postfix.slice(0, 1950);
        }

        const content =
            Math.random() < 0.05
                ? `Hi <@178958252820791296> :smiling_imp:${postfix}`
                : `Hi <@585549907193102338>${postfix}`;

        return {
            content,
            channel: 'general',
        };
    },
    '30 1 * * *': () => ({
        content: 'Go to bed <@335923137558347776> <@163488287951028227> <@489123999889227776>',
        channel: 'general',
    }),
    '0 14 * * 1': () => ({
        content:
            'Set a new goal for this week. You are legally obligated to disclose whether you completed last weeks goal, and chat is permitted to shade you if the goal was not achieved.\n<@224890702218133505> <@742187091475169300> <@480415224164253707>',
        channel: 'ok',
    }),
};

export default {
    async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
        const message = responses[controller.cron]();
        const webhookUrl = message.channel === 'ok' ? env.OK_WEBHOOK_URL : env.DISCORD_WEBHOOK;

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
