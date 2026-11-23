"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useCallback, useRef, useState, type PointerEvent } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { OfficeControls } from "./office-controls";
import { OFFICE_ROOMS, type OfficeEmployees, type OfficeRoom } from "./office-plan";
import styles from "./office.module.css";

const OfficeFloor = dynamic(() => import("./office-floor").then((scene) => scene.OfficeFloor), { ssr: false });

const HOME = { x: 0, y: 0, zoom: 1 };
type Camera = typeof HOME;

const MIN_ZOOM = 0.75;
const MAX_ZOOM = 1.75;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function limitPan(camera: Camera, viewport: HTMLElement | null): Camera {
  const xLimit = (viewport?.clientWidth || 320) * 0.45;
  const yLimit = (viewport?.clientHeight || 320) * 0.45;
  return { ...camera, x: clamp(camera.x, -xLimit, xLimit), y: clamp(camera.y, -yLimit, yLimit) };
}

export function OfficeExplorer({ employees }: { employees?: OfficeEmployees }) {
  const t = useTranslations("virtualOffice");
  const [camera, setCamera] = useState(HOME);
  const [room, setRoom] = useState<OfficeRoom | null>(null);
  const [simple, setSimple] = useState(false);
  const [dragging, setDragging] = useState(false);
  const viewport = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: number; x: number; y: number; origin: Camera; moved: boolean } | null>(
    null,
  );

  const selectRoom = useCallback((nextRoom: OfficeRoom, target: HTMLButtonElement) => {
    setRoom(nextRoom);
    const view = viewport.current?.getBoundingClientRect();
    if (!view) return;
    const targetRect = target.getBoundingClientRect();
    setCamera((current) =>
      limitPan(
        {
          ...current,
          x: current.x + view.left + view.width / 2 - targetRect.left - targetRect.width / 2,
          y: current.y + view.top + view.height / 2 - targetRect.top - targetRect.height / 2,
        },
        viewport.current,
      ),
    );
  }, []);

  function startPan(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    drag.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      origin: camera,
      moved: false,
    };
  }

  function movePan(event: PointerEvent<HTMLDivElement>) {
    const pan = drag.current;
    if (!pan || event.pointerId !== pan.id) return;
    const dx = event.clientX - pan.x;
    const dy = event.clientY - pan.y;
    if (!pan.moved) {
      // A tap selects the room. Capture the pointer only after it becomes a drag.
      if (Math.hypot(dx, dy) < 6) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      pan.moved = true;
      setDragging(true);
    }
    setCamera(
      limitPan({ ...pan.origin, x: pan.origin.x + dx, y: pan.origin.y + dy }, viewport.current),
    );
  }

  function endPan(event: PointerEvent<HTMLDivElement>) {
    if (drag.current?.id !== event.pointerId) return;
    drag.current = null;
    setDragging(false);
  }

  return (
    <section
      className="bg-card grid min-w-0 gap-4 rounded-2xl border p-3 sm:p-5"
      aria-label={t("title")}
    >
      <OfficeControls
        simple={simple}
        zoom={camera.zoom}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
        onToggleView={() => {
          setSimple(!simple);
          setCamera(HOME);
        }}
        onPan={(x, y) =>
          setCamera((current) =>
            limitPan(
              { ...current, x: current.x + x * 36, y: current.y + y * 36 },
              viewport.current,
            ),
          )
        }
        onZoom={(direction) =>
          setCamera((current) => ({
            ...current,
            zoom: clamp(current.zoom + direction * 0.25, MIN_ZOOM, MAX_ZOOM),
          }))
        }
        onReset={() => {
          setCamera(HOME);
          setRoom(null);
        }}
      />
      <div className={cn("grid min-w-0 gap-4", !simple && "xl:grid-cols-[minmax(0,1fr)_16rem]")}>
        {!simple && (
          <div
            ref={viewport}
            className={styles.viewport}
            data-dragging={dragging || undefined}
            onPointerDown={startPan}
            onPointerMove={movePan}
            onPointerUp={endPan}
            onPointerCancel={endPan}
            onLostPointerCapture={endPan}
          >
            <div
              className={styles.camera}
              data-office-camera
              style={{ transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.zoom})` }}
            >
              <OfficeFloor selected={room} onSelect={selectRoom} employees={employees} />
            </div>
          </div>
        )}
        <div className="grid content-start gap-3">
          <div
            className="grid grid-cols-2 gap-2 xl:grid-cols-1"
            role="group"
            aria-label={t("roomDirectory")}
          >
            {OFFICE_ROOMS.map((id) => (
              <Button
                key={id}
                variant={room === id ? "default" : "secondary"}
                aria-pressed={room === id}
                onClick={() => {
                  const target = viewport.current?.querySelector<HTMLButtonElement>(
                    `[data-room="${id}"]`,
                  );
                  if (target) selectRoom(id, target);
                  else setRoom(id);
                }}
                className="h-auto min-h-11 justify-start text-left whitespace-normal"
              >
                {t(`rooms.${id}.name`)}
              </Button>
            ))}
          </div>
          <div
            className="bg-background rounded-xl border p-4"
            aria-live="polite"
            aria-atomic="true"
          >
            <h2 className="text-sm font-semibold">
              {room ? t(`rooms.${room}.name`) : t("floorPlan")}
            </h2>
            <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
              {room ? t(`rooms.${room}.description`) : t(simple ? "directoryHelp" : "exploreHelp")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
