export interface Env {
    DISCORD_WEBHOOK: string;
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
            case '30 11 * * *': {
                const targetDay = new Date(2024, 0, 2);
                const today = new Date();
                const diffDays = Math.abs(Math.ceil((targetDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

                await fetch(env.DISCORD_WEBHOOK, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        content: diffDays.toLocaleString(),
                    }),
                });
                break;
            }
            case '30 13 * * *': {
                const postfix = Math.random() > 0.75 ? '...' : '';

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

            case '30 10 * * 1-5': {
                await fetch(env.DISCORD_WEBHOOK, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        content: 'Get out of bed <@178958252820791296>',
                    }),
                });
                break;
            }
        }
    },
};
