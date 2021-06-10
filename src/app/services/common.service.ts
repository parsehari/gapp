import { Injectable } from '@angular/core';
import { LoadingController, ToastController, PopoverController } from '@ionic/angular';
import { ApiService } from './api.service';
import { AlertController } from '@ionic/angular';
import { resolve } from 'url';
import { StorageService } from './storage.service';
import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationEnd } from '@angular/router';
import { UtilityService } from './utility.service';
import { AppCenterAnalytics } from '@ionic-native/app-center-analytics/ngx';


@Injectable({
  providedIn: 'root'
})
export class CommonService {
  isLoading: boolean = false;
  isAlertOpen: boolean = false;
  loaderToShow: any;
  versionCode: any;
  versionNum: any;
  toast: any;
  status = 'ONLINE';
  isConnected: boolean;
  previousUrl: string;
  currentUrl: string;
  header: any;
  balance: any;
  buttonText: any;
  alert: any;
  passReset: boolean = true;
  constructor(private loadingController: LoadingController,
    public apiService: ApiService,
    public toastController: ToastController,
    public alertController: AlertController,
    public popoverController: PopoverController,
    public storageService: StorageService,
    public translateService: TranslateService,
    public router: Router,
    public utilityService: UtilityService,
    private analytics: AppCenterAnalytics
  ) {

    this.currentUrl = router.url;
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      }
    });
  }

  isOnline() {
    let header = this.translateService.instant("common.alert")
    let balance = this.translateService.instant("common.noInternetMessage");
    let buttonText = this.translateService.instant("common.okbtn");
    console.log("header message ", header);
    if (navigator.onLine)
      this.isConnected = true;
    else
      this.isConnected = false;
    if (this.isConnected) {
      return true;
    } else {
      if (this.isLoading) {
        this.hideLoader();
      }
      this.presentOneButtonAlert(header, balance, buttonText);
      return false;
    }
  }


  async presentOneButtonAlert(header, message, buttonMsg) {
    return new Promise(async (resolve) => {
      this.alert = await this.alertController.create({

        header: header,
        backdropDismiss: false,
        message: message,
        buttons: [
          {
            text: buttonMsg,
            cssClass: 'notes-button',
            handler: () => {
              resolve(buttonMsg);
            }
          }
        ]

      });
      this.isAlertOpen = true;
      this.alert.present();
    })
  }

  async closeAlert() {
    this.isAlertOpen = false;
    return await this.alertController.dismiss().then(() => console.log('dismissed'));
  }


  async confirmAlert(header, message, buttonMsg) {
    this.alert = await this.alertController.create({
      header: 'Confirm!',
      message: message || 'Message <strong>text</strong>!!!',
      backdropDismiss: false,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });
    this.isAlertOpen = true;
    await this.alert.present();
  }

  logEvent(name: string, params: any) {
    this.analytics.trackEvent(name, params)
      .then((res: any) => console.log(res))
      .catch((error: any) => console.error(error));
  }

  public getPreviousUrl() {
    return this.previousUrl;
  }

  showLoader(msg?) {
    this.isLoading = true;
    this.loaderToShow = this.loadingController.create({
      message: msg || 'Please wait',
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }

  async hideLoader() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then(() => console.log('dismissed'));
  }
  async presentAlertConfirm(header, message, btnText1, btnText2): Promise<any> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header: header,
        message: message,
        buttons: [
          {
            text: btnText1,
            role: 'cancel',
            cssClass: 'one-button',
            handler: () => {
              resolve(btnText1);
            }
          }, {
            text: btnText2,
            role: 'ok',
            cssClass: 'two-button',
            handler: () => {
              resolve(btnText2);
            }
          }
        ]
      });
      this.isAlertOpen = true;
      await alert.present();
    })
  }

  authUserAccess(method: any, securityCheck?: false, login?: any) {

    return new Promise((resolve, reject) => {
      var val = this.storageService.getLoginData();
      //method = "0";
      //val.isFirstTimeLogin = "1";
      // val.isForcedPassword = "1";
      // val.isEulaApplicable = "1";
      // val.isEulaAccepted = "0";
      //val.isConsentApplicable = "1";
      //val.isConsentAccepted = "0";
      // val.isEmpConsent = "404";
      if (val.isFirstTimeLogin == "1") {
        if (method == "0") {
          if (val.isForcedPassword == "1") {
            resolve({ 'type': 'firstTimeLogin', 'url': '/password-reset', isFirstTime: val.isFirstTimeLogin })
          }
          // if (val.isEmpConsent == "404") {
          //   resolve({ 'type': 'taxConsentAlert', 'url': '/login', empConsent: val.msgConsent });
          // }
          else {
            if (val.isEulaApplicable == "1") {
              if (val.isEulaAccepted == "1") {
                if (val.isConsentApplicable == "1") {
                  if (val.isConsentAccepted == "1") {
                    resolve({ 'type': 'dashboard', 'url': '/dashboard' });
                  } else {
                    val.ConsentFileURL = this.utilityService.decrypt(val.ConsentFileURL);
                    resolve({ 'type': 'consent', 'url': val.ConsentFileURL });
                  }
                } else {
                  resolve({ 'type': 'dashboard', 'url': '/dashboard' });
                }
              } else {
                val.EulaFileURL = this.utilityService.decrypt(val.EulaFileURL);
                resolve({ 'type': 'eula', 'url': val.EulaFileURL });
              }
            } else if (val.isConsentApplicable == "1") {
              if (val.isConsentAccepted == "1") {
                resolve({ 'type': 'dashboard', 'url': '/dashboard' });
              } else {
                val.ConsentFileURL = this.utilityService.decrypt(val.ConsentFileURL);
                resolve({ 'type': 'consent', 'url': val.ConsentFileURL });
              }
            } else {
              resolve({ 'type': 'dashboard', 'url': '/dashboard' });
            }
          }
        } else {
          method == "2" ? resolve({ 'type': 'firstTimeLogin', 'url': '/security', isFirstTime: val.isFirstTimeLogin }) : resolve({ 'type': 'firstTimeLogin', 'url': '/two-factor-auth', isFirstTime: val.isFirstTimeLogin });
        }
      } else {
        if (val.isForcedPassword == "1") {
          resolve({ 'type': 'firstTimeLogin', 'url': '/password-reset', isFirstTime: val.isFirstTimeLogin })
        }
        if (method == "2" && securityCheck) {
          resolve({ 'type': 'firstTimeLogin', 'url': '/security', isFirstTime: val.isFirstTimeLogin });
        } else if (method == "2" && !securityCheck && login == "login") {
          resolve({ 'type': 'firstTimeLogin', 'url': '/login', isFirstTime: val.isFirstTimeLogin });
        }
        else if (method == "1" && securityCheck) {
          resolve({ 'type': 'firstTimeLogin', 'url': '/two-factor-auth', isFirstTime: val.isFirstTimeLogin });
        }
        // else if (val.isEmpConsent == "404") {
        //   resolve({ 'type': 'taxConsentAlert', 'url': '/login', empConsent: val.msgConsent });
        // }
        else {
          if (val.isEulaApplicable == "1") {
            if (val.isEulaAccepted == "1") {
              if (val.isConsentApplicable == "1") {
                if (val.isConsentAccepted == "1") {
                  resolve({ 'type': 'dashboard', 'url': '/dashboard' });
                } else {
                  val.ConsentFileURL = this.utilityService.decrypt(val.ConsentFileURL);
                  resolve({ 'type': 'consent', 'url': val.ConsentFileURL });
                }
              } else {
                resolve({ 'type': 'dashboard', 'url': '/dashboard' });
              }
            } else {
              val.EulaFileURL = this.utilityService.decrypt(val.EulaFileURL);
              resolve({ 'type': 'eula', 'url': val.EulaFileURL });
            }
          } else if (val.isConsentApplicable == "1") {
            if (val.isConsentAccepted == "1") {
              resolve({ 'type': 'dashboard', 'url': '/dashboard' });
            } else {
              val.ConsentFileURL = this.utilityService.decrypt(val.ConsentFileURL);
              resolve({ 'type': 'consent', 'url': val.ConsentFileURL });
            }
          } else {
            resolve({ 'type': 'dashboard', 'url': '/dashboard' });
          }
        }
      }
      //})
    })

  }

  setUserData(data: any) {
    this.storageService.setLoginData(data);
  }

  setFirstTimeLogin() {
    this.storageService.loginData.isFirstTimeLogin = "0";
  }

  checkConsent() {
    return new Promise((resolve, reject) => {
      resolve(this.storageService.loginData.isConsentApplicable);
    })
  }

  showToast(msg: any, time?: any) {
    this.toast = this.toastController.create({
      message: msg,
      mode: "md",
      duration: time || 5000
    }).then((toastData) => {
      toastData.present();
    });
  }
  HideToast() {
    this.toast = this.toastController.dismiss();
  }



}
