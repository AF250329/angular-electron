import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { ClarityModule } from '@clr/angular';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { HomeModule } from './home/home.module';
import { DetailModule } from './detail/detail.module';
import { AppComponent } from './app.component';

import { GrpcCoreModule } from '@ngx-grpc/core';
import { GrpcWebClientModule } from '@ngx-grpc/grpc-web-client';
import { grpc } from '@improbable-eng/grpc-web';
import { ImprobableEngGrpcWebClientModule } from '@ngx-grpc/improbable-eng-grpc-web-client';

import { AppConfig } from '../environments/environment';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { GlobalSettingsPageComponent } from './global-settings-page/global-settings-page.component';
import { RunningTestsPageComponent } from './running-tests-page/running-tests-page.component';
import { ReportsPageComponent } from './reports-page/reports-page.component'

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent, WelcomePageComponent, GlobalSettingsPageComponent, RunningTestsPageComponent, ReportsPageComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,

    ClarityModule,

    CoreModule,
    SharedModule,
    HomeModule,
    DetailModule,
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
