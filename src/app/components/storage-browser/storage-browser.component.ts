import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-storage-browser',
  templateUrl: './storage-browser.component.html',
  styleUrls: ['./storage-browser.component.scss']
})
export class StorageBrowserComponent implements OnInit {

  openModal:boolean = false;
  loadingFiles: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.loadingFiles = true;
  }

  addNewFile() {
    this.openModal = true;
  }

  refresh() {

  }
}
