import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Page404Component } from './pages/authentication/page404/page404.component';
import { AuthGuard } from 'src/core/guard/auth.guard';
import { AuthLayoutComponent } from './layout/app-layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/app-layout/main-layout/main-layout.component';

const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: '/authentication/signin', pathMatch: 'full' },
            {
                path: 'dashboard',
                loadChildren: () =>
                    import('./pages/dashboard/dashboard.module').then((m) => m.DashboardModule)
            },
            {
                path: 'extra-pages',
                loadChildren: () =>
                    import('./pages/extra-pages/extra-pages.module').then(
                        (m) => m.ExtraPagesModule
                    )
            },
            {
                path: 'multilevel',
                loadChildren: () =>
                    import('./pages/multilevel/multilevel.module').then(
                        (m) => m.MultilevelModule
                    )
            }
        ]
    },
    {
        path: 'authentication',
        component: AuthLayoutComponent,
        loadChildren: () =>
            import('./pages/authentication/authentication.module').then(
                (m) => m.AuthenticationModule
            )
    },
    {
        path: 'maestros',
        canActivate: [AuthGuard],
        component: MainLayoutComponent,
        loadChildren: () => import('./pages/maestros/maestros.module').then(m => m.MaestrosModule)
    },
    {
        path: 'administracion',
        canActivate: [AuthGuard],
        component: MainLayoutComponent,
        loadChildren: () => import('./pages/administracion/administracion.module').then(m => m.AdministracionModule)
    },
    {
        path: 'seguridad',
        canActivate: [AuthGuard],
        component: MainLayoutComponent,
        loadChildren: () => import('./pages/seguridad/seguridad.module').then(m => m.SeguridadModule)
    },
    {
        path: 'preventas',
        canActivate: [AuthGuard],
        component: MainLayoutComponent,
        loadChildren: () => import('./pages/preventas/preventas.module').then(m => m.PreventasModule)
    },
    {
        path: 'ventas',
        canActivate: [AuthGuard],
        component: MainLayoutComponent,
        loadChildren: () => import('./pages/ventas/ventas.module').then(m => m.VentasModule)
    },
    {
        path: 'configuraciones',
        canActivate: [AuthGuard],
        component: MainLayoutComponent,
        loadChildren: () => import('./pages/configuraciones/configuraciones.module').then(m => m.ConfiguracionesModule)
    },
    { path: '**', component: Page404Component }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
