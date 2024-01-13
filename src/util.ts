export const getColor = (status: string) => {
  switch (status) {
    case "success":
      return "#2eb886";
    case "cancelled":
      return "#daa038";
    case "failure":
      return "#a30200";
    default:
      return "#1d9bd1";
  }
};

export const getBranch = (ref: string) => {
  const refSplit = ref.split("/");
  const refType = refSplit[1];
  switch (refType) {
    case "heads":
      return refSplit.slice(2).join("/");
    case "pull":
      return process.env.GITHUB_HEAD_REF;
    default:
      return "unknown";
  }
};

export const getRefUrl = (repoUrl: string, ref: string) => {
  const refSplit = ref.split("/");
  const refType = refSplit[1];
  switch (refType) {
    case "heads":
      return `${repoUrl}/tree/${refSplit.slice(2).join("/")}`;
    case "pull":
      return `${repoUrl}/pull/${refSplit[2]}`;
    default:
      return repoUrl;
  }
};
