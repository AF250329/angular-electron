import { Component, OnInit } from '@angular/core';
import { VisualStorageItem, VSTestMainService } from '../../services';
import { ClarityIcons, userIcon } from '@cds/core/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-storage-browser',
  templateUrl: './storage-browser.component.html',
  styleUrls: ['./storage-browser.component.scss']
})
export class StorageBrowserComponent implements OnInit {

  openModal:boolean = false;
  loadingFiles: boolean = false;

  filesCollection:Array<VisualStorageItem> = new Array<VisualStorageItem>();

  constructor(private grpcServer:VSTestMainService, private router: Router,) {
    ClarityIcons.addIcons(userIcon);
  }

  ngOnInit(): void {
    this.loadingFiles = true;
  }

  addNewFile() {
    this.openModal = true;
  }

  refresh() {
    this.filesCollection.splice(0);

    this.grpcServer.getStorageFiles('')
                   .subscribe(
                     element => {
                      this.loadingFiles = false;
                      this.filesCollection.push(element);
                     },
                     err => {
                      this.loadingFiles = false;
                      this.filesCollection.splice(0);
                     },
                     () => {
                      this.loadingFiles = false;
                     });


  }

  sendFiles() {
    this.openModal = false
    const selectedItems = this.filesCollection.filter(x => x.ifSelected);

    this.grpcServer.setTestsFiles(selectedItems);

    this.router.navigate(['/']);
  }
}
