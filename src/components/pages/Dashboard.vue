<template>
  <f7-page name="Dashboard">
    <f7-navbar sliding>
      <f7-nav-left>
        <f7-link icon="icon-bars" open-panel="left"></f7-link>
      </f7-nav-left>
      <f7-nav-center>
        Dashboard
      </f7-nav-center>
    </f7-navbar>
    <!-- Scrollable page content-->
    <f7-block-title>{{ title }}</f7-block-title>
    <f7-block inner>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Distinctio est aliquam officiis quaerat placeat, cum explicabo magni soluta totam maxime autem minima accusamus eos suscipit dignissimos corporis modi voluptatum fugiat!
    </f7-block>
  </f7-page>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      title: 'Dashboard Page'
    };
  },
  beforeCreate: function() {
    console.log('Dashboard before create');
  },
  created: function() {
    console.log('Dashboard created');
  },
  beforeMount: function() {
    console.log('Dashboard before mounted');
  },
  mounted: function() {
    console.log('Dashboard mounted');
  },
  beforeUpdate: function() {
    console.log('Dashboard befor updated');
  },
  updated: function() {
    console.log('Dashboard updated');
  },
  beforeDestroy: function() {
    console.log('Dashboard before destroyed');
  },
  destroyed: function() {
    console.log('Dashboard destroyed');
  }
};
</script>
