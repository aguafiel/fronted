import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from 'src/core/models/user';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject: BehaviorSubject<any>;
    public currentUser: Observable<any>;

    constructor(private http: HttpClient, private router: Router) {
        this.currentUserSubject = new BehaviorSubject<any>(
            JSON.parse(localStorage.getItem('usuario'))
        );
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): any {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
        return this.http
            .post<any>(`${environment.apiUrl}/usuarios/login`, {
                username,
                password
            })
            .pipe(
                map((user) => {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes

                    localStorage.setItem('usuario', JSON.stringify(user.data));
                    // this.router.navigate(['/dashboard/main'])
                    this.currentUserSubject.next(user);
                    return user;
                })
            );
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('usuario');
        this.currentUserSubject.next(null);
        return of({ success: false });
    }
}
