<template>
  <f7-page name="VerifyProduct">
    <f7-navbar back-link="Back" sliding>
      <f7-nav-center>Enter quantity</f7-nav-center>
    </f7-navbar>
    <main>
      <section>
        <img
          v-if="bookData.product.listOfImages && bookData.product.listOfImages.length"
          :src="bookData.product.listOfImages[0].link"
          alt="product"
        >
        <ul>
          <list-item :label="'Title'" :value="bookData.product.title"/>
          <list-item :label="'MRP'" :value="bookData.mrp"/>
          <list-item
            :label="itemType === 'book' ? 'Publisher' : 'Brand'"
            :value="bookData.product.publisher.name"
          />
          <list-item
            v-if="bookData.product.author"
            :label="'Author'"
            :value="bookData.product.author"
          />
        </ul>
      </section>
      <form @submit.prevent="validateBeforeSubmit">
        <label for="qty">Qty to verify:</label>
        <input type="number" v-model="verificationQty" name="verification-qty">
        <p class="vald-msg" v-if="verificationQty>maxQtyToVerify">Invalid quantity entered</p>
        <p
          class="vald-msg"
          v-if="verificationQty && verificationQty<maxQtyToVerify"
        >The quantity entered doesn't match the invoice. Do you still want to continue?</p>
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
section img {
  height: fit-content;
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
      orderId: null,
      verificationQty: null,
      itemType: null
    };
  },
  computed: {
    maxQtyToVerify() {
      return (
        parseInt(this.bookData.quantity) -
        parseInt(this.bookData.verified_quantity)
      );
    },
    isFormValid() {
      return (
        this.verificationQty && this.verificationQty <= this.maxQtyToVerify
      );
    }
  },
  methods: {
    validateBeforeSubmit(e) {
      if (this.isFormValid) this.onSubmit();
    },
    onSubmit() {
      window.vm.$http
        .patch(`${window._pz.apiEndPt}order_product?updateType=verification`, {
          id: this.bookData.id,
          verified_quantity:
            parseInt(this.verificationQty) +
            parseInt(this.bookData.verified_quantity)
        })
        .then(res => {
          if (res.ok) {
            window._pz.refreshOnBack = true;
            window.vm.$f7.mainView.router.back();
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
    if (
      window._pz.checkNested(this, "$route", "options", "context", "bookData")
    )
      this.bookData = this.$route.options.context.bookData;
    this.bookData.product = this.bookData.product || this.bookData.otherProduct;
    this.itemType = this.bookData.otherProduct ? "statn" : "book";

    if (window._pz.checkNested(this, "$route", "options", "context", "orderId"))
      this.orderId = this.$route.options.context.orderId;
    console.log("this.$route.options.context: ", this.$route.options.context);
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
