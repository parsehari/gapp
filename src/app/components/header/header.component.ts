import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';


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
  searchBarSize: any;
  settingIconSize: any;
  constructor(public alertController: AlertController,
    public router: Router,
    public modalController: ModalController,
    private commonService: CommonService
  ) {
  }

  ngOnInit() {
    if (this.issettingIcon) {
      this.searchBarSize = '10';
      this.settingIconSize = '2';
    } else {
      this.searchBarSize = '12';
      this.settingIconSize = '0';
    }
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

  goBack() {
    console.log('previous ', this.commonService.previousUrl);
    this.router.navigate([this.commonService.previousUrl]);
  }

}
