import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  constructor() {}

  generateDropdownItems(inputArr: any[]) {
    return inputArr.map((ele) => ({
      label: ele,
      value: ele.split(' ').join('_'),
    }));
  }
}
