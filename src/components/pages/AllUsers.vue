<template>
  <f7-page name="AllUsers" infinite-scroll @infinite="onInfiniteScroll" pull-to-refresh @ptr:refresh="onPullToRefresh">

    <f7-navbar v-bind="$pzGlobalReactiveData.navHistory.length>1?{ 'back-link': 'back' }:''">
      <f7-nav-left v-if="$pzGlobalReactiveData.navHistory.length==1">
        <f7-link icon="icon-bars" open-panel="left"></f7-link>
      </f7-nav-left>
      <f7-nav-center>
        All Users
      </f7-nav-center>
    </f7-navbar>

    <div class="pz-padding-16 pz-float-l color-gray" v-if="totalCount">
      Found {{totalCount}} results
    </div>

    <div style="overflow: hidden; margin: 16px 16px 16px;">
      <a href="#" class="button button-fill button-raised pz-flex-c-c pz-float-r" @click="openFilters()">
        <icon name="filter"></icon>
        <span class="pz-padding-l16">Filter</span>
      </a>
    </div>

    <f7-list>
      <div v-if="allUsers.length" class="list-block">
        <ul>
          <li class="item-content" v-for="user in allUsers" :key="user.id" :class="{ 'pz-bg-red-lightest': user.status==0 }">
            <div class="item-inner" style="flex-direction: column;">
              <div class="row pz-width100">
                <div class="col-30 color-gray pz-weight-thin">User ID:</div>
                <div class="col-70">{{user.id}}</div>
              </div>
              <div class="row pz-width100">
                <div class="col-30 color-gray pz-weight-thin">Name:</div>
                <div class="col-70">{{user.buyer_name}} ({{user.userAddress.find(_=>_.address_type===1).city.name}})</div>
              </div>
              <div class="row pz-width100">
                <div class="col-30 color-gray pz-weight-thin">Mobile:</div>
                <div class="col-70">
                  <a @click="$pzGlobalReactiveData.phone(user.mobile)">{{user.mobile}}</a>
                </div>
              </div>
              <i class="f7-icons pz-popover" @click='openPopover(user, $event)'>more_horiz</i>
            </div>
          </li>
        </ul>
      </div>
      <div class="color-gray" style="text-align: center; font-style: italic;" v-if="allUsers.length && hasReachedEnd && !$pzGlobalReactiveData.pendingReq">Thats all folks!</div>
      <div class="color-gray" style="text-align: center; font-style: italic;" v-if="!allUsers.length && !$pzGlobalReactiveData.pendingReq">No results found</div>
    </f7-list>

    <f7-popover :id="randomID">
      <div class="popover-inner">
        <div class="list-block">
          <a @click="openPage('UserDetail')" class="list-button item-link close-popover">Details</a>
          <a @click="resetPassword()" class="list-button item-link close-popover" v-if="$pzGlobalReactiveData.roleAccess('resetpass', 'update')">Reset Password</a>
          <a @click="updateCreditLimit()" class="list-button item-link close-popover" v-if="$pzGlobalReactiveData.roleAccess('creditlimit', 'update')">Update Credit Limit</a>
          <a v-if="clickedUser && clickedUser.status==0 && $pzGlobalReactiveData.roleAccess('useractivation', 'update')" @click="changeUserStatus('activate')" class="list-button item-link close-popover">Activate</a>
          <a v-if="clickedUser && clickedUser.status==1 && $pzGlobalReactiveData.roleAccess('useractivation', 'update')" @click="changeUserStatus('deactivate')" class="list-button item-link close-popover">De-activate</a>
        </div>
      </div>
    </f7-popover>

  </f7-page>
</template>

