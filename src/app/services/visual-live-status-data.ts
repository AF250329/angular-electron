export class VisualLiveStatusData {
  numberOfWorkers: number;
  runningTestIndex:number;
  runningTestTotal:number;
  numberOfSucceededTests: number;
  numberOfFailedTests: number;
  minExecutionTime: string;
  maxExecutionTime: string;
  avgExecutionTime: string;
  totalRunningTime: string;
  etaTime: string;

  constructor() {
    this.numberOfWorkers = 0;
    this.avgExecutionTime = '';
    this.etaTime = '';
    this.maxExecutionTime = '';
    this.minExecutionTime = '';
    this.numberOfFailedTests = 0;
    this.numberOfSucceededTests = 0;
    this.numberOfWorkers = 0;
    this.runningTestIndex = 0;
    this.runningTestTotal = 0;
    this.totalRunningTime = '';
  }
}
