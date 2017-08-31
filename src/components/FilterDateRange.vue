<template>
    <li class="item-content button pz-colr-inherit pz-cap">
        <div class="item-media">
            <icon name="calendar-o"></icon>
        </div>
        <div class="item-inner pz-margin-l0">
            <input type="text" id="datepickx" placeholder="Select date range" name="datepickx" class="item-title" v-model="mutableList">
            <div class="item-after">
                <span>
                    <icon name="chevron-right"></icon>
                </span>
            </div>
        </div>
        <span>{{mutableList}}</span>
    </li>
</template>

<style scoped>
#datepick::placeholder {
    color: inherit;
}

#datepick {
    height: 44px;
}
</style>


<script>
window.FilterComponents = {
    name: 'test',
    data: function() {
        return {
            mutableList: this.item
        };
    },

    props: ['item'],
    watch: {
        'mutableList': function() {
            // When the internal value changes, we $emit an event. Because this event is 
            // named 'input', v-model will automatically update the parent value
            this.$emit('input', this.mutableList);
        }
    },
    mounted: function() {
        console.log('Date picker mounted');
        console.log('this: ', this.item);
        // this.mutableList = this.item;


        window.cal = window.f7.calendar({
            input: '#datepick',
            rangePicker: true,
            toolbarCloseText: 'apply',
            onChange(p, values, displayValues) {
                console.log('p: ', p);
                console.log('values: ', values);
                console.log('displayValues: ', displayValues);

            }
        });
    }
};
export default window.FilterComponents;
</script>