<script>
export default {
  name: 'AllUsers',
  data() {
    return {
      allUsers: [],
      limit: 20,
      offset: 0,
      hasReachedEnd: false,
      totalCount: null,
      clickedUser: null,
      randomID: Math.random().toString(36).substr(2, 10),
      filters: {
        search: [
          {
            placeholder: 'User name:'
          },
          {
            placeholder: 'User mobile:'
          },
          {
            placeholder: 'User city:'
          }
        ]
      }
    };
  },
  computed: {
    filterQuery() {
      let filterQuery = '';

      let { value: buyerName = null } = this.filters.search[0];
      if (buyerName !== null) filterQuery += `&name=${buyerName}`;

      let { value: buyerMobile = null } = this.filters.search[1];
      if (buyerMobile !== null) filterQuery += `&mobile=${buyerMobile}`;

      let { value: buyerCity = null } = this.filters.search[2];
      if (buyerCity !== null) filterQuery += `&city=${buyerCity}`;

      return filterQuery;
    }
  },
  methods: {
    getAllUsers() {

      window.vm.$pzGlobalReactiveData.loaderOnAllReqs = false;
      const url = `${window._pz.apiEndPt}users/search?limit=${this.limit}&offset=${this.offset}` + this.filterQuery;
      window.vm.$http.get(url)
        .then(res => {
          this.totalCount = res.headers.map.count && res.headers.map.count[0];

          this.allUsers = this.allUsers.concat(res.body);
          this.offset += res.body.length;

          if (this.offset % this.limit !== 0) {
            this.removeInfiniteScroll();
          }
        })
        .catch((err) => {
          this.removeInfiniteScroll();
          window._pz.errFunc2.call(this, err);
        });
    },
    onInfiniteScroll() {
      if (this.offset % this.limit === 0 && !window.vm.$pzGlobalReactiveData.pendingReq) this.getAllUsers();
    },
    onPullToRefresh() {
      window.vm.$f7.mainView.router.refreshPage();
    },
    openPage(pageName) {
      const id = this.clickedUser.id;
      const url = `${pageName}?id=${id}`;
      window.vm.$f7.mainView.router.load({
        url: url,
        context: { listFilters: this.filters } // send currently applied filters to the next page
      });
    },
    openPopover(user, e) {
      this.clickedUser = user;
      const popupID = '#' + this.randomID;
      window.vm.$pzGlobalReactiveData.openPopoverMenu(window.Dom7(popupID), e.target);
    },
    // reset the infinite scroll behaviour, as on previous page, we may have reached the end of ITS scroll
    addInfiniteScroll() {
      window.vm.$f7.attachInfiniteScroll(window.Dom7('.infinite-scroll'));
      window.Dom7('.infinite-scroll-preloader').show();
      this.hasReachedEnd = false;
    },
    removeInfiniteScroll() {
      window.vm.$f7.detachInfiniteScroll(window.Dom7('.infinite-scroll'));
      window.Dom7('.infinite-scroll-preloader').hide();
      this.hasReachedEnd = true;
    },
    openFilters() {
      window.vm.$f7.mainView.router.load({
        url: 'filters',
        // send over a clone of the filters object to avoid mutating it directly from the filters page
        context: { comps: JSON.parse(JSON.stringify(this.filters)) }
      });
    },
    resetPassword() {
      window.f7.prompt('Enter new password for ' + this.clickedUser.name, 'Reset Password', pass => {
        window.vm.$http.patch(`${window._pz.apiEndPt}users?action=password`, {
          id: this.clickedUser.id,
          password_hash: pass
        })
          .then(res => {
            window.vm.$f7.addNotification({ message: 'Password reset successfully!', hold: 2000 });
          })
          .catch(window._pz.errFunc2.bind(this));
      });
    },
    updateCreditLimit() {
      window.f7.prompt('Enter new credit limit for ' + this.clickedUser.name, 'Credit Limit', cl => {
        window.vm.$http.patch(`${window._pz.apiEndPt}users?action=credit`, {
          id: this.clickedUser.id,
          credit_limit_type: 0,
          credit_limit: cl
        })
          .then(res => {
            window.vm.$f7.addNotification({ message: 'Credit limit updated successfully!', hold: 2000 });
          })
          .catch(window._pz.errFunc2.bind(this));
      });
    },
    changeUserStatus(todo) {
      let url, status, msg;
      // const that = this;
      if (todo === 'activate') {
        url = `${window._pz.apiEndPt}users?action=activate`;
        status = 1;
        msg = 'Activated successfully!';
      } else {
        url = `${window._pz.apiEndPt}users?action=deactivate`;
        status = 0;
        msg = 'De-activated successfully!';
      }
      window.vm.$http.patch(url, { id: this.clickedUser.id, status: status, deactivate_reason: '' })
        .then(res => {
          window.vm.$f7.addNotification({ message: msg, hold: 2000 });
          this.allUsers.find(_ => _.id === this.clickedUser.id).status = status;
        })
        .catch(window._pz.errFunc2.bind(this));
    }
  },

  beforeCreate() { console.debug(this.$options.name + ' beforeCreate'); },
  created() {
    console.debug(this.$options.name + ' created');

    if (window._pz.checkNested(this, '$route', 'options', 'context', 'comps')) this.filters = this.$route.options.context.comps;
    this.getAllUsers();
  },
  beforeMount() { console.debug(this.$options.name + ' beforeMount'); },
  mounted() { console.debug(this.$options.name + ' mounted'); },
  beforeUpdate() { console.debug(this.$options.name + ' beforeUpdate'); },
  updated() { console.debug(this.$options.name + ' updated'); },
  beforeDestroy() { console.debug(this.$options.name + ' beforeDestroy'); },
  destroyed() { console.debug(this.$options.name + ' destroyed'); }
};
</script>
