"use client";

import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Maximize, Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

const PAN_DIRECTIONS = [
  { key: "left", Icon: ArrowLeft, x: 1, y: 0 },
  { key: "right", Icon: ArrowRight, x: -1, y: 0 },
  { key: "up", Icon: ArrowUp, x: 0, y: 1 },
  { key: "down", Icon: ArrowDown, x: 0, y: -1 },
] as const;

interface OfficeControlsProps {
  simple: boolean;
  zoom: number;
  minZoom: number;
  maxZoom: number;
  onToggleView: () => void;
  onPan: (x: number, y: number) => void;
  onZoom: (direction: number) => void;
  onReset: () => void;
}

export function OfficeControls({
  simple,
  zoom,
  minZoom,
  maxZoom,
  onToggleView,
  onPan,
  onZoom,
  onReset,
}: OfficeControlsProps) {
  const t = useTranslations("virtualOffice");

  return (
    <div className="flex flex-wrap items-center gap-2" data-tour="virtual-office-controls">
      {!simple && (
        <>
          <div role="group" aria-label={t("zoom")} className="flex items-center rounded-xl border">
            <Button
              variant="ghost"
              size="icon"
              aria-label={t("zoomOut")}
              disabled={zoom <= minZoom}
              onClick={() => onZoom(-1)}
            >
              <Minus aria-hidden />
            </Button>
            <Button variant="ghost" size="icon" aria-label={t("reset")} onClick={onReset}>
              <Maximize aria-hidden />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={t("zoomIn")}
              disabled={zoom >= maxZoom}
              onClick={() => onZoom(1)}
            >
              <Plus aria-hidden />
            </Button>
          </div>
          <div role="group" aria-label={t("pan")} className="flex items-center rounded-xl border">
            {PAN_DIRECTIONS.map(({ key, Icon, x, y }) => (
              <Button
                key={key}
                variant="ghost"
                size="icon"
                aria-label={t(`panDirections.${key}`)}
                onClick={() => onPan(x, y)}
              >
                <Icon aria-hidden />
              </Button>
            ))}
          </div>
        </>
      )}
      <Button variant="outline" aria-pressed={simple} onClick={onToggleView}>
        {t("simpleView")}
      </Button>
    </div>
  );
}
