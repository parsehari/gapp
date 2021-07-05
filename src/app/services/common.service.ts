import { Injectable } from '@angular/core';
import { LoadingController, ToastController, PopoverController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationEnd } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';


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
    public toastController: ToastController,
    public alertController: AlertController,
    public popoverController: PopoverController,
    public translateService: TranslateService,
    public router: Router,
    private sanitizer:DomSanitizer
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

  // logEvent(name: string, params: any) {
  //   this.analytics.trackEvent(name, params)
  //     .then((res: any) => console.log(res))
  //     .catch((error: any) => console.error(error));
  // }

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

  getImageURLFromBase64(imageData):any{
    var imageSource = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${imageData}`);
    return imageSource;
  }

}
