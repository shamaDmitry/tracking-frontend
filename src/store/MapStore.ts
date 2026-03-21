import { action, makeAutoObservable } from "mobx";

export interface PointObject {
  id: string;
  lat: number;
  lng: number;
  direction: number;
  lastSeen: number;
  status: "active" | "lost";
}

export class MapStore {
  private LOST_THRESHOLD = 5000; // 15 seconds
  private REMOVE_THRESHOLD = 5 * 60 * 1000; // 5 minutes

  points: Map<string, PointObject> = new Map();
  hoveredId: string | null = null;
  selectedId: string | null = null;

  constructor() {
    makeAutoObservable(this);

    setInterval(() => this.cleanupRoutine(), 5000);
  }

  handleBatchUpdate = action(
    (dataArray: Omit<PointObject, "lastSeen" | "status">[]) => {
      const now = Date.now();

      dataArray.forEach((data) => {
        this.points.set(data.id, {
          ...data,
          lastSeen: now,
          status: "active",
        });
      });
    },
  );

  setHovered(id: string | null) {
    this.hoveredId = id;
  }

  setSelected(id: string | null) {
    this.selectedId = id;
  }

  cleanupRoutine() {
    const now = Date.now();

    for (const [id, obj] of this.points.entries()) {
      const timeSinceLastSeen = now - obj.lastSeen;

      if (timeSinceLastSeen > this.REMOVE_THRESHOLD) {
        this.points.delete(id); // Completely remove
      } else if (
        timeSinceLastSeen > this.LOST_THRESHOLD &&
        obj.status !== "lost"
      ) {
        obj.status = "lost"; // Flag as lost
      }
    }
  }

  get objectsList() {
    return Array.from(this.points.values());
  }
}
