import Vue from 'vue';
// import moment from 'moment';

Vue.filter('moneyFormat', function (amount) {
    if (!amount) return '';
    amount = parseInt(amount);
    amount = amount.toString();
    var lastThree = amount.substring(amount.length - 3);
    var otherNumbers = amount.substring(0, amount.length - 3);
    if (otherNumbers !== '') lastThree = ',' + lastThree;
    return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
});

Vue.filter('dateFormat', function (date, inputFormat = 'DD-MM-YYYY HH:mm', outputFormat = 'Do MMM YY') {
    return date ? window.vm.moment(date, inputFormat).format(outputFormat) : '';
});