<template>
  <f7-page name="login">
    <section class="pg-login">
      <form @submit.prevent="validateBeforeSubmit" class="form" name="login">
        <div class="list-block" style="width: 80%;">

          <div style="padding: 0px 60px 50px 60px;">
            <img src="../../assets/logo.png" alt="" class="pz-width100">
          </div>
          <div class="pz-width100">
            <input type="number" class="input" placeholder="Mobile number" v-model="username" v-validate.initial="username" data-vv-rules="required|numeric|digits:10">
            <p class="vald-msg" v-if="errors.has('username')">{{ errors.first('username') }}</p>
            <p class="vald-msg" v-else>&nbsp;</p>
          </div>
          <div class="pz-width100">
            <input type="text" autocapitalize="false" class="input" placeholder="Password" v-model="password" v-validate.initial="password" data-vv-rules="required|min:8">
            <p class="vald-msg" v-if="errors.has('password')">{{ errors.first('password') }}</p>
            <p class="vald-msg" v-else>&nbsp;</p>
          </div>
          <button href="#" class="button button-big button-fill button-raised color-teal pz-width100" :disabled="errors.any() || $pzGlobalReactiveData.pendingReq">LOGIN</button>
        </div>
      </form>
    </section>
  </f7-page>
</template>


<style scoped>
.pg-login {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
}

.form {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50px;
  width: 100%;
}

input {
  background: #f6f6f6 !important;
  border: 1px solid #e7e8e9 !important;
  border-radius: 3px !important;
  height: 40px !important;
  padding-left: 15px !important;
}

.vald-msg {
  font-size: 12px;
  margin-top: 0px;
}
</style>

<style>
.choseTenant {
  display: flex;
  align-items: center;
}

.choseTenant > div {
  height: 40px;
  display: flex;
  align-items: center;
  width: 20%;
  justify-content: center;
  box-shadow: inset 0px 0px 10px 2px lightgrey;
}

.choseTenant > div > img {
  height: 30px;
}

.choseTenant > span {
  margin-left: 15px;
}
</style>



<script>
export default {
  name: "Login",
  data() {
    return {
      title: "Login Page",
      // username: '9876543210',
      // password: 'password12'
      username: null,
      password: null
    };
  },
  methods: {
    validateBeforeSubmit(e) {
      this.$validator.validateAll();
      if (!this.errors.any()) {
        this.login();
      }
    },

    login() {
      var tempTenant = null;
      // get list of tenants
      window.vm.$http.post(window._pz.apiEndPt + "tenant", { userName: this.username })
        //  check status and lenth
        .then(res => {
          if (res.ok && res.body.length) return Promise.resolve(res.body);
          else if (res.ok && !res.body.length)
            return Promise.reject("You dont have an account");
          else return Promise.reject(res.status);
        })
        // ask user to select a tenant
        .then(res => {
          if (res.length === 1){
            tempTenant = res[0].tenants;
            return Promise.resolve(res[0].tenants);
          }

          return new Promise((resolve, reject) => {
            let buttons = res.map(tenant => ({
              text: `<div class="choseTenant">
                      <div><img src="${tenant.tenants.logo_lnk}"></div>
                      <span>${tenant.tenants.tenant_name}</span>
                      </div>`,
              onClick() {
                tempTenant = tenant.tenants;
                resolve(tenant.tenants);
              }
            }));
            buttons.unshift({
              text: "Select an account",
              label: true
            });
            window.vm.$f7.actions(buttons);
            window.Dom7(".actions-modal").on("closed", () => reject());
          });
        })
        // auth with password
        .then(tenant => window.vm.$http.post(
            window._pz.apiEndPt + "auth",
            {
              username: this.username,
              password: this.password
            },
            {
              headers: {
                tenant: "tenant_" + tenant.id,
                source: "3",
                "Content-type": "application/json;charset=UTF-8; charset=UTF-8"
              }
            }
          )
        )
        // check status
        .then(
          res => (res.ok ? Promise.resolve(res) : Promise.reject(res.status))
        )
        // GO GO GO !
        .then(res => {
          if (res.ok) {
            setGlobals(res.body.token, tempTenant, res.body.id);
            clearAllHistory();
            window.vm.$f7.mainView.router.loadPage("dashboard");

            window.vm.$http.get(window._pz.apiEndPt + "users/" + res.body.id).then(res => {
              if (!res.ok || !res.body.buyer_name) return;
              window.localStorage.userName = res.body.buyer_name;
              window.vm.$pzGlobalReactiveData.userName = res.body.buyer_name;
            });
          }
        })
        .catch(function(err) {
          console.log("err: ", err);
          var msg;
          if (typeof err === "string") msg = window._pz.err[err] || err;
          else if (typeof err === "number") msg = `Something went wrong. (err ${err})`;
          else if (typeof err === "object" && err.status && err.status === 401) msg = window._pz.err["ERR_CREDS"];
          else if (err && !err.ok) msg = window._pz.err["ERR_NET"];

          if (msg) window.vm.$f7.addNotification({ message: msg, hold: 2000 });
        });
    }
  },
  beforeCreate() {
    console.debug(this.$options.name + "created");
  },
  created() {
    console.debug(this.$options.name + "created");
  },
  beforeMount() {
    console.debug(this.$options.name + "beforeMount");
  },
  mounted() {
    console.debug(this.$options.name + "mounted");
  },
  beforeUpdate() {
    console.debug(this.$options.name + "beforeUpdate");
  },
  updated() {
    console.debug(this.$options.name + "updated");
  },
  beforeDestroy() {
    console.debug(this.$options.name + "beforeDestroy");
  },
  destroyed() {
    console.debug(this.$options.name + "destroyed");
  }
};

function setGlobals(authToken, tenantData, userID) {
  window.vm.$options.http.headers.Authorization = authToken;
  window.vm.$options.http.headers.ID = "" + userID;
  window.vm.$options.http.headers.tenant = "tenant_" + tenantData.id;

  window.localStorage.authToken = authToken;
  window.localStorage.userID = userID;
  window.localStorage.tenantData = JSON.stringify(tenantData);

  window._pz.uploadsEndPt = `${window._pz
    .domain}/backend/web/uploads/tenant_${tenantData.id}/`;

  // add user specific stuff to the global useable object
  window.vm.$pzGlobalReactiveData.userID = userID;
}

function clearAllHistory() {
  window.vm.$f7.mainView.history = [];
}
</script> ̰
