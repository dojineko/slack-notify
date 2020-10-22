# slack-notify

A GitHub Action to send a workflow result to a Slack channel.

![image](https://user-images.githubusercontent.com/1488898/96951744-221af800-1528-11eb-8de2-c898fc0f6e9f.png)

## Example

```yml
- name: Notify
  if: always()
  uses: dojineko/slack-notify@v1
  with:
    github_host: github.private.test # default: github.com
    job_status: ${{ job.status }}
    slack_webhook: ${{ secrets.SLACK_WEBHOOK }}
```

## Variables

Variables | Default | Purpose
---- | ---- | ----
github_host | github.com | Specifies the hostname for GitHub, for GitHub Enterprise.
job_status | (required) | Job status
slack_webhook | (required) | Slack Incomming Webhook (legacy token is not supported)
