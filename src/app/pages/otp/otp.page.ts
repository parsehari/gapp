import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MenuController } from "@ionic/angular";
import { timer } from "rxjs";
import { ApiService } from "src/app/services/api.service";
import { CommonService } from "src/app/services/common.service";
import { StorageService } from "src/app/services/storage.service";

@Component({
  selector: "app-otp",
  templateUrl: "./otp.page.html",
  styleUrls: ["./otp.page.scss"],
})
export class OtpPage implements OnInit {
  [x: string]: any;
  location = "madison";
  otpOne = "";
  otpTwo = "";
  otpThree = "";
  otpFour = "";
  slideOpts = {
    speed: 400,
    autoplay: true,
  };
  mobileNumber: any;
  btnDisabled: any = true;
  loginData: any;
  loginType: any;
  otpTypeText: any;
  constructor(
    public menu: MenuController,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private apiService: ApiService,
    private commonService: CommonService,
    private storageService: StorageService

  ) { }

  ngOnInit() {
    this.loginData = this.activatedroute.snapshot.paramMap.get('loginData');
    this.loginType = this.activatedroute.snapshot.paramMap.get('type');
    if (this.loginType == "email") {
      this.otpTypeText = "Email";
    } else {
      this.otpTypeText = "SMS";
    }
    this.setTimer();
    this.getOTP();
  }

  ngOnDestroy() {
    this.countDown = null;
  }

  setTimer() {
    this.countDown = timer(0, this.tick).subscribe(() => --this.counter);
  }

  getOTP() {
    this.commonService.showLoader();
    var data = {
      "Mobile_Email": this.loginData,
      "OtpSendOn": ''
    }
    console.log(this.loginType);

    if (this.loginType == 'email') {
      data.OtpSendOn = "EMAIL"
    } else {
      data.OtpSendOn = "MOBILE"
    }
    this.apiService.postDataService(this.apiService.SendOTP, data)
      .subscribe((resp: any) => {
        console.log("response ", resp);
        this.processOTPSuccess(resp);
      }, (err) => {
        this.processOTPError(err);
      });
  }

  processOTPSuccess(data) {
    this.commonService.hideLoader();
    this.commonService.showToast(data.message + ' OTP ->' + data.success);
  }

  processOTPError(error) {
    this.commonService.hideLoader();
  }



  ionViewWillEnter() {
    this.menu.enable(false);
  }
  ionViewDidEnter() {
  }

  otpController(event, next, prev) {
    if (event.target.value.length < 1 && prev) {
      prev.setFocus();
    } else if (next && event.target.value.length > 0) {
      next.setFocus();
    } else {
      return 0;
    }
  }

  validateOTP() {
    let finalOTP: Number;
    console.log(
      "1,2,3,4--" +
      this.otpOne +
      ", " +
      this.otpTwo +
      ", " +
      this.otpThree +
      ", " +
      this.otpFour
    );
    if (
      this.otpOne === "" ||
      this.otpTwo === "" ||
      this.otpThree === "" ||
      this.otpFour === ""
    ) {
      this.commonService.showToast("Please enter valid OTP");
      return;
    } else
      finalOTP = Number.parseInt(
        this.otpOne +
        "" +
        this.otpTwo +
        "" +
        this.otpThree +
        "" +
        this.otpFour +
        ""
      );

    console.log("finalOTP", finalOTP);
    this.commonService.showLoader("Please wait");
    let data = {
      "HcpCode": this.storageService.getHcpCode(),
      "OTP": finalOTP.toString()
    };
    this.apiService
      .postDataService(this.apiService.validateOtp, data)
      .subscribe(
        (response: any) => {
          this.commonService.hideLoader();
          console.log("validateOtp Response-", response);
          this.apiService.setUserData(response.token);
          this.storageService.prefDistFlag = response._BO.prefDistFlag === "true" ? true : false;
          if(this.storageService.prefDistFlag){
            this.router.navigate(['/product-list']);
          }else{
            this.router.navigate(["/preferred-distributor"]);
          }
        },
        (err) => {
          console.log("error in page ", err);
          this.commonService.hideLoader();
          if (err.status == 400) this.commonService.showToast(err.message);
        }
      );
  }
  resendOTP(event) {
    if (event.action == "done") {
      this.btnDisabled = false;
    }
  }
  /*
  getCartItem() {
    this.commonService.showLoader();
    this.apiService.getDataService(this.apiService.getCartAPI).subscribe((resp: any) => {
      console.log("response cart ", resp);
      if (resp.getProdList){
        if(this.storageService.prefDistFlag){
          this.router.navigate(['/product-list']);
        }else{
          this.router.navigate(["/preferred-distributor"]);
        }
        this.commonService.hideLoader();
        this.commonService.badgeCountValue = resp.getProdList.length;
      }else{
        this.commonService.showToast(resp.message);
      }
    }, (err) => {
      console.log("error in cart", err);
      this.commonService.hideLoader()
      this.commonService.showToast(err);
    });
  }
  /*
   processValidateOTPResponse(response) {
     this.commonService.hideLoader();
     if (response["resultData"] != undefined &&
       response["resultData"] != "undefined" &&
       response["resultData"] != {}) {
 
       if (response["resultData"]["status"] == 403)
         this.commonService.showToast(response["resultData"]["msg"]);
       else if (response["resultData"]["status"] == 200) {
         this.storage.get("loginData").then((loginData) => {
           console.log("OTP loginData", loginData);
           this.commonService.setFacilityId(
             loginData["serviceDTO"]["facilityAdmin"]["facilityId"]
           );
 
           this.commonService.setUserName(loginData["serviceDTO"]["userName"]);
           this.router.navigate(["/homePage"]);
         });
       }
 
     } else if (response["responseCode"] == 401)
       this.commonService.showToast("Unauthorized user");
     else
       this.commonService.showToast(
         "Error while validating OTP. Please try after sometime."
       );
   }
 
   onSubmit() {
     this.router.navigate(["/homePage"]);
   }
 
   back() {
     this.router.navigate(["/login"]);
   }
 
   processSuccessResponse(response) {
     this.commonService.hideLoader();
     if (response["responseCode"] == 200) {
       if (
         response["serviceDTO"] != undefined &&
         response["serviceDTO"] != "undefined" &&
         response["serviceDTO"] != {}
       ) {
         this.apiService.setUserData(response["serviceDTO"]["authToken"]);
         this.commonService.setFacilityId(
           response["serviceDTO"]["facilityAdmin"]["facilityId"]
         );
         this.commonService.setLoginId(
           response["serviceDTO"]["facilityAdmin"]["loginId"]
         );
         this.commonService.setUserName(response["serviceDTO"]["userName"]);
         this.router.navigate(["/otp"]);
       } else
         this.commonService.showToast(
           "Error while sending OTP. Please try after sometime."
         );
     } else if (response["responseCode"] == 401)
       this.commonService.showToast("Unauthorized user");
     else
       this.commonService.showToast(
         "Error while sending OTP. Please try after sometime."
       );
   }*/
}

