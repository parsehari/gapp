import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  hcpCode: any;
  constructor() { }

  setHcpCode(code) {
    this.hcpCode = code;
  }

  getHcpCode() {
    return this.hcpCode;
  }

}
