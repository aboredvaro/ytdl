type size = string;

const round = (num: number): number => Math.round((num + Number.EPSILON) * 10) / 10;

export function formatBytes(bytes: number): size {
  if (bytes >= 10e11) {
    return `${round(bytes / 10e11)} TB`;
  } else if (bytes >= 10e8) {
    return `${round(bytes / 10e8)} GB`;
  } else if (bytes >= 10e5) {
    return `${round(bytes / 10e5)} MB`;
  } else if (bytes >= 10e2) {
    return `${round(bytes / 10e2)} KB`;
  } else {
    return `${bytes} Bytes`;
  }
}
