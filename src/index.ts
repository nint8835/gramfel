export interface Env {
    DISCORD_WEBHOOK: string;
}

export default {
    async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
        console.log(env.DISCORD_WEBHOOK);
    },
};
