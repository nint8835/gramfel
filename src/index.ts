export interface Env {
    DISCORD_WEBHOOK: string;
}

function computeSuffix(): string {
    if (Math.random() > 0.35) {
        return '.' + computeSuffix();
    }

    return '';
}

export default {
    async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
        switch (controller.cron) {
            case '0 17 * * *': {
                await fetch(env.DISCORD_WEBHOOK, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        content: '<:harrhy:569924236353994782>',
                    }),
                });
                break;
            }
            case '30 13 * * *': {
                const postfix = computeSuffix();

                await fetch(env.DISCORD_WEBHOOK, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        content: `Hi <@585549907193102338>${postfix}`,
                    }),
                });
                break;
            }
            case '30 1 * * *': {
                await fetch(env.DISCORD_WEBHOOK, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        content: 'Go to bed <@335923137558347776> <@163488287951028227>',
                    }),
                });
                break;
            }
        }
    },
};
