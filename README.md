# Gramfel

An utterly unnecessary Discord bot, replacing our Discord's past usage of Slack & Slackbot.

Each invocation posts one hardcoded message and exits. The production schedule is managed externally by Kubernetes.

## Running

Copy `.env.dist` to `.env` and populate with the necessary values, or set the corresponding environment variables via your method of choice, then `go run .`.
