type time = {
  h: number;
  m: number;
  s: number;
};

export function formatMS(ms: number): time {
  const hours = Math.floor(ms / 1000 / 60 / 60);
  const minutes = Math.floor((ms / 1000 / 60) % 60);
  const seconds = Math.floor((ms / 1000) % 60);

  const obj: time = {
    h: hours,
    m: minutes,
    s: seconds,
  };

  return obj;
}

export function getDuration(ms: number): string {
  const time = formatMS(ms);
  return `${time.h > 0 ? `${time.h}:` : ''}${time.m > 0 ? (time.m > 9 ? time.m : `0${time.m}`) : '0'}:${
    time.s > 0 ? (time.s > 9 ? time.s : `0${time.s}`) : '00'
  }`;
}
