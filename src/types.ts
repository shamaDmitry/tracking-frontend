export type Status = "active" | "lost" | "removed";

export interface PointObject {
  id: string;
  lat: number;
  lng: number;
  direction: number;
  status: Status;
}

export interface TrackerStatusUpdate {
  id: string;
  status: Status;
}

export interface StatusLogEntry {
  id: string;
  status: Status;
  timestamp: Date;
}
