import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MasterService } from 'src/app/core/services/master.service';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';
import { API_ENDPOINT } from 'src/app/shared/constants/api-endpoint.const';
import {
  CHILDREN_ARR,
  COAPPLICANT_ARR,
} from 'src/app/shared/constants/app.const';
import { NOTIFICATION } from 'src/app/shared/constants/notification.const';
import { LoanSucess } from 'src/app/shared/models/loan.model';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  userForm: FormGroup;
  childrenOptions = [];
  coApplicantOptions = [];
  resp;
  constructor(
    private fb: FormBuilder,
    private utility: UtilityService,
    private masterService: MasterService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.childrenOptions = this.utility.generateDropdownItems(CHILDREN_ARR);
    this.coApplicantOptions =
      this.utility.generateDropdownItems(COAPPLICANT_ARR);
    this.userForm = this.fb.group({
      monthlyIncome: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9.,]+$/),
          Validators.min(500000),
        ],
      ],
      requestedAmount: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]\d*$/),
          Validators.min(20000000),
        ],
      ],
      loanTerm: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]\d*$/),
          Validators.min(36),
          Validators.max(360),
        ],
      ],
      children: ['', [Validators.required]],
      coapplicant: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      let body = this.userForm.value;
      this.masterService
        .post(environment.base_url + API_ENDPOINT.SAVE_DETAILS, body)
        .subscribe(
          (res: LoanSucess) => {
            this.resp = res;
            this.openDialog(this.resp);
          },
          (err) => {
            if (err instanceof HttpErrorResponse) {
              if (err.status === 400) {
                this.openSnackBar(
                  NOTIFICATION.VALIDATION_ERRORS,
                  NOTIFICATION.FAILURE
                );
                this.handleErrors(err.error);
              } else {
                this.openSnackBar(
                  NOTIFICATION.SAVE_FAILURE,
                  NOTIFICATION.FAILURE
                );
              }
            }
          }
        );
    }
  }

  openDialog(respData: LoanSucess): void {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '600px',
      height: '200px',
      data: {
        title: 'You are Eligible',
        message: `Hey, You are eligible for a Loan Amount up to <strong> ${respData.loanAmount} </strong> with Interest Rate of <strong>${respData.interestRate}</strong>`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5 * 1000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  handleErrors(errorObj: any) {
    if (errorObj.general && Object.keys(errorObj.general).length !== 0) {
      this.openSnackBar(NOTIFICATION.SAVE_FAILURE, NOTIFICATION.FAILURE);
    } else if (errorObj?.fields.length > 0) {
      const ValidationError = errorObj.fields;
      ValidationError.forEach((controlObj) => {
        const formControl = this.userForm.get(controlObj.params);
        if (formControl) {
          formControl.setErrors({ serverError: controlObj.message });
        }
      });
    }
  }
}
