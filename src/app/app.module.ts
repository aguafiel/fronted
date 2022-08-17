import { NgModule } from '@angular/core';
import { CoreModule } from 'src/core/core.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { PageLoaderComponent } from './layout/page-loader/page-loader.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { RightSidebarComponent } from './layout/right-sidebar/right-sidebar.component';
import { AuthLayoutComponent } from './layout/app-layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/app-layout/main-layout/main-layout.component';
import { fakeBackendProvider } from 'src/core/interceptor/fake-backend';
import { ErrorInterceptor } from 'src/core/interceptor/error.interceptor';
import { JwtInterceptor } from 'src/core/interceptor/jwt.interceptor';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import {
    PerfectScrollbarModule,
    PERFECT_SCROLLBAR_CONFIG,
    PerfectScrollbarConfigInterface
} from 'ngx-perfect-scrollbar';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ClickOutsideModule } from 'ng-click-outside';
import {
    HttpClientModule,
    HTTP_INTERCEPTORS,
    HttpClient
} from '@angular/common/http';
import { WINDOW_PROVIDERS } from 'src/core/service/window.service';
import { ApiService } from 'src/services/api.service';
import { MaestrosModule } from './pages/maestros/maestros.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MaterialModule } from 'src/shared/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { listMenusReducer } from 'src/store/reducers/_nav.reducer';
import { environment } from '../environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { UsuarioReducer } from 'src/store/reducers/usuario.reducer';
import { AuthInterceptorService } from "./pages/services/auth-interceptor.service";
import { ConfiguracionesModule } from './pages/configuraciones/configuraciones.module';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true,
    wheelPropagation: false
};

export function createTranslateLoader(http: HttpClient): any {
    return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        PageLoaderComponent,
        SidebarComponent,
        RightSidebarComponent,
        AuthLayoutComponent,
        MainLayoutComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        PerfectScrollbarModule,
        NgxSpinnerModule,
        ClickOutsideModule,
        MaterialModule,
        NgxSpinnerModule,
        CommonModule,
        NgxDatatableModule,
        StoreModule.forRoot({
            navMenu: listMenusReducer,
            usuarioState: UsuarioReducer,
            menuState: listMenusReducer,
        }),
        StoreDevtoolsModule.instrument({
            maxAge: 25,
            logOnly: environment.production,
        }),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        CoreModule,
        SharedModule,
        MaestrosModule,
        ConfiguracionesModule,
        ReactiveFormsModule,
    ],
    providers: [
        ApiService,
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        fakeBackendProvider,
        WINDOW_PROVIDERS,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptorService,
            multi: true
        }
    ],
    entryComponents: [],
    bootstrap: [AppComponent],

})
export class AppModule {
}
