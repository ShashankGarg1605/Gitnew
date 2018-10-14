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
                    <list-item :label="'Order ID'" :value="bookData.id"/>
                    <list-item :label="'MRP'" :value="bookData.selling_price"/>
                    <list-item :label="'Publisher'" :value="bookData.product.publisher.name"/>
                </ul>
            </section>
            <form @submit.prevent="validateBeforeSubmit">
                <label for="qty">Qty to verify:</label>
                <input
                    type="number"
                    v-model="verificationQty"
                    name="verification-qty"
                    :placeholder="`max ${maxQtyToVerify}`"
                >
                <p
                    class="vald-msg"
                    v-if="verificationQty>maxQtyToVerify"
                >Max quantity can be {{maxQtyToVerify}}</p>
                <p
                    class="vald-msg"
                    v-if="verificationQty && verificationQty<maxQtyToVerify"
                >There will still be {{maxQtyToVerify - parseInt(verificationQty)}} qty left to verify. Are you sure you want to continue?</p>
                <button
                    submit
                    class="button button-fill button-raised color-teal"
                    :disabled="!isFormValid"
                >Submit</button>
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

form input {
  border: 1px solid lightgrey;
  border-radius: 5px;
  padding: 5px 10px;
  margin-left: 5px;
}

form button {
  margin: 20px auto;
  padding: 0px 40px;
}

form .vald-msg {
  font-size: 12px;
  margin-top: 0px;
  color: red;
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
    computed: {
        maxQtyToVerify() {
            return this.bookData.quantity - this.bookData.verified_quantity;
        },
        isFormValid() {
            return this.verificationQty && this.verificationQty <= this.maxQtyToVerify;
        }
    },
    methods: {
        validateBeforeSubmit(e) {
            if (this.isFormValid) this.onSubmit();
        },
        onSubmit() {
            window.vm.$http
                .patch(`${window._pz.apiEndPt}order_product?updateType=verification`, {
                    "id": this.bookData.id,
                    "verified_quantity": this.verificationQty
                })
                .then(res => {
                    if (res.ok) {
                        console.log("res.body: ", res.body);
                        // const orders = res.body;
                        // window.vm.$f7.mainView.router.load({
                        //   url: "OrderSelect",
                        //   reload: true,
                        //   context: { orders }
                        // });
                    }
                })
                .catch(window._pz.errFunc2.bind(this));
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
