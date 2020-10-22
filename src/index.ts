import * as core from '@actions/core'
import * as github from '@actions/github'
import { IncomingWebhook } from '@slack/webhook'

void (async () => {
  type JobStatus = 'success' | 'failure' | 'cancelled'

  const jobStatus = core.getInput('job_status') as JobStatus
  const slackWebhook = core.getInput('slack_webhook')
  const githubHost = core.getInput('github_host')
  const githubRepository = `${github.context.repo.owner}/${github.context.repo.repo}`
  const githubWorkflow = github.context.workflow
  const githubRef = github.context.ref
  const githubSha = github.context.sha
  const githubRunId = github.context.runId

  const makeFromStatus = (status: JobStatus) => {
    switch (status) {
      case 'success':
        return { text: `:white_check_mark: *Action: ${githubWorkflow} SUCCEEDED*`, color: '#2eb886' }
      case 'cancelled':
        return { text: `:sleeping: *Action: ${githubWorkflow} CANCELLED*`, color: '#daa038' }
      case 'failure':
        return { text: `:fire: *Action: ${githubWorkflow} FAILED*`, color: '#a30200' }
      default:
        return { text: `:grey_question: *Action: ${githubWorkflow} STATUS UNKNOWN* (${status})`, color: '#1d9bd1' }
    }
  }

  const getRefUrl = (ref: string) => {
    const refSplit = ref.split('/')
    const refType = refSplit[1]
    switch (refType) {
      case 'heads':
        return `https://${githubHost}/${githubRepository}/tree/${refSplit[2]}`
      case 'pull':
        return `https://${githubHost}/${githubRepository}/pull/${refSplit[2]}`
      default:
        return `https://${githubHost}/${githubRepository}`
    }
  }

  const slack = new IncomingWebhook(slackWebhook)

  const { text, color } = makeFromStatus(jobStatus)
  const shaUrl = `https://${githubHost}/${githubRepository}/commit/${githubSha}`
  const logUrl = `https://${githubHost}/${githubRepository}/actions/runs/${githubRunId}`

  await slack.send({
    text,
    attachments: [
      {
        title: githubRepository,
        title_link: `https://${githubHost}/${githubRepository}/`,
        text: `<${getRefUrl(githubRef)}|${githubRef}> @ <${shaUrl}|${githubSha.slice(0, 7)}> (<${logUrl}|Show logs>)`,
        color,
        mrkdwn_in: ['pretext', 'text', 'fields'],
      },
    ],
  })
})().catch((err) => {
  console.error(err)
  core.setFailed(err.message)
})
