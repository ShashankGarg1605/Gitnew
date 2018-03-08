import Vue from "vue";

export default new Vue({
  data: {
    userID: window.localStorage.userID,
    userName: window.localStorage.userName,
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
    navHistory: window.f7.mainView.history
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
      window.location.href = url;
    },
    goBack() {
      if (window.f7 && window.f7.mainView) window.f7.mainView.back();
    }
  }
});
