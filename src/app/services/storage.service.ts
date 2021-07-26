import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { CartDetails } from '../Model/cart-details.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  hcpCode: any;
  productDiscount: any;
  productData: any;
  private _storage: Storage | null = null;

  userEmail: string;
  userMobile: string;
  otpOnemail: boolean;
  prefDistFlag: boolean;
  cartDetails: CartDetails = new CartDetails();

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // Create and expose methods that users of this service can
  // call, for example:
  public set(key: string, value: any) {
    this._storage.set(key, value);
  }

  async get(key: any) {
    return await this.storage.get(key);
  }

  async clearData() {
    await this.storage.clear();
  }


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
