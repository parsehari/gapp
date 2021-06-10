import { Injectable } from '@angular/core';
import { CanLoad, Router, ActivatedRoute, NavigationEnd, NavigationStart } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { CommonService } from './common.service';
import { Events } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';


@Injectable({
  providedIn: 'root'
})
export class AuthGaurdService implements CanLoad {
  public header: any;
  public balance: any;
  public buttonText: any;

  constructor(private router: Router, public event: Events, public commonService: CommonService, private activatedRoute: ActivatedRoute, public translateService: TranslateService) {
  }

  canLoad(route: Route): boolean {
    console.log("in login")
    if (this.commonService.isOnline()) {
      return true;
    }
    else {
      return false;
    }
  }
} 