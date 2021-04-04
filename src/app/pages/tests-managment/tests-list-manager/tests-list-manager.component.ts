import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TestSpec } from '../../../proto/VTestService_pb';
import { of, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { VisualStorageItem, VSTestMainService } from '../../../services';
import { VisualLabel, VisualTest } from '../visual-test';

@Component({
  selector: 'app-tests-list-manager',
  templateUrl: './tests-list-manager.component.html',
  styleUrls: ['./tests-list-manager.component.scss']
})
export class TestsListManagerComponent implements OnInit, OnDestroy  {

  testsDetailsCollection:Array<VisualTest> = new Array<VisualTest>();
  testsDetailsCollectionHasItems: boolean = false;

  loading: boolean = false;

  testName:string = '';

  private sub:Subscription;
  private sub2:Subscription;

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

    this.loading = true;


    this.sub2 = this.grpcServer.scanFile(fileToScan)
                                .subscribe(
                                    (element) => {

                                      this.loading = false;

                                      const item = this.convertTo(element);
                                      this.testsDetailsCollection.push(item);

                                      this.testsDetailsCollectionHasItems = true;

                                    },
                                    (error) => {
                                      console.error(error);

                                      this.loading = false;
                                      this.testsDetailsCollectionHasItems = false;
                                    },
                                    () => {
                                      this.loading = false;
                                    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.sub2.unsubscribe();
  }

  convertTo(item:TestSpec) : VisualTest {
    const visualTest = new VisualTest();
    visualTest.id = item.getId();
    visualTest.FullyQualifiedName = item.getFullyqualifiedname();
    visualTest.DisplayName = item.getDisplayname();
    visualTest.OriginalSource = item.getSource();
    visualTest.VisualSourceText = item.getSource().substring(item.getSource().lastIndexOf('\\') + 1);
    visualTest.CodeFilePath = item.getCodefilepath();
    visualTest.LineNumber = item.getLinenumber();
    visualTest.Labels = new Array<VisualLabel>();


    item.getLabelsList().forEach(element => {
      visualTest.Labels.push({ "key":element.getKey(), "value": element.getValue()})
    });

    return visualTest;
  }
}
