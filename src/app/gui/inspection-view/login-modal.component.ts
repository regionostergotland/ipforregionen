import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { ConfigService, AuthenticationMethod } from 'src/app/config.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'login-modal',
    templateUrl: './login-modal.component.html',
    styleUrls: []
})
export class LoginModal{
    AuthenticationMethod = AuthenticationMethod;
    method: AuthenticationMethod;
    loggedIn: boolean = false;
  

    constructor (
        public dialogRef: MatDialogRef<LoginModal>,
        private cfg: ConfigService,
        private auth: AuthService,
        public router: Router,
        private snackBar: MatSnackBar,
        ) {
            this.method = this.cfg.getAuthMethod();
        }
        
    private showError(msg: string) {
        this.snackBar.open(
            msg,
            'OK',
            {
            duration: 100000000,
            }
        );
    }

    /* TODO custom errors with specific user messages */
    assistedToken() {
        this.auth.authenticateAT().subscribe(
        () => this.closeDialog(),
        e => this.showError('Inloggning med BankId misslyckades. Fel: "'
                            + e.message + '"')
        );
    }

    basic(user: string, pw: string, pnr: string) {
        this.auth.authenticateBasic(user, pw, pnr)
        .pipe(catchError(e => {
            if (e.status === 401) {
                return throwError(new Error('Fel användarnamn eller lösenord.'));
            } else {
                return throwError(e);
            }
        }))
        .subscribe(
            () => this.closeDialog(),
            e => this.showError(
                'Inloggning misslyckades. Fel: "' + e.message + '"'
            )
        );
    }

    /**
     * Closes dialog when user presses no
     */
    closeDialog(): void {
        this.dialogRef.close();
    }
}

