<template>
    <div v-if="stripe" ref="stripe-element"></div>
    <!-- wwEditor:start -->
    <div v-else class="stripe__error label-2">Invalid Stripe configuration</div>
    <!-- wwEditor:end -->
</template>

<script>
export default {
    props: {
        uid: { type: String, required: true },
        content: { type: Object, required: true },
    },
    computed: {
        stripe() {
            return wwLib.wwPlugins.stripe.instance;
        },
    },
    watch: {
        'content.clientSecret'() {
            if (!this.content.clientSecret) return;
            const elements = wwLib.wwPlugins.stripe.instance.elements({ clientSecret: this.content.clientSecret });
            const paymentElement = elements.create('payment');
            paymentElement.mount(this.$refs['stripe-element']);
        },
    },
};
</script>

<style lang="scss" scoped>
.stripe {
    /* wwEditor:start */
    &__error {
        padding: var(--ww-spacing-03);
        color: var(--ww-color-red-500);
        background-color: var(--ww-color-red-50);
        border: 1px solid var(--ww-color-red-100);
        width: 100%;
        text-align: center;
    }
    /* wwEditor:end */
}
</style>
