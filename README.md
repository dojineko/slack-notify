# Slack Notify

A GitHub Action to send a workflow result to a Slack channel.

![image](https://user-images.githubusercontent.com/1488898/97648582-7aa64400-1a98-11eb-96bf-368511f5c8f6.png)

## Example

```yml
- name: Notify
  if: always()
  uses: dojineko/slack-notify@v1
  with:
    job_status: ${{ job.status }}
    slack_webhook: ${{ secrets.SLACK_WEBHOOK }}
```

## Variables

| Variables          | Required | Purpose                                                                                |
| ------------------ | :------: | -------------------------------------------------------------------------------------- |
| job_status         |    ✅    | Job status                                                                             |
| slack_webhook      |    ✅    | Slack Incoming Webhook (legacy token is not supported)                                 |
| channel            |          | The name of the channel that the user selected as a destination for webhook messages.  |
| icon_emoji         |          | Emoji to use as the icon for message.                                                  |
| suffix_for_failure |          | Suffix to be added if the job fails. (e.g. <@user_id> <!subteam^user_group_id> <!here> |
