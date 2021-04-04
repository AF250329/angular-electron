import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { VisualStorageItem, VSTestMainService } from '../../../services';

@Component({
  selector: 'app-tests-list-manager',
  templateUrl: './tests-list-manager.component.html',
  styleUrls: ['./tests-list-manager.component.scss']
})
export class TestsListManagerComponent implements OnInit, OnDestroy  {

  testsDetailsCollection:Array<string> = new Array<string>();

  testName:string = '';

  private sub: any;

  constructor(private activatedRoute: ActivatedRoute, private grpcServer:VSTestMainService) { }

  ngOnInit(): void {
    this.sub = this.activatedRoute.paramMap
    .pipe(
      switchMap((params: ParamMap) => {
        this.testName = params.get('id');

        const fileToScan = this.grpcServer.selectedTestsFiles.filter(x => x.name == this.testName).pop();

        if (fileToScan) {
          this.scanFileForTest(fileToScan);
        } else {
          // What is this that we received ?
        }

        return of(null);
      })
    ).subscribe();
  }

  scanFileForTest(fileToScan: VisualStorageItem) {
    this.grpcServer.scanFile(fileToScan).subscribe(
      (element) => {
        this.testsDetailsCollection.push(element);
      },
      (error) => {
        console.error(error);
      },
      () => {});
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
