import { action, makeAutoObservable } from "mobx";
import type {
  PointObject,
  Status,
  StatusLogEntry,
  TrackerStatusUpdate,
} from "../types";

export class MapStore {
  points: Map<string, PointObject> = new Map();
  hoveredId: string | null = null;
  selectedId: string | null = null;
  lastLog: StatusLogEntry | null = null;
  showNotification = false;

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
          point.status = update.status as Status;
        }
      }
    });
  });

  handleLogUpdate = action((log: StatusLogEntry) => {
    this.lastLog = log;
    this.showNotification = true;
  });

  closeNotification = action(() => {
    this.showNotification = false;
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
