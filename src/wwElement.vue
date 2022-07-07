<template>
    <div v-if="stripe" ref="ww-stripe-element">
        <!--Stripe.js injects the Payment Element-->
    </div>
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
        'content.clientSecret': {
            immediate: true,
            handler() {
                this.mount();
            },
        },
        stripe: {
            immediate: true,
            handler() {
                // this.mount();
            },
        },
    },
    methods: {
        mount() {
            if (!this.content.clientSecret || !this.stripe) return;
            this.$nextTick(() => {
                const elements = wwLib.wwPlugins.stripe.instance.elements({
                    theme: 'stripe',
                    clientSecret: this.content.clientSecret,
                });
                const paymentElement = elements.create('payment');
                console.log(this.$refs['ww-stripe-element']);
                paymentElement.mount(this.$refs['ww-stripe-element']);
                console.log('mount');
            });
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
