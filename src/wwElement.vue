<template>
    <div>
        <StripePayment v-if="showStripePayment" :uid="uid" :content="content" :wwEditorState="wwEditorState"/>
        <!-- wwEditor:start -->
        <div v-else-if="!stripe && isEditing" class="stripe-payment__error label-2">Invalid Stripe configuration</div>
        <div v-else-if="!content.clientSecret && isEditing" class="stripe-payment__error label-2">
            No client secret defined
        </div>
        <!-- wwEditor:end -->
    </div>
</template>

<script>
import StripePayment from './StripePayment.vue'

export default {
    components: { StripePayment },
    props: {
        uid: { type: String, required: true },
        content: { type: Object, required: true },
        /* wwEditor:start */
        wwEditorState: { type: Object, required: true },
        /* wwEditor:end */
    },
    computed: {
        /* wwEditor:start */
        isEditing() {
            return this.wwEditorState.editMode === wwLib.wwEditorHelper.EDIT_MODES.EDITION;
        },
        /* wwEditor:end */
        showStripePayment() {
            return wwLib.wwPlugins.stripe && wwLib.wwPlugins.stripe.instance && content.clientSecret;
        }
    },
};
</script>


<style lang="scss" scoped>
/* wwEditor:start */
.stripe-payment {
    &__error {
        padding: var(--ww-spacing-02);
        color: var(--ww-color-red-500);
        background-color: var(--ww-color-theme-dark-50);
        border: 1px solid var(--ww-color-theme-dark-100);
        text-align: center;
        border-radius: var(--ww-border-radius-00);
    }
}
/* wwEditor:end */
</style>
