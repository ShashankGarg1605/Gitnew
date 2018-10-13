<template>
    <f7-page name="VerifyProduct">
        <f7-navbar v-bind="$pzGlobalReactiveData.navHistory.length>1?{ 'back-link': 'back' }:''">
            <f7-nav-left v-if="$pzGlobalReactiveData.navHistory.length==1">
                <f7-link icon="icon-bars" open-panel="left"></f7-link>
            </f7-nav-left>
            <f7-nav-center style="display: flex;align-items: center;">
                <span>Verification quantity</span>
            </f7-nav-center>
        </f7-navbar>
        <!-- Scrollable page content-->
        <main>
            <section>
                <img :src="bookData.product.listOfImages[0].link" alt="product">
                <ul>
                    <list-item :label="'Order ID'" :value="bookData.id" />
                    <list-item :label="'MRP'" :value="bookData.selling_price" />
                    <list-item :label="'Publisher'" :value="bookData.product.publisher.name" />
                </ul>
            </section>
            <form @submit.prevent="onSubmit">
                <label for="qty">Qty to verify:</label>
                <input type="number" v-model="verificationQty" name="verification-qty" :placeholder="`max ${bookData.quantity}`">
                <button submit class="button button-fill button-raised color-teal ">Submit</button>
            </form>
        </main>
    </f7-page>
</template>

<style scoped>
section {
  display: flex;
  padding: 12px;
}
section ul {
  padding: 0;
  flex-grow: 1;
}
form {
  padding: 50px 20px;
}

input {
  border: 1px solid lightgrey;
  border-radius: 5px;
  padding: 5px 10px;
  margin-left: 5px;
}

button {
  margin: 20px auto;
  padding: 0px 40px;
}
</style>

<script>
import ListItem from "../../shared/ListItem";

export default {
    name: "VerifyProduct",
    components: {
        "list-item": ListItem
    },
    data() {
        return {
            title: "VerifyProduct",
            bookData: null,
            verificationQty: null
        };
    },
    methods: {
        onSubmit() {
            if (this.verificationQty) console.log('do it');
        }
    },
    beforeCreate() {
        console.debug(this.$options.name + " beforeCreate");
    },
    created() {
        console.debug(this.$options.name + " created");
        if (window._pz.checkNested(this, "$route", "options", "context", "bookData"))
            this.bookData = this.$route.options.context.bookData;
    },
    beforeMount() {
        console.debug(this.$options.name + " beforeMount");
    },
    mounted() {
        console.debug(this.$options.name + " mounted");
    },
    beforeUpdate() {
        console.debug(this.$options.name + " beforeUpdate");
    },
    updated() {
        console.debug(this.$options.name + " updated");
    },
    beforeDestroy() {
        console.debug(this.$options.name + " beforeDestroy");
    },
    destroyed() {
        console.debug(this.$options.name + " destroyed");
    }
};
</script>
