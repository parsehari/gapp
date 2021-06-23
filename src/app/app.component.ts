import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuController } from '@ionic/angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages: any;

  constructor(private translate: TranslateService, private menu: MenuController) {
    translate.setDefaultLang('en');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en').subscribe((result: any) => {
      this.loadMenu();
    });


  }

  loadMenu() {
    this.appPages = [
      { title: this.translate.instant("sideMenu.placeOrder"), url: '/folder/Inbox', icon: 'mail' },
      { title: this.translate.instant("sideMenu.obyD"), url: '/folder/Outbox', icon: 'paper-plane' },
      { title: this.translate.instant("sideMenu.mPreD"), url: '/folder/Favorites', icon: 'heart' },
      { title: this.translate.instant("sideMenu.myOrder"), url: 'my-orders', icon: 'archive' },
      { title: this.translate.instant("sideMenu.logout"), url: 'login', icon: 'trash' }
    ];

  }
}
