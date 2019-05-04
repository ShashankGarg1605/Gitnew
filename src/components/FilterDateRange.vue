<template>
  <li class="item-content button pz-colr-inherit pz-cap" @click="openManually()">
    <div class="item-media">
      <icon name="calendar-o"></icon>
    </div>
    <div class="item-inner pz-margin-l0">
      <div class="item-content pz-padding-l0 pz-size-normal text-container pz-width100">
        <span>{{placeholder}}</span>
        <input
          type="text"
          id="datepick"
          name="datepick"
          class="item-title selected-values"
          v-model="compvalueReadable"
        >
      </div>
      <div class="item-after">
        <span>
          <icon name="chevron-right"></icon>
        </span>
      </div>
    </div>
  </li>
</template>

<style scoped>
#datepick::placeholder {
  color: inherit;
}

#datepick {
  height: 44px;
}

.selected-values {
  position: absolute !important;
  left: 0px !important;
  bottom: -10px !important;
  color: #419688 !important;
  font-size: x-small !important;
}

.text-container {
  display: flex !important;
  flex-direction: column !important;
  align-items: flex-start !important;
  line-height: 37px !important;
}
</style>


<script>
window.FilterComponents = {
  name: "FilterDateRange",
  data() {
    return {
      compvalue: this.value //the actual milliseconds date
    };
  },
  computed: {
    compvalueReadable() {
      if (!this.compvalue || !this.compvalue.length) return null;

      const startDate = window.vm.moment(this.compvalue[0]).format("Do MMM YY");
      if (this.compvalue.length === 1) return startDate;
      // if we only have a start date, no end date
      else {
        const endDate = window.vm.moment(this.compvalue[1]).format("Do MMM YY");
        return startDate + " to " + endDate;
      }
    }
  },
  // props: ['placeholder', 'value', 'range'],

  props: {
    placeholder: String,
    range: {
      default: true
    },
    maxDateToday: {
      default: false
    },
    value: Array
  },

  watch: {
    compvalue() {
      this.$emit("input", this.compvalue);
    }
  },
  methods: {
    openManually() {
      setTimeout(() => {
        window.calendarInstance.open();
      });
    }
  },
  beforeCreate() {
    console.debug(this.$options.name + " beforeCreate");
  },
  created() {
    console.debug(this.$options.name + " created");
  },
  beforeMount() {
    console.debug(this.$options.name + " beforeMount");
  },
  mounted() {
    console.debug(this.$options.name + " mounted");
    window.calendarInstance = window.f7.calendar({
      input: "#datepick",
      rangePicker: this.range === true || this.range === "true",
      dateFormat: "d-M-yy",
      maxDate:
        this.maxDateToday === "true" || this.maxDateToday === true
          ? new Date()
          : null,
      onChange: (p, values, displayValues) => {
        this.compvalue = values;
      }
    });
  },
  beforeUpdate() {
    console.debug(this.$options.name + " beforeUpdate");
  },
  updated() {
    console.debug(this.$options.name + " updated");
  },
  beforeDestroy() {
    console.debug(this.$options.name + " beforeDestroy");
    window.calendarInstance && window.calendarInstance.destroy();
  },
  destroyed() {
    console.debug(this.$options.name + " destroyed");
  }
};
export default window.FilterComponents;
</script>
