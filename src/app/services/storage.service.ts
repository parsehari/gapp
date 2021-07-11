import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  hcpCode: any;
  productDiscount: any;
  productData: any;

  prefDistFlag: boolean;
  constructor() { }

  setHcpCode(code) {
    this.hcpCode = code;
  }

  getHcpCode() {
    return this.hcpCode;
  }

  setProductDiscount(data: any) {
    this.productDiscount = data;
  }

  getProductDiscount() {
    return this.productDiscount;
  }

  setProductData(data: any) {
    this.productData = data;
  }

  getProductData() {
    return this.productData;
  }

}
