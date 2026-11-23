import type { CSSProperties } from "react";

import styles from "./office-avatar.module.css";

const looks = [
  ["#a96348", "#241a27", "#344b83"],
  ["#e8b592", "#68442b", "#31575a"],
  ["#764b38", "#211921", "#623f72"],
  ["#d58b6a", "#3e2637", "#294557"],
  ["#f1c9ad", "#ac633b", "#4a466d"],
  ["#bf8062", "#222639", "#315b77"],
] as const;

export type OfficePose = "idle" | "walking" | "sitting" | "working" | "collaboration";

export function OfficeAvatar({ identity, pose = "idle" }: { identity: string; pose?: OfficePose }) {
  let hash = 0;
  for (const character of identity) hash = (Math.imul(hash, 31) + character.charCodeAt(0)) >>> 0;
  const index = hash % looks.length;
  const [skin, hair, jacket] = looks[index] ?? looks[0];

  return (
    <span
      aria-hidden
      className={styles.avatar}
      data-look={index}
      data-pose={pose}
      style={{ "--skin": skin, "--hair": hair, "--jacket": jacket } as CSSProperties}
    >
      <span className={styles.body} />
      <span className={styles.face} />
    </span>
  );
}
