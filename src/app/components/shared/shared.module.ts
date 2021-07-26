import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { IonicModule } from '@ionic/angular';
import { ExpandableComponent } from '../expandable/expandable.component';
import { FooterComponent } from '../footer/footer.component';
import { TranslateModule } from '@ngx-translate/core';
import { TrackOrderComponent } from '../track-order/track-order.component';
import { AlertModelComponent } from '../alert-model/alert-model.component';
import { PdfViewerComponent } from '../pdf-viewer/pdf-viewer.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { FilterPipe } from 'src/app/pipes/filter.pipe';




@NgModule({
  declarations: [HeaderComponent, ExpandableComponent,FooterComponent,TrackOrderComponent,AlertModelComponent,PdfViewerComponent,FilterPipe],
  imports: [
    CommonModule,
    IonicModule,
    NgxExtendedPdfViewerModule,
    TranslateModule.forChild()
  ],
  exports: [
    HeaderComponent,
    ExpandableComponent,
    FooterComponent,
    TrackOrderComponent,
    AlertModelComponent,
    PdfViewerComponent,
    FilterPipe

  ]
})
export class SharedModule { 
}
