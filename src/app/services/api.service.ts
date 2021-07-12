import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
//import { HTTP } from '@ionic-native/http/ngx';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from './storage.service';
import { CartModel } from '../Model/cart.model';



@Injectable({
  providedIn: 'root'
})

/**
 * Interceptor added for the user session expiry or any server activity for 401
 * 
 * @example HTTP service call use to watch interceptor for the application
 * 
 * @returns service response related to 401
 */
export class InterceptService implements HttpInterceptor {
  constructor(public router: Router, private alertController: AlertController, private translate: TranslateService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(tap(event => {
      if (event instanceof HttpResponse) {
        // if (event.status == 200) {
        //   success code
        // }
      }
    }, error => {
      console.log("Error captured in Interceptor");
      //this.analytics.trackEvent("Web Api Error", { Error: error['error']['error_description'] });
      if (error.status == 401 && this.router.url != '/login') {
        // this.analytics.trackEvent("Session expired", { Error: "Session Expired" });
        let header = this.translate.instant("common.sessionExpired");
        let message = this.translate.instant("common.sessionExpiredMessage");
        let okayText = this.translate.instant("common.okay");
        this.presentOneButtonAlert(header, message, okayText)
      }
      // if(error.status==500){

      // }
    })
    )
  };

  /**
   * This method is use to show the common alert prompt for the user on any confirm button
   * @param header header title for the prompt
   * @param message message description for the prompt
   * @param buttonMsg button text message
   */
  async presentOneButtonAlert(header, message, buttonMsg) {
    let alert = await this.alertController.create({

      header: header,
      message: message,
      buttons: [
        {
          text: buttonMsg,
          cssClass: 'notes-button',
          handler: () => {
            this.router.navigate(['/login']);
          }
        }
      ]

    });
    alert.present();
  }
}


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  /**
   * Global flag used for native http calls for all API
   */
  public nativeCall: boolean = false;
  /**
   * Global header options set for all http request option params
   */
  public httpOptions: any;
  /**
   * Global header options set for all advanced http request option params
   */
  public advanceHttpHeader: any;
  /**
   * Global variable set for access token
   */
  public acces_token: any;
  /**
   * Global variable set for access token type
   */
  public token_type: any;
  /**
   * Application server base url
   */
  //private baseURL = 'https://dev.api.gsk.com/Pharmatech/Vaxikart/Login/';


  private baseURL = 'https://dev.api.gsk.com/Pharmatech/Vaxikart/';

  /**
   * All API endpoints are defined below
   */
  public loginAPI = 'Login/VerifyUserTnC';
  public GetTncDetails = "Login/GetTncDetails";
  public insertTnC = "Login/InsertTnC";
  public SendOTP = "Login/SendOTP";
  public validateOtp = "Login/VerifyOTP";
  public getCartAPI = "Product/GetCart";
  public getGSTdetail = "Product/GetGSTDetail";
  public myOrders = "Order/GetAllOrdersByHCP";
  public saveOrder = "Order/SaveOrderData";
  public getOrderDetail = "Order/GetOrderDetailByOrderNo";
  public GetInvoiceDetailByOrderNo = "/Order/GetInvoiceDetailByOrderNo";

  // distributor api
  public getDistributorURL = "Distributor/GetDistributorList";
  public getProductURL = 'Product/GetProductList';
  public insertDistributorURL = 'Distributor/InsertDistributorPreference';
  public saveCartURL = 'Product/SaveCart';
  public getDiscount = 'Product/GetDiscountList';
  public getPDistributorPrice = 'Distributor/GetPriceWrtPrefDistributor';
  public removeItemURL = 'Product/RemoveCartProduct';
  public getDistributorProduct = 'Distributor/GetProductWrtDistributor';

  constructor(private httpClient: HttpClient, private storageService: StorageService, public router: Router, private alertController: AlertController, private translate: TranslateService) {

  }

  /**
   * get method used for http call 
   * @example called from the javascript function where to get anything or update to the server
   * ex. this.apiservice.getDataService(param1,param2,param3).subscribe(()=>{
   * })
   * @param url api url
   * @param myObject object to pass api
   * @param setHeaderContent any header params set for api
   */
  getDataService(url: string, type?: any): Observable<any> {
    if (type) {
      this.httpOptions.headers = this.httpOptions.headers.set('productcodes', type);
    }
    return this.httpClient.get(this.baseURL + url, this.httpOptions);
  }

  /**
   * post method used for http call 
   * @example called from the javascript function where to post anything or update to the server
   * ex. this.apiservice.getDataService(param1,param2,param3).subscribe(()=>{
   * })
   * @param url api url
   * @param data object to pass api
   * @param setHeaderContent any header params set for api
   */
  postDataService(url: string, data: any): Observable<any> {
    console.log("url :", url);
    console.log("base url :", this.baseURL);
    console.log("data :", data);
    console.log("http option :", this.httpOptions);
    return this.httpClient.post(this.baseURL + url, data, this.httpOptions);
  }
  /**
     * put method used for http call 
     * @example called from the javascript function where to put anything or update to the server
     * ex. this.apiservice.putDataService(param1,param2,param3).subscribe(()=>{
     * })
     * @param url api url
     * @param data object to pass api
     * @param setHeaderContent any header params set for api
     */
  putDataService(url: string, data: any) {
    return this.httpClient.put(this.baseURL + url, data, this.httpOptions);
  }
  /**
     * delete method used for http call 
     * @example called from the javascript function where to delete anything or update to the server
     * ex. this.apiservice.deleteDataService().subscribe(()=>{
     * })
     * @param url api url
     * @param data object to pass api
     * @param setHeaderContent any header params set for api
     */
  deleteDataService(url: string) {
    // this.httpOptions.body = data;

    return this.httpClient.delete(this.baseURL + url, this.httpOptions);
  }


  /**
     * get method used for advanced http call 
     * @example called from the javascript function where to get anything or update to the server
     * ex. this.apiservice.getDataServiceNative(param1,param3).subscribe(()=>{
     * })
     * @param url api url
     * @param setHeaderContent any header params set for api
     */
  /*
getDataServiceNative(url: string, setHeaderContent?: any) {
  return new Promise((resolve, reject) => {
    this.advanceHttp.setServerTrustMode("nocheck").then((data) => {
      this.advanceHttp.setDataSerializer('json');
      if (setHeaderContent == 'json') {
        this.advanceHttp.setHeader(this.baseURL, 'Content-Type', 'application/json');
      } else {
        this.advanceHttp.setHeader(this.baseURL, 'Content-Type', 'application/x-www-form-urlencoded');
      }
      this.advanceHttp.get(this.baseURL + url, {}, {}).then((resp: any) => {
        resp = JSON.parse(resp.data);
        resolve(resp);
      }, (err) => {
        console.log("Error captured in Interceptor", err);
        //  this.analytics.trackEvent("Web Api Error", { Error: err['error']['error_description'] });
        if (err.status == 401 && this.router.url != '/login') {
          //   this.analytics.trackEvent("Session expired", { Error: "Session Expired" });
          let header = this.translate.instant("common.sessionExpired");
          let message = this.translate.instant("common.sessionExpiredMessage");
          let okayText = this.translate.instant("common.okay");
          this.presentOneButtonAlert(header, message, okayText)
        }
        reject(err);
      });
    }).catch((err) => {
      console.log("in error ")
      reject(err);
    });
  });
}*/
  /**
     * post method used for advanced http call 
     * @example called from the javascript function where to post anything or update to the server
     * ex. this.apiservice.postDataServiceNative(param1,param2,param3).subscribe(()=>{
     * })
     * @param url api url
     * @param dataObj object to pass api
     * @param setHeaderContent any header params set for api
     */
  /*
postDataServiceNative(url: string, dataObj: any, setHeaderContent?: any) {
  return new Promise((resolve, reject) => {
    this.advanceHttp.setServerTrustMode("nocheck").then((data) => {
      this.advanceHttp.setDataSerializer('urlencoded');
      if (setHeaderContent == 'json') {
        this.advanceHttp.setHeader(this.baseURL, 'Content-Type', 'application/json');
      } else {
        this.advanceHttp.setHeader(this.baseURL, 'Content-Type', 'application/x-www-form-urlencoded');
      }
      console.log('dataObj ', dataObj);
      this.advanceHttp.post(this.baseURL + url, dataObj, {}).then((resp: any) => {
        console.log("API response ", resp);
        resp = JSON.parse(resp.data);
        resolve(resp);
      }, (err) => {
        console.log("Error captured in Interceptor", err);
        //   this.analytics.trackEvent("Web Api Error", { Error: err['error']['error_description'] });
        if (err.status == 401 && this.router.url != '/login') {
          //     this.analytics.trackEvent("Session expired", { Error: "Session Expired" });
          let header = this.translate.instant("common.sessionExpired");
          let message = this.translate.instant("common.sessionExpiredMessage");
          let okayText = this.translate.instant("common.okay");
          this.presentOneButtonAlert(header, message, okayText)
        }
        reject(err);
      });
    }).catch((err) => {
      reject(err);
    });
  });
}*/
  /**
     * post method used for advanced http call 
     * @example called from the javascript function where to post anything or update to the server
     * ex. this.apiservice.putDataServiceNative(param1,param2,param3).subscribe(()=>{
     * })
     * @param url api url
     * @param dataObj object to pass api
     * @param setHeaderContent any header params set for api
     */
  /*
putDataServiceNative(url: string, dataObj: any, setHeaderContent?: any) {
  return new Promise((resolve, reject) => {
    this.advanceHttp.setServerTrustMode("nocheck").then((data) => {
      this.advanceHttp.setDataSerializer('urlencoded');
      if (setHeaderContent == 'json') {
        this.advanceHttp.setHeader(this.baseURL, 'Content-Type', 'application/json');
      } else {
        this.advanceHttp.setHeader(this.baseURL, 'Content-Type', 'application/x-www-form-urlencoded');
      }
      console.log('dataObj ', dataObj);
      this.advanceHttp.put(this.baseURL + url, dataObj, {}).then((resp: any) => {
        console.log("API response ", resp);
        resp = JSON.parse(resp.data);
        resolve(resp);
      }, (err) => {
        console.log("Error captured in Interceptor", err);
        //  this.analytics.trackEvent("Web Api Error", { Error: err['error']['error_description'] });
        if (err.status == 401 && this.router.url != '/login') {
          //  this.analytics.trackEvent("Session expired", { Error: "Session Expired" });
          let header = this.translate.instant("common.sessionExpired");
          let message = this.translate.instant("common.sessionExpiredMessage");
          let okayText = this.translate.instant("common.okay");
          this.presentOneButtonAlert(header, message, okayText)
        }
        reject(err);
      });
    }).catch((err) => {
      reject(err);
    });
  });
}*/
  /**
 * @ignore 
 */
  /*
    getDataServiceWithQueryParametersNative(url: string, query, setHeader?: boolean) {
      return new Promise((resolve, reject) => {
        this.advanceHttp.setServerTrustMode("nocheck").then((data) => {
          this.advanceHttp.setDataSerializer('urlencoded');
          if (setHeader) {
            this.advanceHttp.setHeader('*', 'Authorization', 'Bearer' + ' ' + this.acces_token);
            this.advanceHttp.setHeader(this.baseURL, 'Content-Type', 'application/x-www-form-urlencoded');
          }
          this.advanceHttp.get(this.baseURL + url + query, {}, {}).then((resp: any) => {
            console.log("API response ", resp);
            resp = JSON.parse(resp.data);
            resolve(resp);
          }, (err) => {
            reject(err);
          });
        }).catch((err) => {
          reject(err);
        });
      });
    }*/
  /**
     * post method used for advanced http call 
     * @example called from the javascript function where to delete anything or update to the server
     * ex. this.apiservice.deleteDataServiceNative(param1,param2,param3).subscribe(()=>{
     * })
     * @param url api url
     * @param dataObj object to pass api
     * @param setHeaderContent any header params set for api
     *//*
deleteDataServiceNative(url: string, dataObj: any, setHeaderContent?: any) {
return new Promise((resolve, reject) => {
this.advanceHttp.setServerTrustMode("nocheck").then((data) => {

this.advanceHttp.setDataSerializer('urlencoded');
if (setHeaderContent == 'json') {
this.advanceHttp.setHeader(this.baseURL, 'Content-Type', 'application/json');
} else {
this.advanceHttp.setHeader(this.baseURL, 'Content-Type', 'application/x-www-form-urlencoded');
}

console.log('dataObj ', dataObj);
this.advanceHttp.delete(this.baseURL + url, dataObj, {}).then((resp: any) => {
console.log("API response ", resp);
resp = JSON.parse(resp.data);
resolve(resp);
}, (err) => {
console.log("Error captured in Interceptor", err);
// try {
//   this.analytics.trackEvent("Web Api Error", { Error: err['error']['error_description'] });
// } catch (error) {
//   console.log("Catch error-", error);
// }
if (err.status == 401 && this.router.url != '/login') {
//  this.analytics.trackEvent("Web Api Error", { Error: err['error']['error_description'] });
//  this.analytics.trackEvent("Session expired", { Error: "Session Expired" });
let header = this.translate.instant("common.sessionExpired");
let message = this.translate.instant("common.sessionExpiredMessage");
let okayText = this.translate.instant("common.okay");
this.presentOneButtonAlert(header, message, okayText)
}
reject(err);
});
}).catch((err) => {
reject(err);
});
});
}*/

  /**
   * this function use to set headers for all http request
   * @example called from javascript function
   * ex. this.apiservice.setUserData(param1,param2);
   * @param token token from api request
   * @param type type of the token ex.bearer
   */
  setUserData(token: any) {
    this.acces_token = token;
    if (this.nativeCall) {
      // this.advanceHttp.setHeader('*', 'Authorization', type + ' ' + token);
      // this.advanceHttp.setHeader(this.baseURL, 'Content-Type', 'application/x-www-form-urlencoded');
    } else {
      this.httpOptions = {
        headers: new HttpHeaders({
          //'Content-Type': 'application/json',
          'Token': token,
          'HcpCode': this.storageService.getHcpCode(),
          'apikey': 'YTAxZTU2NWMtZDM5NS00M2Q3LTkwYzgtYmZiOTFmMzc0OTk3nM391W7QykFhd0OEO3Il6r-VXfP1lDOad7Jlq8FiprIe'
        })
      };
    }
  }
  /**
   * this function use to set the login header to the blank or empty
   * @example called from the javascript function
   * ex. this.apiservice.setLoginHeader()
   * @returns no return
   */
  setLoginHeader() {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'apikey': 'YTAxZTU2NWMtZDM5NS00M2Q3LTkwYzgtYmZiOTFmMzc0OTk3nM391W7QykFhd0OEO3Il6r-VXfP1lDOad7Jlq8FiprIe'
      })
    };
  }

  //************************ / SET HEADER FOR PREFERRED DISTRIBUTOR *************************
  setDistributorHeader() {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'apikey': 'YTAxZTU2NWMtZDM5NS00M2Q3LTkwYzgtYmZiOTFmMzc0OTk3nM391W7QykFhd0OEO3Il6r-VXfP1lDOad7Jlq8FiprIe',
        'HcpCode': this.storageService.getHcpCode(),
        'Token': this.acces_token
      })
    };
  }
  /**
   * @ignore 
   */
  getDataServiceWithQueryParameters(url: string, query) {
    let reqUrl = this.baseURL + url + query;
    return this.httpClient.get(reqUrl, this.httpOptions);
  }
  /**
   * @ignore 
   */
  async presentOneButtonAlert(header, message, buttonMsg) {
    let alert = await this.alertController.create({

      header: header,
      message: message,
      buttons: [
        {
          text: buttonMsg,
          cssClass: 'notes-button',
          handler: () => {
            this.router.navigate(['/login']);
          }
        }
      ]

    });
    alert.present();
  }
}
