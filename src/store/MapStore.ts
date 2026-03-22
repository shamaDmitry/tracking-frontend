import { action, makeAutoObservable } from "mobx";

export interface PointObject {
  id: string;
  lat: number;
  lng: number;
  direction: number;
  status: "active" | "lost";
}

export interface TrackerStatusUpdate {
  id: string;
  status: "active" | "lost" | "removed";
}

export class MapStore {
  points: Map<string, PointObject> = new Map();
  hoveredId: string | null = null;
  selectedId: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  handleBatchUpdate = action((dataArray: PointObject[]) => {
    dataArray.forEach((data) => {
      this.points.set(data.id, data);
    });
  });

  handleStatusUpdate = action((updates: TrackerStatusUpdate[]) => {
    updates.forEach((update) => {
      if (update.status === "removed") {
        this.points.delete(update.id);

        if (this.selectedId === update.id) {
          this.selectedId = null;
        }

        if (this.hoveredId === update.id) {
          this.hoveredId = null;
        }
      } else {
        const point = this.points.get(update.id);

        if (point) {
          point.status = update.status as "active" | "lost";
        }
      }
    });
  });

  setHovered(id: string | null) {
    this.hoveredId = id;
  }

  setSelected(id: string | null) {
    this.selectedId = id;
  }

  get objectsList() {
    return Array.from(this.points.values());
  }
}
