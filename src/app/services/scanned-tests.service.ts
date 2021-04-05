import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { StorageItem, TestSpec } from '../proto/VTestService_pb';

import { VSTestMainService } from '../services/vstest-main-service.service';
import { VisualStorageItem } from './storage-item';
import { VisualLabel, VisualTest } from '../services/visual-test';

@Injectable({
  providedIn: 'root'
})
export class ScannedTestsService implements OnDestroy {

  private subscription1: Subscription;

  scannedFile: VisualStorageItem;

  scannedFileTests:Array<VisualTest> = new Array<VisualTest>();

  constructor(private grpcServer:VSTestMainService) { }

  scanFile(fileToScan:VisualStorageItem): Observable<VisualTest> {

    this.scannedFile = fileToScan;
    this.scannedFileTests.splice(0);

    return new Observable( (observer) => {

      this.subscription1 = this.grpcServer.scanFile(fileToScan)
      .subscribe(
          (element) => {

            const item = this.convertTo(element);

            this.scannedFileTests.push(item);

            observer.next(item);
          },
          (error) => {
            console.error(error);
            observer.error(error);
          },
          () => {
            observer.complete();
          });
    });
  }

  clear() {
    if (this.subscription1) {
      this.subscription1.unsubscribe();
    }

    this.scannedFile = null;
    this.scannedFileTests.splice(0);
  }

  ngOnDestroy(): void {
    this.subscription1.unsubscribe();
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

  runTests(file: VisualStorageItem, testsCollection:Array<VisualTest>) : Observable<string> {

    const sourceFile = new StorageItem();
    sourceFile.setName(file.name);
    sourceFile.setLink(file.link);

    let collection = new Array<TestSpec>();

    testsCollection.forEach( (element) => {
        let testSpec = new TestSpec();
        testSpec.setCodefilepath(element.CodeFilePath);
        testSpec.setDisplayname(element.DisplayName);
        testSpec.setFullyqualifiedname(element.FullyQualifiedName);
        testSpec.setId(element.id);
        testSpec.setLinenumber(element.LineNumber);
        testSpec.setSource(element.OriginalSource);

        collection.push(testSpec);
      });

    return this.grpcServer.runTests(sourceFile, collection);
  }
}
