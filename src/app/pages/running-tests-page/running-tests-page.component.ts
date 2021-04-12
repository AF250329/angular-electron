import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, RouterModule, Routes } from '@angular/router';
import { AppConfig } from '../../../environments/environment';

import { TestsStatusService, VisualLiveStatusData, VisualWorker, VSTestMainService } from '../../services';


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

  workersCollection:Array<VisualWorker> = new Array<VisualWorker>();

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
    this.grpcServerAddress = this.grpcServer.grpcServerAddress;
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
        console.error(`[RunningTestsPageComponent::refreshData] Observable complete`);
      }
    );

    this.subscription2 = this.testStatusService.getWorkersStatusStream(this.grpcServerAddress).subscribe(
      (element) => {
        this.workersCollection.splice(0);

        element.forEach(item => {
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
