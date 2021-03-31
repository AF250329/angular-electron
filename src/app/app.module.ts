import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { ClarityModule } from '@clr/angular';
import { CdsModule } from '@cds/angular';

import { ComponentsModule } from './components/components.module';
import { PagesModule } from './pages/pages.module';
import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';
import { VSTestMainService } from './services';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';



import { GrpcCoreModule } from '@ngx-grpc/core';
import { GrpcWebClientModule } from '@ngx-grpc/grpc-web-client';
import { grpc } from '@improbable-eng/grpc-web';
import { ImprobableEngGrpcWebClientModule } from '@ngx-grpc/improbable-eng-grpc-web-client';

import { AppConfig } from '../environments/environment';
import { ElectronService } from './core/services';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

import '@cds/core/alert/register.js';

@NgModule({
  declarations: [ AppComponent ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,

    ClarityModule,
    CdsModule,

    ComponentsModule,
    PagesModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),


    GrpcCoreModule.forRoot(),
    ImprobableEngGrpcWebClientModule.forRoot({
      settings: {
        host: AppConfig.GRPCWebServerAddress,
        transport: grpc.CrossBrowserHttpTransport({}),
      },
    })
  ],
  providers: [
      ElectronService,
      VSTestMainService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
