import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MenuController } from "@ionic/angular";
import { Subscription } from "rxjs";
import { ApiService } from "src/app/services/api.service";
import { CommonService } from "src/app/services/common.service";
import { StorageService } from "src/app/services/storage.service";

// import { HelperService } from "src/app/helper.service";
// import { ApiService } from "src/app/Service/api/api.service";
// import { CommonService } from "src/app/service/common/common.service";

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
  timeLeft: any = 180;
  mobileNumber;

  countDown: Subscription;
  counter = 1800;
  tick = 1000;

  loginData: any;
  loginType: any;
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
    this.getOTP()
  }

  getOTP() {
    this.commonService.showLoader();
    var data = {
      "EmailId": "",
      "MobileNo": ""
    }
    console.log(this.loginType);
    if (this.loginType == 'email') {
      data.EmailId = this.loginData;
      data.MobileNo = ""
    } else {
      data.EmailId = "";
      data.MobileNo = this.loginData;
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
    this.commonService.showToast(data.message);
  }

  processOTPError(error) {
    this.commonService.hideLoader();
  }


  battleInit() {
    if (this.timeLeft == -1) {

    } else {
      this.timeLeft = this.timeLeft + ' seconds remaining';
      this.timeLeft--;
    }
    console.log("this time ", this.timeLeft);
  }

  ionViewWillEnter() {
    this.menu.enable(false);
  }
  ionViewDidEnter() {
    // this.storage.get("loginId").then((loginId) => {
    //   this.mobileNumber = loginId;
    // });
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
    // this.router.navigate(["/preferred-distributor"]);
    // return;

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
    // const encryptedOTP = this.helperService.encrypt(
    //   "data",
    //   JSON.stringify(finalOTP)
    // );

    // console.log("encryptedOTP", encryptedOTP);
    let data = {
      "HcpCode": this.storageService.getHcpCode(),
      "OTP": finalOTP
    };

    this.apiService
      .postDataService(this.apiService.validateOtp, data)
      .subscribe(
        (response) => {
          console.log("validateOtp Response-", response);
          //  this.processValidateOTPResponse(response);
          this.commonService.hideLoader();
        },
        (err) => {
          console.log("error in page ", err);
          this.commonService.hideLoader();
          if (err.status == 400) this.commonService.showToast(err.message);
        }
      );
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
  
    reSendOTP() {
      this.commonService.showLoader("Please wait");
      let data = {
        serviceType: "test",
        serviceDTO: {
          userName: this.mobileNumber,
        },
      };
  
      this.apiService
        .authenticationService(this.apiService.sendOtp, data)
        .subscribe(
          (response) => {
            console.log("sendOtp Response-", response);
            this.processSuccessResponse(JSON.parse(response.toString()));
            this.commonService.hideLoader();
          },
          (err) => {
            console.log("error in page ", err);
            this.commonService.hideLoader();
            if (err.status == 400) this.commonService.showToast(err.message);
          }
        );
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
