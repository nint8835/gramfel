export interface Env {
    DISCORD_WEBHOOK: string;
}

export default {
    async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
        await fetch(env.DISCORD_WEBHOOK, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: '<:harrhy:569924236353994782>',
            }),
        });
    },
};
