import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/services/auth.service';
import { UnsubscribeOnDestroyAdapter } from 'src/shared/UnsubscribeOnDestroyAdapter';
import { Store } from '@ngrx/store';
import { _navAction } from 'src/store/actions/_nav.action';
import { usuarioAction } from 'src/store/actions/usuario.action';
import { ArrayHelper } from "src/common/helpers/arrays";
import { generateMenu } from "../../../../common/functions/generateMenu";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss']
})
export class SigninComponent
    extends UnsubscribeOnDestroyAdapter
    implements OnInit {
    loginForm: FormGroup;
    submitted = false;
    error = '';
    hide = true;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authService: AuthService,
        private store: Store<any>,
        private spinner: NgxSpinnerService,
    ) {
        super();
        if (this.authService.currentUserValue) {
            this.router.navigate(['/dashboard/main']);
        }
    }

    ngOnInit() {

        this.loginForm = this.formBuilder.group({
            email: [
                '',
                [Validators.required,]
            ],
            password: ['', Validators.required]
        });
    }

    get f() {
        return this.loginForm.controls;
    }

    onSubmit() {
        this.submitted = true;
        this.error = '';
        if (this.loginForm.invalid) {
            this.error = 'Usuario y clave incorrectos !';
            return;
        } else {
            this.spinner.show();
            this.authService
                .login(this.f.email.value, this.f.password.value)
                .subscribe({
                    next: (res: any) => {
                        if (res) {
                            console.log(res);
                            const token = res.data.token;
                            this.store.dispatch(usuarioAction({ payload: res.data }));
                            this.store.dispatch(_navAction({ payload: generateMenu(res.data) }));
                            this.spinner.hide();
                            this.router.navigate(['/dashboard/main']);
                            // if (token) {
                            //   this.router.navigate(['/dashboard/main']);
                            // }
                        } else {
                            this.spinner.hide();
                            this.error = 'Invalid Login';
                            localStorage.removeItem('usuario');
                        }
                    },
                    error: (error) => {
                        console.log(error)
                        this.spinner.hide();
                        localStorage.removeItem('usuario');
                        this.error = error;
                        this.submitted = false;
                    }
                });
        }
    }
}
