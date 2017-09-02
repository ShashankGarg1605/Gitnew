<template>
    <li class="item-content button pz-colr-inherit pz-cap" @click="openManually()">
        <div class="item-media">
            <icon name="calendar-o"></icon>
        </div>
        <div class="item-inner pz-margin-l0">
            <!-- <input type="text" id="datepickx" :placeholder="label" name="datepickx" class="item-title" v-model="compvalue"> -->
            <div class="item-content pz-padding-l0 pz-size-normal text-container pz-width100">
                <span>{{placeholder}}</span>
                <input type="text" id="datepick" name="datepick" class="item-title selected-values" v-model="compvalue">
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
    name: 'FilterDateRange',
    data() {
        return {
            compvalue: null,
            compvalueActual: null   //the actual milliseconds date, separated by pipe
        };
    },
    props: ['placeholder', 'value'],
    watch: {
        'compvalue': function() {
            // When the internal value changes, we $emit an event. Because this event is 
            // named 'input', v-model will automatically update the parent value
            this.$emit('input', this.compvalueActual);
        }
    },
    methods: {
        openManually() {
            setTimeout(() => { window.calendarInstance.open(); });
        },
        getHumanReadableDate(dateArray) {
            if (!dateArray || !dateArray.length) return null;

            // if we get an array of stringified date objects, then create a new date object from the,
            let startDate = typeof dateArray[0] === 'string' ? new Date(dateArray[0]) : dateArray[0];
            if (typeof startDate.valueOf() === 'number') startDate = window.vm.moment(startDate).format('Do MMM');
            else startDate = 'ERR';

            if (dateArray.length === 1) return startDate; // if we only have a start date, no end date 
            else {
                let endDate = typeof dateArray[1] === 'string' ? new Date(dateArray[1]) : dateArray[1];
                if (typeof endDate.valueOf() === 'number') endDate = window.vm.moment(endDate).format('Do MMM');
                else endDate = 'ERR';

                return startDate + ' to ' + endDate;
            }
        }
    },
    beforeCreate() { console.debug(this.$options.name + ' beforeCreate'); },
    created() {
        console.debug(this.$options.name + ' created');
        this.compvalueActual = this.value;
        this.compvalue = this.getHumanReadableDate(this.value);
    },
    beforeMount() { console.debug(this.$options.name + ' beforeMount'); },
    mounted() {
        console.debug(this.$options.name + ' mounted');
        window.calendarInstance = window.f7.calendar({
            input: '#datepick',
            rangePicker: true,
            dateFormat: 'd-M-yy',
            onChange: function(p, values, displayValues) {
                this.compvalueActual = values;
                this.compvalue = this.getHumanReadableDate(values);
            }.bind(this)
        });
    },
    beforeUpdate() { console.debug(this.$options.name + ' beforeUpdate'); },
    updated() { console.debug(this.$options.name + ' updated'); },
    beforeDestroy() {
        console.debug(this.$options.name + ' beforeDestroy');
        window.calendarInstance && window.calendarInstance.destroy();
    },
    destroyed() { console.debug(this.$options.name + ' destroyed'); }
};
export default window.FilterComponents;
</script>
