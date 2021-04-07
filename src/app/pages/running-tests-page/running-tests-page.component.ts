import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppConfig } from '../../../environments/environment';

import { TestsStatusService, VisualLiveStatusData, VSTestMainService } from '../../services';


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

  constructor(private grpcServer:VSTestMainService, private testStatusService:TestsStatusService) {
    this.visualLiveStatusData = new VisualLiveStatusData();
  }
  ngOnDestroy(): void {
    if (this.subscription1) {
      this.subscription1.unsubscribe();
    }
    if (this.subscription2) {
      this.subscription1.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.grpcServerAddress = this.grpcServer.grpcServerAddress;
  }

  refreshData() {

    if (this.subscription1) {
      this.subscription1.unsubscribe();
    }
    if (this.subscription2) {
      this.subscription1.unsubscribe();
    }

    this.subscription1 = this.testStatusService.getGlobalStatus(this.grpcServerAddress).subscribe(
      (element) => {
        this.visualLiveStatusData = element;
      },
      (error) => {},
      () => {}
    );

    this.subscription2 = this.testStatusService.getWorkersStatus(this.grpcServerAddress).subscribe(
      (element) => {},
      (error) => {},
      () => {}
    );
  }
}
