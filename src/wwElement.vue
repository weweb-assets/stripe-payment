<template>
    <form
        :name="stripeElementName"
        class="stripe-element"
        :class="{ editing: isEditing, selected: isSelected }"
        data-ww-flag="form-container"
        @submit.prevent="onSubmit"
    >
        <div class="stripe-element__relative">
            <wwLayout class="stripe-element__content" path="topContent" />
        </div>
        <div ref="stripe-element" v-show="stripe && content.clientSecret" :class="{ editing: isEditing }">
            <!--Stripe.js injects the Payment Element-->
        </div>
        <!-- wwEditor:start -->
        <div v-if="!stripe && isEditing" class="stripe-element__error label-2">Invalid Stripe configuration</div>
        <div v-else-if="!content.clientSecret && isEditing" class="stripe-element__error label-2">
            No client secret defined
        </div>
        <!-- wwEditor:end -->
        <div class="stripe-element__relative">
            <wwLayout class="stripe-element__content" path="bottomContent" />
        </div>
    </form>
</template>

<script>
export default {
    props: {
        content: { type: Object, required: true },
        wwElementState: { type: Object, required: true },
        /* wwEditor:start */
        wwEditorState: { type: Object, required: true },
        /* wwEditor:end */
    },
    emits: ['trigger-event'],
    data() {
        return {
            elements: null,
            element: null,
            stripe: null,
        };
    },
    mounted() {
        const apiKey = wwLib.manager
            ? wwLib.wwPlugins.stripe.settings.publicData.publicTestApiKey
            : wwLib.wwPlugins.stripe.settings.publicData.publicApiKey;
        this.stripe = wwLib.getFrontWindow().Stripe(apiKey);
    },
    computed: {
        stripeElementName() {
            return this.wwElementState.name;
        },
        isEditing() {
            /* wwEditor:start */
            return this.wwEditorState.editMode === wwLib.wwEditorHelper.EDIT_MODES.EDITION;
            /* wwEditor:end */
            // eslint-disable-next-line no-unreachable
            return false;
        },
        isSelected() {
            /* wwEditor:start */
            return this.wwEditorState.isSelected;
            /* wwEditor:end */
            // eslint-disable-next-line no-unreachable
            return false;
        },
        defaultFontFamily() {
            return getComputedStyle(wwLib.getFrontDocument().body).getPropertyValue('--ww-default-font-family');
        },
        variables() {
            return {
                colorPrimary: this.content.colorPrimary,
                colorBackground: this.content.colorBackground,
                colorText: this.content.colorText,
                colorDanger: this.content.colorDanger,
                fontFamily: this.content.fontFamily || this.defaultFontFamily,
                fontSizeBase: this.content.fontSizeBase,
                spacingUnit: this.content.spacingUnit,
                borderRadius: this.content.borderRadius,
            };
        },
    },
    watch: {
        content: {
            immediate: true,
            deep: true,
            handler() {
                this.init();
            },
        },
    },
    methods: {
        onSubmit() {
            this.$emit('trigger-event', { name: 'submit' });
        },
        init() {
            this.$nextTick(() => {
                if (!this.elements) this.createElement();
                else this.updateElement();
            });
        },
        createElement() {
            if (!this.content.clientSecret || !this.stripe) return;
            this.elements = this.stripe.elements({
                appearance: {
                    theme: this.content.theme,
                    labels: this.content.labels,
                    variables: this.variables,
                },
                clientSecret: this.content.clientSecret,
            });
            this.element = this.elements.create('payment');
            this.element.mount(this.$refs['stripe-element']);
        },
        updateElement() {
            if (!this.content.clientSecret || !this.stripe) return;
            console.log('updateElement');
            this.elements.update({
                appearance: {
                    theme: this.content.theme,
                    labels: this.content.labels,
                    variables: this.variables,
                },
                clientSecret: this.content.clientSecret,
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.stripe-element {
    &__relative {
        position: relative;
    }
    &__content {
        display: flex;
        flex-direction: column;
        width: 100%;
    }
    /* wwEditor:start */
    .editing {
        pointer-events: none;
    }
    &__error {
        padding: var(--ww-spacing-02);
        color: var(--ww-color-red-500);
        background-color: var(--ww-color-theme-dark-50);
        border: 1px solid var(--ww-color-theme-dark-100);
        text-align: center;
        border-radius: var(--ww-border-radius-00);
    }
    /* wwEditor:end */
}
</style>
