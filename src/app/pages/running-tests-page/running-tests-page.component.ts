import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, RouterModule, Routes } from '@angular/router';
import { AppConfig } from '../../../environments/environment';

import { TestsStatusService, VisualLiveStatusData, VisualWorkerStatusRecord, VSTestMainService } from '../../services';
import { WorkerRunningStatus } from '../../proto/VTestService_pb';


@Component({
  selector: 'app-running-tests-page',
  templateUrl: './running-tests-page.component.html',
  styleUrls: ['./running-tests-page.component.scss']
})
export class RunningTestsPageComponent implements OnInit, OnDestroy {

  private grpcServerAddress: string = '';

  private subscription1:Subscription;
  private subscription2: Subscription;

  visualLiveStatusData:VisualLiveStatusData;

  workersCollection:Array<VisualWorkerStatusRecord> = new Array<VisualWorkerStatusRecord>();

  constructor(private grpcServer:VSTestMainService, private testStatusService:TestsStatusService, private router: Router) {
    this.visualLiveStatusData = new VisualLiveStatusData();
  }


  ngOnDestroy(): void {
    if (this.subscription1) {
      this.subscription1.unsubscribe();

      console.log(`[RunningTestsPageComponent::ngOnDestroy] Unsubscribed from 'Global status' observable`);
    }

    if (this.subscription2) {
      this.subscription1.unsubscribe();

      console.log(`[RunningTestsPageComponent::ngOnDestroy] Unsubscribed from 'workers collection' observable`);
    }
  }

  ngOnInit(): void {
    this.grpcServerAddress = this.grpcServer.GrpcServerAddress;
  }

  refreshData() {
    if (this.subscription1) {
      this.subscription1.unsubscribe();

      console.log(`[RunningTestsPageComponent::refreshData] Unsubscribed from 'Global status' observable`);
    }

    if (this.subscription2) {
      this.subscription1.unsubscribe();

      console.log(`[RunningTestsPageComponent::refreshData] Unsubscribed from 'workers collection' observable`);
    }

    this.subscription1 = this.testStatusService.getGlobalStatusStream(this.grpcServerAddress).subscribe(
      (element) => {
        this.visualLiveStatusData = element;

        console.log(`[RunningTestsPageComponent::refreshData] Received another element`);
      },
      (error) => {
        console.error(`[RunningTestsPageComponent::refreshData] Error occurred when received elements: ${error}`);
      },
      () => {
        console.log(`[RunningTestsPageComponent::refreshData] Observable complete`);
      }
    );

    this.subscription2 = this.testStatusService.getWorkersStatusStream(this.grpcServerAddress).subscribe(
      (element) => {
        this.workersCollection.splice(0);

        element.forEach(item => {

          // icons from https://fonts.google.com/icons
          switch(item.runningStatus) {
            case WorkerRunningStatus.WRK_RUNNING_STATUS_DOWNLOADING_FILES:
              item.runningStatus = "downloading";
              break;

            case WorkerRunningStatus.WRK_RUNNING_STATUS_INTERNAL_ERROR:
              item.runningStatus = "error";
              break;

            case WorkerRunningStatus.WRK_RUNNING_STATUS_INVALID:
              item.runningStatus = "report_gmailerrorred";
              break;

            case WorkerRunningStatus.WRK_RUNNING_STATUS_REQUESTING_JOB:
              item.runningStatus = "find_in_page"
              break;

            case WorkerRunningStatus.WRK_RUNNING_STATUS_RUNNING_TEST:
              item.runningStatus = "directions_run";
              break;

            case WorkerRunningStatus.WRK_RUNNING_STATUS_SHUTTING_DOWN:
              item.runningStatus = "power_settings_new";
              break;

            case WorkerRunningStatus.WRK_RUNNING_STATUS_STARTING:
              item.runningStatus = "hourglass_empty";
              break;

            case WorkerRunningStatus.WRK_RUNNING_STATUS_STARTING_DONE:
              item.runningStatus = "hourglass_full";
              break;

            case WorkerRunningStatus.WRK_RUNNING_STATUS_TEST_FINISHED_ERROR:
              item.runningStatus = "running_with_errors";
              break;

            case WorkerRunningStatus.WRK_RUNNING_STATUS_TEST_FINISHED_OK:
              item.runningStatus = "check_circle_outline";
              break;
          }

          this.workersCollection.push(item);
        })

        console.log(`[RunningTestsPageComponent::refreshData] Received another element for workers collection`);
      },
      (error) => {
        console.error(`[RunningTestsPageComponent::refreshData] Error occurred while receiving elements for workers collection. Error is: ${error}`);

      },
      () => {
        console.log(`[RunningTestsPageComponent::refreshData] Workers collection observer is complete !`);

      }
    );
  }
}
