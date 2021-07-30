import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommonService } from 'src/app/services/common.service';
import { DomSanitizer} from '@angular/platform-browser';
import { rotateOutUpRightAnimation } from 'angular-animations';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss'],
})
export class PdfViewerComponent implements OnInit {
 @Input() url:string;
  constructor(private mdl:ModalController,
    private commn:CommonService,
    private sanitizer:DomSanitizer
    ) {
      pdfDefaultOptions.assetsFolder = 'bleeding-edge';

   }
   closeModel(){
   this.mdl.dismiss({
    'dismissed': true
   })
   }
  ngOnInit() {}

  getUrl(urlStr):any{
    return this.sanitizer.bypassSecurityTrustResourceUrl(urlStr);
  }
}
