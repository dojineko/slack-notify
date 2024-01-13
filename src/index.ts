import * as core from "@actions/core";
import * as github from "@actions/github";
import { IncomingWebhook } from "@slack/webhook";
import { getBranch, getColor, getRefUrl } from "./util";

void (async () => {
  const jobStatus = core.getInput("job_status");
  const slackWebhook = core.getInput("slack_webhook");
  const channel = core.getInput("channel", { required: false });
  const iconEmoji = core.getInput("icon_emoji", { required: false });
  const suffixForFailure = core.getInput("suffix_for_failure", {
    required: false,
  });

  const repo = `${github.context.repo.owner}/${github.context.repo.repo}`;
  const actor = github.context.actor;
  const workflow = github.context.workflow;
  const ref = github.context.ref;
  const sha = github.context.sha;
  const runId = github.context.runId;
  const repoUrl = `${process.env.GITHUB_SERVER_URL}/${repo}`;
  const shaUrl = `${repoUrl}/commit/${sha}`;
  const logUrl = `${repoUrl}/actions/runs/${runId}`;
  const textElements = [
    `*${jobStatus}*`,
    `<${logUrl}|workflow:${workflow}>`,
    `<${repoUrl}|${repo}>#<${shaUrl}|${sha.slice(0, 7)}>`,
    `(<${getRefUrl(repoUrl, ref)}|${getBranch(ref)}>)`,
    `by <${process.env.GITHUB_SERVER_URL}/${actor}|${actor}>`,
  ];
  if (jobStatus === "failure" && suffixForFailure) {
    textElements.push(`>> ${suffixForFailure}`);
  }

  const slack = new IncomingWebhook(slackWebhook);
  await slack.send({
    channel: channel,
    icon_emoji: iconEmoji,
    attachments: [
      {
        text: textElements.join(" "),
        color: getColor(jobStatus),
        mrkdwn_in: ["pretext", "text", "fields"],
      },
    ],
  });
})().catch((err) => {
  console.error(err);
  core.setFailed(err.message);
});
