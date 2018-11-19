import Vue from "vue";

export default new Vue({
  data: {
    userID: window.localStorage.userID,
    userName: window.localStorage.userName,
    roleMenus: window.localStorage.roleMenus && JSON.parse(window.localStorage.roleMenus),
    nbPendingReq: 0,
    loaderOnAllReqs: true,
    userTypeMap: {
      1: "Admin",
      2: "Buyer"
    },
    userStatusMap: {
      0: "Inactive",
      1: "Active"
    },
    buyerTypeMap: {
      1: "Distributor",
      2: "School Distributor",
      3: "School",
      4: "Library"
    },
    businessTypeMap: {
      1: "Proprietorship",
      2: "Partnership Firm",
      3: "LLP Firm",
      4: "Private Limited Company",
      5: "Trust"
    },
    accountTypeMap: {
      0: "Not defined",
      1: "Postpaid",
      2: "Prepaid"
    },
    logisticStatusMap: {
      1: "Prozo",
      2: "Buyer",
      3: "50-50"
    },
    serviceReqMap: {
      0: "Open",
      1: "Resolved",
      2: "Resolved for buyer",
      3: "Non resolvable"
    },
    biltyTypeMap: {
      1: "Scanned Bilty",
      2: "CC Bilty",
      3: "Physical Bilty"
    },
    freightTypeMap: {
      1: "To pay",
      2: "Paid"
    },
    verificationStatusMap: {
      0: "Verification not started",
      1: "Partially verified",
      2: "Verification complete"
    },
    returnStatusMap: {
      1: "Open",
      2: "Under process",
      3: "Complete"
    },
    navHistory: window.f7 && window.f7.mainView && window.f7.mainView.history
  },
  computed: {
    pendingReq() {
      return this.nbPendingReq > 0;
    }
  },
  methods: {
    openZoomView(imgURL) {
      var a = window.f7.photoBrowser({
        type: "popup",
        theme: "dark",
        toolbar: false,
        photos: [imgURL]
      });
      a.open();
    },
    phone(mob) {
      if (window.plugins && window.plugins.CallNumber) window.plugins.CallNumber.callNumber(() => {}, () => {}, mob, true);
      else document.location.href = "tel:" + mob;
    },
    email(email, subject) {
      var url = `mailto:${email}`;
      if (subject) url += `?subject=${subject}`;
      // window.location.href = url;

      window.open(url, "_system");
    },
    goBack() {
      if (window.f7 && window.f7.mainView) window.f7.mainView.back();
    },
    roleAccess(menu, permission) {
      if (!this.roleMenus) return false;
      if (this.roleMenus._isAdmin) return true;

      return window._pz.checkNested(this.roleMenus, menu, permission) ? this.roleMenus[menu][permission] : false;
    },
    scanCode() {
      return new Promise((resolve, reject) => {
        if (typeof window.cordova !== "undefined" && window.cordova && window.cordova.plugins.barcodeScanner) {
          var success = function(result) {
            if (result.cancelled) reject("User rejected");
            else resolve(result);
          };
          var failure = function(error) {
            reject(error);
          };
          var config = {
            preferFrontCamera: false, // iOS and Android
            showFlipCameraButton: false, // iOS and Android
            showTorchButton: true, // iOS and Android
            torchOn: false, // Android, launch with the torch switched on (if available)
            prompt: "Place a barcode inside the scan area", // Android
            resultDisplayDuration: 0, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
            // formats: "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
            // orientation: "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
            disableAnimations: true // iOS
          };

          window.cordova.plugins.barcodeScanner.scan(success, failure, config);
        } else {
          // if (location.hostname === "localhost") resolve({ text: "9789383182497" });
          if (location.hostname === "localhost") resolve({ text: "9789387504929" });
          else reject("Plugin or Cordova not available");
        }
      });
    }
  }
});
