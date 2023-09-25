<template>
    <div>
        <StripePayment v-if="stripe && content.clientSecret" :uid="uid" :content="content" :wwEditorState="wwEditorState"/>
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
        stripe() {
            return wwLib.wwPlugins.stripe && wwLib.wwPlugins.stripe.instance;
        },
    },
};
</script>
