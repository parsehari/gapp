import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/common.service';
import { ModelInfoComponent } from 'src/app/components/model-info/model-info.component';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public loginInput: string;

  constructor(private modelCtrl: ModalController, private menu: MenuController,
    private commonServc: CommonService) {
    this.menu.enable(false);

  }

  ngOnInit() {
  }


  async showTermsAndConditions() {
    console.log("login ", this.loginInput)
    if (!this.loginInput) {
      this.commonServc.showToast("Enter registered Mobile No. or Email Id");
      return;
    }
    const model = await this.modelCtrl.create({
      component: ModelInfoComponent,
      componentProps: {
        "loginInput": this.loginInput
      }

    })
    return await model.present();
  }

}
