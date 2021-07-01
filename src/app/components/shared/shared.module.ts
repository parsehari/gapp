import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { IonicModule } from '@ionic/angular';
import { ExpandableComponent } from '../expandable/expandable.component';
import { FooterComponent } from '../footer/footer.component';
import { TranslateModule } from '@ngx-translate/core';
import { TrackOrderComponent } from '../track-order/track-order.component';




@NgModule({
  declarations: [HeaderComponent, ExpandableComponent,FooterComponent,TrackOrderComponent],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule.forChild(),
  ],
  exports: [
    HeaderComponent,
    ExpandableComponent,
    FooterComponent,
    TrackOrderComponent

  ]
})
export class SharedModule { }
