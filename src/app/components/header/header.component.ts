import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
// import { StorageService } from 'src/app/services/storage.service';
// import { UtilityService } from 'src/app/services/utility.service';
// import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() heading: string;
  @Input() showMenuButton: boolean = false;
  @Input() showSubHeader: boolean = false;
  @Input() showNotification: boolean = false;
  @Input() showSubHeaderIconColumn: boolean = true;
  @Input() showBackButton: boolean = false;
  @Input() showCloseModalButton: boolean = false;
  @Input() showInstruction: boolean = false;
  @Input() showNotes: boolean = false;
  @Input() showPaymentNote: boolean = false;
  @Input() showSearch: boolean = false;
  @Input() showCart: boolean = false;
  @Input() issettingIcon: boolean = false;

  @Output() notes: EventEmitter<null> = new EventEmitter();
  @Output() information: EventEmitter<null> = new EventEmitter();
  @Output() notifications: EventEmitter<null> = new EventEmitter();
  @Output() paymentModes: EventEmitter<null> = new EventEmitter();


  badgeCount: any;
  esopLogo: any;
  companyLogo: any;
  constructor(public alertController: AlertController,
    //  private storageService: StorageService,
    // private utilityService: UtilityService, 
    // public commonService: CommonService, 
    public router: Router,
    public modalController: ModalController) {
    // let loginData = this.storageService.getLoginData();
    // this.esopLogo = utilityService.decrypt(loginData['ownLogoURL']);
    // this.companyLogo = utilityService.decrypt(loginData['cmpLogoURL']);

  }

  ngOnInit() {
    console.log("subheader ", this.showSubHeader);
    // console.log("badge count ");
    // this.storageService.getNotificationBadge().subscribe(badge => {
    //   console.log("badge count ", badge);

    //   this.badgeCount = badge;
    // })
    // this.badgeCount = this.storageService.getBadge();
  }
  displayNotes() {
    if (this.showNotes)
      this.notes.emit();
  }

  displayInfo() {
    if (this.showInstruction)
      this.information.emit();
  }

  showNotifications() {
    // // this.notifications.emit();
    // if (this.commonService.isOnline()) {
    //   this.router.navigate(['/notification']);
    // }
  }

  showPaymentModes() {
    if (this.showPaymentNote)
      this.paymentModes.emit();
  }
  dismissModal() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
