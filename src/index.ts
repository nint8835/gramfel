export interface Env {
    DISCORD_WEBHOOK: string;
}

type MessageGenerator = () => string;

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
    '0 17 * * *': () => '<:harrhy:569924236353994782>',
    '30 12 * * *': () => '<@365268923240677396> PAPERS PLEASE',
    '30 13 * * *': () => {
        let postfix = computeSuffix();

        if (postfix.length > 1950) {
            postfix = postfix.slice(0, 1950);
        }

        if (Math.random() < 0.05) {
            return `Hi <@178958252820791296> :smiling_imp:${postfix}`;
        } else {
            return `Hi <@585549907193102338>${postfix}`;
        }
    },
    '30 1 * * *': () => 'Go to bed <@335923137558347776> <@163488287951028227> <@489123999889227776>',
    '30 12 * * 1': () =>
        '<@224890702218133505> Set a new goal for this week. You are legally obligated to disclose whether you completed last weeks goal, and chat is permitted to shade you if the goal was not achieved.',
};

export default {
    async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
        await fetch(env.DISCORD_WEBHOOK, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: responses[controller.cron](),
            }),
        });
    },
};
