export class VisualWorkerReport {
  ipAddress: string;
  lastSeen: Date;
  registeredAt: Date;
  logs:Array<string>;
  status: number | string;
}
