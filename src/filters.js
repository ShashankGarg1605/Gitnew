import Vue from 'vue';

Vue.filter('moneyFormat', function (data) {
    if (!data) return '';
    data = parseInt(data);
    data = data.toString();
    var lastThree = data.substring(data.length - 3);
    var otherNumbers = data.substring(0, data.length - 3);
    if (otherNumbers !== '') lastThree = ',' + lastThree;
    return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
});