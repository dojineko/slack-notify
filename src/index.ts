import * as core from '@actions/core'
import * as github from '@actions/github'
import { IncomingWebhook } from '@slack/webhook'

const getColor = (status: string) => {
  switch (status) {
    case 'success':
      return '#2eb886'
    case 'cancelled':
      return '#daa038'
    case 'failure':
      return '#a30200'
    default:
      return '#1d9bd1'
  }
}

const getBranch = (ref: string) => {
  const refSplit = ref.split('/')
  const refType = refSplit[1]
  switch (refType) {
    case 'heads':
      return refSplit.slice(2).join('/')
    case 'pull':
      return process.env.GITHUB_HEAD_REF
    default:
      return 'unknown'
  }
}

const getRefUrl = (repoUrl: string, ref: string) => {
  const refSplit = ref.split('/')
  const refType = refSplit[1]
  switch (refType) {
    case 'heads':
      return `${repoUrl}/tree/${refSplit.slice(2).join('/')}`
    case 'pull':
      return `${repoUrl}/pull/${refSplit[2]}`
    default:
      return repoUrl
  }
}

void (async () => {
  const jobStatus = core.getInput('job_status')
  const slackWebhook = core.getInput('slack_webhook')
  const repo = `${github.context.repo.owner}/${github.context.repo.repo}`
  const actor = github.context.actor
  const workflow = github.context.workflow
  const ref = github.context.ref
  const sha = github.context.sha
  const runId = github.context.runId
  const repoUrl = `${process.env.GITHUB_SERVER_URL}/${repo}`
  const shaUrl = `${repoUrl}/commit/${sha}`
  const logUrl = `${repoUrl}/actions/runs/${runId}`

  const slack = new IncomingWebhook(slackWebhook)
  await slack.send({
    attachments: [
      {
        text: [
          `*${jobStatus}*`,
          `<${logUrl}|workflow:${workflow}>`,
          `<${repoUrl}|${repo}>#<${shaUrl}|${sha.slice(0, 7)}>`,
          `(<${getRefUrl(repoUrl, ref)}|${getBranch(ref)}>)`,
          `by <${process.env.GITHUB_SERVER_URL}/${actor}|${actor}>`,
        ].join(' '),
        color: getColor(jobStatus),
        mrkdwn_in: ['pretext', 'text', 'fields'],
      },
    ],
  })
})().catch((err) => {
  console.error(err)
  core.setFailed(err.message)
})
