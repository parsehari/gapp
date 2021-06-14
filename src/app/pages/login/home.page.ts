import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ModelInfoComponent } from 'src/app/components/model-info/model-info.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public sexe: string;
  constructor(private modelCtrl : ModalController) {

  }
  
  async showTermsAndConditions(){
    const model = await this.modelCtrl.create({
      component:ModelInfoComponent
    })
    return await model.present();
  }

}
