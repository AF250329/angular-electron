import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TestSpec } from '../../../proto/VTestService_pb';
import { of, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ScannedTestsService, VisualStorageItem, VSTestMainService } from '../../../services';
import { VisualLabel, VisualTest } from '../../../services/visual-test';

import { trigger, transition, useAnimation, state, style } from '@angular/animations';
import { rubberBand } from 'ng-animate';


@Component({
  selector: 'app-tests-list-manager',
  templateUrl: './tests-list-manager.component.html',
  styleUrls: ['./tests-list-manager.component.scss'],
  animations: [
    trigger('tada', [
      state('inactive', style({ opacity: 1 })),
      state('active', style({ opacity: 1 })),
      transition('* => *', useAnimation(rubberBand, {
      // Set the duration to 180 seconds and delay to 2seconds
      // params: { timing: 180, delay: 0 }
    }))])
  ]
})
export class TestsListManagerComponent implements OnInit, OnDestroy  {

  testsDetailsCollection:Array<VisualTest> = new Array<VisualTest>();
  testsDetailsCollectionHasItems: boolean = false;

  animationState:string = 'inactive';
  tada = false;

  loading: boolean = false;

  testName:string = '';

  private sub:Subscription;
  private sub2:Subscription;

  constructor(private activatedRoute: ActivatedRoute, private grpcServer:VSTestMainService,  private scannedTestsService:ScannedTestsService) { }

  ngOnInit(): void {
    this.sub = this.activatedRoute.paramMap
                                  .pipe(
                                    switchMap((params: ParamMap) => {
                                      this.testName = params.get('id');

                                      this.scannedTestsService.clear();

                                      const fileToScan = this.grpcServer.selectedTestsFiles.filter(x => x.name == this.testName).pop();

                                      if (fileToScan) {
                                        this.scanFileForTest(fileToScan);
                                      } else {
                                        // What is this that we received ?
                                      }

                                      return of(null);
                                    })
                                  )
                                  .subscribe();
  }

  onAnimationDone($event) {
    this.animationState =  this.animationState === 'active' ? 'inactive' : 'active';
  }


  scanFileForTest(fileToScan: VisualStorageItem) {

    this.loading = true;


    this.sub2 = this.scannedTestsService.scanFile(fileToScan).subscribe(
      (element) => {
        this.loading = false;

        this.testsDetailsCollection.push(element);

        this.testsDetailsCollectionHasItems = true;
      },
      (error) => {
        console.error(error);

        this.loading = false;
        this.testsDetailsCollectionHasItems = false;
      },
      () => {
        this.loading = false;
        this['tada'] = false;
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.sub2.unsubscribe();
  }
}
