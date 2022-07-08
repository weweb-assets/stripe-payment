<template>
    <div
        ref="stripe-element"
        v-show="stripe && content.clientSecret"
        class="stripe-element"
        :class="{ editing: isEditing }"
    >
        <!--Stripe.js injects the Payment Element-->
    </div>
    <!-- wwEditor:start -->
    <div v-if="!stripe && isEditing" class="stripe-element__error label-2">Invalid Stripe configuration</div>
    <div v-else-if="!content.clientSecret && isEditing" class="stripe-element__error label-2">
        No client secret defined
    </div>
    <!-- wwEditor:end -->
</template>

<script>
export default {
    props: {
        uid: { type: String, required: true },
        content: { type: Object, required: true },
        /* wwEditor:start */
        wwEditorState: { type: Object, required: true },
        /* wwEditor:end */
    },
    setup(props) {
        const { value, setValue } = wwLib.wwVariable.useComponentVariable({
            uid: props.uid,
            name: 'value',
            defaultValue: null,
            componentType: 'element',
            type: 'stripe',
            readonly: true,
        });
        return { value, setValue };
    },
    data() {
        return {
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
        isEditing() {
            /* wwEditor:start */
            return this.wwEditorState.editMode === wwLib.wwEditorHelper.EDIT_MODES.EDITION;
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
        init() {
            this.$nextTick(() => {
                if (!this.value) this.createElement();
                else this.updateElement();
            });
        },
        createElement() {
            if (!this.content.clientSecret || !this.stripe) return;
            const value = this.stripe.elements({
                appearance: {
                    theme: this.content.theme,
                    labels: this.content.labels,
                    variables: this.variables,
                },
                clientSecret: this.content.clientSecret,
            });
            const element = value.create('payment');
            element.mount(this.$refs['stripe-element']);
            this.setValue(value);
        },
        updateElement() {
            if (!this.content.clientSecret || !this.stripe) return;
            this.value.update({
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
/* wwEditor:start */
.stripe-element {
    width: 100%;
    &.editing {
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
}
/* wwEditor:end */
</style>
