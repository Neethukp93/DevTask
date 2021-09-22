import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSelect } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { CoreModule } from 'src/app/core/core.module';
import { MasterService } from 'src/app/core/services/master.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [SharedModule, CoreModule, HttpClientTestingModule],
      providers: [UtilityService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check count of form controls', () => {
    let formElement =
      fixture.debugElement.nativeElement.querySelector('#userForm');
    let inputElements = formElement.querySelectorAll('input');
    expect(inputElements.length).toEqual(3);
    let selectElements = formElement.querySelectorAll('mat-select');
    expect(selectElements.length).toEqual(2);
  });

  it('should create initial userForm formgroup', () => {
    expect(component.userForm).toBeDefined();
    expect(component.userForm.get('monthlyIncome').value).toBe('');
    expect(component.userForm.get('requestedAmount').value).toBe('');
    expect(component.userForm.get('loanTerm').value).toBe('');
    expect(component.userForm.get('children').value).toBe('');
    expect(component.userForm.get('coapplicant').value).toBe('');
  });

  it('should display validation errors for form controls', () => {
    let formInputElement: HTMLInputElement[] =
      fixture.debugElement.nativeElement
        .querySelector('#userForm')
        .querySelectorAll('input');
    let formSelectElement: HTMLSelectElement[] =
      fixture.debugElement.nativeElement
        .querySelector('#userForm')
        .querySelectorAll('mat-select');
    let formMonthlyIncomeElement = formInputElement[0];
    let formRequestedAmountElement = formInputElement[1];
    let formLoanTermElement = formInputElement[2];
    let formChildrenElement = formSelectElement[0];
    let formCoApplicantelement = formSelectElement[1];
    formMonthlyIncomeElement.value = '30000';
    formRequestedAmountElement.value = '20000';
    formLoanTermElement.value = '24';
    formChildrenElement.value = '';
    formCoApplicantelement.value = '';
    formMonthlyIncomeElement.dispatchEvent(new Event('input'));
    formRequestedAmountElement.dispatchEvent(new Event('input'));
    formLoanTermElement.dispatchEvent(new Event('input'));
    formChildrenElement.dispatchEvent(new Event('change'));
    formCoApplicantelement.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const monthlyIncomeValueControl = component.userForm.get('monthlyIncome');
      expect(formMonthlyIncomeElement.value).toEqual(
        monthlyIncomeValueControl.value
      );
      expect(monthlyIncomeValueControl.errors).not.toBeNull();

      const requestedAmountControl = component.userForm.get('requestedAmount');
      expect(formRequestedAmountElement.value).toEqual(
        requestedAmountControl.value
      );
      expect(requestedAmountControl.errors).not.toBeNull();

      const loanTermControl = component.userForm.get('loanTerm');
      expect(formLoanTermElement.value).toEqual(loanTermControl.value);
      expect(loanTermControl.errors).not.toBeNull();

      const childrenControl = component.userForm.get('children');
      expect(formChildrenElement.value).toEqual(childrenControl.value);
      expect(childrenControl.errors).not.toBeNull();

      const coapplicantControl = component.userForm.get('coapplicant');
      expect(formChildrenElement.value).toEqual(coapplicantControl.value);
      expect(coapplicantControl.errors).not.toBeNull();

      expect(component.userForm.invalid).toBeTrue();
    });
  });

  it('should not display validation errors ', () => {
    let formInputElement: HTMLInputElement[] =
      fixture.debugElement.nativeElement
        .querySelector('#userForm')
        .querySelectorAll('input');
    let formMonthlyIncomeElement = formInputElement[0];
    let formRequestedAmountElement = formInputElement[1];
    let formLoanTermElement = formInputElement[2];
    let formChildrenElement = fixture.debugElement.queryAll(
      By.directive(MatSelect)
    )[0].componentInstance;
    fixture.detectChanges();
    let selectOptions = formChildrenElement.options._results;
    selectOptions[0]._element.nativeElement.click();
    fixture.detectChanges();
    let formCoApplicantElement = fixture.debugElement.queryAll(
      By.directive(MatSelect)
    )[1].componentInstance;
    fixture.detectChanges();
    let selectCoApplOptions = formCoApplicantElement.options._results;
    selectCoApplOptions[0]._element.nativeElement.click();
    fixture.detectChanges();
    formMonthlyIncomeElement.value = '500000';
    formRequestedAmountElement.value = '20000000';
    formLoanTermElement.value = '36';
    formMonthlyIncomeElement.dispatchEvent(new Event('input'));
    formRequestedAmountElement.dispatchEvent(new Event('input'));
    formLoanTermElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const monthlyIncomeValueControl = component.userForm.get('monthlyIncome');
      expect(formMonthlyIncomeElement.value).toEqual(
        monthlyIncomeValueControl.value
      );
      expect(monthlyIncomeValueControl.errors).toBeNull();

      const requestedAmountControl = component.userForm.get('requestedAmount');
      expect(formRequestedAmountElement.value).toEqual(
        requestedAmountControl.value
      );
      expect(requestedAmountControl.errors).toBeNull();

      const loanTermValueControl = component.userForm.get('loanTerm');
      expect(formLoanTermElement.value).toEqual(loanTermValueControl.value);
      expect(loanTermValueControl.errors).toBeNull();

      const childrenControl = component.userForm.get('children');
      expect(formChildrenElement.value).toEqual(childrenControl.value);
      expect(childrenControl.errors).toBeNull();

      const coapplicantControl = component.userForm.get('coapplicant');
      expect(formChildrenElement.value).toEqual(coapplicantControl.value);
      expect(coapplicantControl.errors).toBeNull();

      expect(component.userForm.valid).toBeTrue();
    });
  });

  it('should call onSubmit method when ui validation is success', () => {
    component.userForm.controls['monthlyIncome'].setValue(5000000);
    component.userForm.controls['requestedAmount'].setValue(80000000);
    component.userForm.controls['loanTerm'].setValue(40);
    component.userForm.controls['children'].setValue('NONE');
    component.userForm.controls['coapplicant'].setValue('NONE');
    let service = fixture.debugElement.injector.get(MasterService);
    spyOn(service, 'post').and.callFake(() => {
      return of({
        statusCode: 200,
      });
    });
    component.onSubmit();
    expect(component.resp).toEqual({ statusCode: 200 });
  });

  it('should return no validation errors from backend', () => {
    component.userForm.controls['monthlyIncome'].setValue(5000000);
    component.userForm.controls['requestedAmount'].setValue(80000000);
    component.userForm.controls['loanTerm'].setValue(40);
    component.userForm.controls['children'].setValue('NONE');
    component.userForm.controls['coapplicant'].setValue('NONE');
    let service = fixture.debugElement.injector.get(MasterService);

    spyOn(service, 'post').and.returnValue(
      throwError(
        new HttpErrorResponse({
          error: { general: {}, fields: [] },
          status: 400,
        })
      )
    );
    component.onSubmit();
    expect(component.userForm.valid).toBeTrue();
  });

  it('should return field validation errors from backend', () => {
    component.userForm.controls['monthlyIncome'].setValue(7000000);
    component.userForm.controls['requestedAmount'].setValue(20000000);
    component.userForm.controls['loanTerm'].setValue(345);
    component.userForm.controls['children'].setValue('NONE');
    component.userForm.controls['coapplicant'].setValue('NONE');
    let service = fixture.debugElement.injector.get(MasterService);

    spyOn(service, 'post').and.returnValue(
      throwError(
        new HttpErrorResponse({
          error: {
            general: {},
            fields: [
              {
                params: 'requestedAmount',
                message:
                  'Requested Amount too low. Minimum loan of 20000 available',
              },
            ],
          },
          status: 400,
        })
      )
    );
    component.onSubmit();
    expect(component.userForm.invalid).toBeTrue();
    expect(
      component.userForm.get('requestedAmount').errors['serverError']
    ).toBe('Requested Amount too low. Minimum loan of 20000 available');
  });
});
