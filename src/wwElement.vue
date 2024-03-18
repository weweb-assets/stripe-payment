<template>
    <div>
        <div
            v-if="isStripeLoaded && content.clientSecret"
            ref="stripe-payment"
            class="stripe-payment"
            :class="{ editing: isEditing }"
        >
            <!--Stripe.js injects the Payment Element-->
        </div>
        <!-- wwEditor:start -->
        <div v-if="!isStripeLoaded && !isEditing" class="stripe-payment__error label-2">
            Invalid Stripe configuration
        </div>
        <div v-else-if="!content.clientSecret && isEditing" class="stripe-payment__error label-2">
            No client secret defined
        </div>
        <!-- wwEditor:end -->
    </div>
</template>

<script>
import { markRaw } from 'vue';
import CONSTANTS from './constants.js';

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
            type: 'stripe-payment',
            readonly: true,
            labelOnly: '[Stripe Element]',
        });
        return { value, setValue };
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
                ...(CONSTANTS.THEME_DEFAULT[this.content.theme].variables || {}),
                colorPrimary: this.content.colorPrimary,
                colorBackground: this.content.colorBackground,
                colorDanger: this.content.colorDanger,
                colorText: this.content['_ww-text_color'],
                fontFamily: this.content['_ww-text_fontFamily'] || this.defaultFontFamily,
                fontWeightNormal: this.content['_ww-text_fontWeight'] || undefined,
                fontSizeBase: this.content['_ww-text_fontSize'] || undefined,
                spacingUnit: this.content.spacingUnit,
                borderRadius: this.content.borderRadius,
            };
        },
        isStripeLoaded() {
            return !!wwLib.wwPlugins.stripe?.instance;
        },
        theme() {
            switch (this.content.theme) {
                case 'minimal':
                case 'bubblegum':
                    return 'flat';
                case 'ninety-five':
                    return 'none';
                case 'dark-blue':
                    return 'night';
                default:
                    return this.content.theme;
            }
        },
        rules() {
            try {
                return {
                    ...(CONSTANTS.THEME_DEFAULT[this.content.theme].rules || {}),
                    ...(eval(`(function() { return  ${this.content.rules} })`)() || {}),
                };
            } catch {
                return { ...(CONSTANTS.THEME_DEFAULT[this.content.theme].rules || {}) };
            }
        },
        stripeOptions() {
            return {
                appearance: {
                    theme: this.theme,
                    labels: this.content.labels,
                    variables: this.variables,
                    rules: this.rules,
                },
                clientSecret: this.content.clientSecret,
            };
        },
    },
    watch: {
        stripeOptions: {
            immediate: true,
            deep: true,
            handler() {
                if (!this.content.clientSecret || !wwLib.wwPlugins.stripe?.instance) return;
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
            const stripe = wwLib.wwPlugins.stripe?.instance;
            if (!this.content.clientSecret || !stripe) return;
            const stripeElements = markRaw(stripe.elements(this.stripeOptions));
            const element = stripeElements.create('payment');
            console.log('stripeElements', stripeElements, element);
            element.mount(this.$refs['stripe-payment']);
            this.setValue(stripeElements);
        },
        updateElement() {
            if (!this.content.clientSecret || !wwLib.wwPlugins.stripe?.instance) return;
            this.value.update(this.stripeOptions);
        },
    },
};
</script>

<style lang="scss" scoped>
.stripe-payment {
    width: 100%;
    /* wwEditor:start */
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
    /* wwEditor:end */
}
</style>
