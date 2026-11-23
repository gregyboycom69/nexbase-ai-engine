"use client";

import { useTranslations } from "next-intl";
import { memo } from "react";

import { OfficeAvatar } from "./office-avatar";
import { OFFICE_ROOMS, type OfficeEmployees, type OfficeRoom } from "./office-plan";
import styles from "./office.module.css";

function Furnishings({ room }: { room: OfficeRoom }) {
  return (
    <span className={styles.furnishings} aria-hidden>
      <span className={styles.windows} />
      <span className={styles.rug} />
      <span className={styles.plant} />
      {room === "meeting" ? (
        <span className={styles.meetingTable} />
      ) : (
        <span className={styles.desks}>
          <span />
          <span />
          <span />
        </span>
      )}
    </span>
  );
}

interface OfficeFloorProps {
  selected?: OfficeRoom | null;
  employees?: OfficeEmployees;
  onSelect?: (room: OfficeRoom, target: HTMLButtonElement) => void;
}

export const OfficeFloor = memo(function OfficeFloor({ selected, onSelect, employees }: OfficeFloorProps) {
  const t = useTranslations("virtualOffice.rooms");

  return (
    <div className={styles.floor} aria-hidden={onSelect ? undefined : true}>
      {OFFICE_ROOMS.map((room) => {
        const contents = <Furnishings room={room} />;
        return onSelect ? (
          <button
            key={room}
            type="button"
            data-room={room}
            aria-label={t(`${room}.name`)}
            aria-pressed={selected === room}
            className={styles.room}
            onClick={(event) => onSelect(room, event.currentTarget)}
          >
            {contents}
            <span className={styles.roomLabel} aria-hidden>
              {t(`${room}.name`)}
            </span>
          </button>
        ) : (
          <div key={room} data-room={room} className={styles.room}>
            {contents}
          </div>
        );
      })}
      {employees && OFFICE_ROOMS.slice(0, 3).map((room, roomIndex) => (
        <div key={room} className={styles.seats} data-room={room}>
          {employees.agents.slice(roomIndex * 3, roomIndex * 3 + 3).map((agent) => (
            <button
              key={agent.id}
              type="button"
              className={styles.employeeMarker}
              aria-label={agent.name}
              aria-pressed={employees.selectedId === agent.id}
              title={agent.name}
              onClick={() => employees.onSelect(agent.id)}
            >
              <OfficeAvatar identity={agent.slug} />
            </button>
          ))}
        </div>
      ))}
      <span className={styles.corridor} aria-hidden />
      <span className={styles.entrance} aria-hidden />
    </div>
  );
});
