import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {AuthService} from "../../../services/auth.service";
import {catchError} from "rxjs/operators";
import {Router} from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

    constructor(private authenticationService: AuthService, private router: Router, private authService: AuthService) {
    }


    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const currentUser =  JSON.parse(localStorage.getItem('usuario'));
        if (currentUser && currentUser.token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.token}`,
                },
            });
        }
        // const usuario: any = JSON.parse(sessionStorage.getItem('usuario'));
        // let request = req;
        // if (usuario != null) {
        //     if (usuario.token) {
        //         //Clonamos el token y lo mandamos en la cabecera de todas las peticiones HTTP
        //         request = req.clone({
        //             setHeaders: {
        //                 //Autorizaciòn de tipo Bearer + token
        //                 //El tipo de autorizaciòn depende del back
        //                 authorization: `Bearer ${usuario.token}`
        //             }
        //         });
        //     }
        // }
        // Validamos si el token existe

        return next.handle(request).pipe(
            catchError((err: HttpErrorResponse) => {
                if (err.status === 401) {
                    this.authService.logout().subscribe((res) => {
                        if (!res.success) {
                            this.router.navigate(['/authentication/signin']);
                        }
                    });
                }
                return throwError(err);

            })
        );

    }
}
