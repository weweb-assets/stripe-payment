<template>
    <div>
        <div
            ref="stripe-payment"
            class="stripe-payment"
            v-show="stripe && content.clientSecret"
            :class="{ editing: isEditing }"
        >
            <!--Stripe.js injects the Payment Element-->
        </div>
        <!-- wwEditor:start -->
        <div v-if="!stripe && isEditing" class="stripe-payment__error label-2">Invalid Stripe configuration</div>
        <div v-else-if="!content.clientSecret && isEditing" class="stripe-payment__error label-2">
            No client secret defined
        </div>
        <!-- wwEditor:end -->
    </div>
</template>

<script>
import { markRaw } from 'vue';

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
                ...(THEME_DEFAULT[this.content.theme].variables || {}),
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
                    ...(THEME_DEFAULT[this.content.theme].rules || {}),
                    ...(eval(`(function() { return  ${this.content.rules} })`)() || {}),
                };
            } catch {
                return { ...(THEME_DEFAULT[this.content.theme].rules || {}) };
            }
        },
        stripe() {
            return wwLib.wwPlugins.stripe && wwLib.wwPlugins.stripe.instance;
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
            deep: true,
            handler() {
                this.init();
            },
        },
    },
    mounted() {
        this.init();
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
            const stripeElements = markRaw(this.stripe.elements(this.stripeOptions));
            const element = stripeElements.create('payment');
            element.mount(this.$refs['stripe-payment']);
            this.setValue(stripeElements);
        },
        updateElement() {
            if (!this.content.clientSecret || !this.stripe) return;
            this.value.update(this.stripeOptions);
        },
    },
};
const THEME_DEFAULT = {
    stripe: {},
    night: {},
    flat: {},
    none: {},
    minimal: {
        variables: {
            fontFamily: '"Gill Sans", sans-serif',
            fontLineHeight: '1.5',
            borderRadius: '10px',
            colorBackground: '#F6F8FA',
            colorPrimaryText: '#262626',
        },
        rules: {
            '.Block': { backgroundColor: 'var(--colorBackground)', boxShadow: 'none', padding: '12px' },
            '.Input': { padding: '12px' },
            '.Input:disabled, .Input--invalid:disabled': { color: 'lightgray' },
            '.Tab': { padding: '10px 12px 8px 12px', border: 'none' },
            '.Tab:hover': {
                border: 'none',
                boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)',
            },
            '.Tab--selected, .Tab--selected:focus, .Tab--selected:hover': {
                border: 'none',
                backgroundColor: '#fff',
                boxShadow:
                    '0 0 0 1.5px var(--colorPrimaryText), 0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)',
            },
            '.Label': { fontWeight: '500' },
        },
    },
    bubblegum: {
        variables: {
            fontWeightNormal: '500',
            borderRadius: '2px',
            colorBackground: 'white',
            colorPrimary: '#DF1B41',
            colorPrimaryText: 'white',
            spacingGridRow: '15px',
        },
        rules: {
            '.Label': { marginBottom: '6px' },
            '.Tab, .Input, .Block': { boxShadow: '0px 3px 10px rgba(18, 42, 66, 0.08)', padding: '12px' },
        },
    },
    'ninety-five': {
        variables: {
            fontFamily: 'Verdana',
            fontLineHeight: '1.5',
            borderRadius: '0',
            colorBackground: '#dfdfdf',
        },
        rules: {
            '.Input': {
                backgroundColor: '#ffffff',
                boxShadow:
                    'inset -1px -1px #ffffff, inset 1px 1px #0a0a0a, inset -2px -2px #dfdfdf, inset 2px 2px #808080',
            },
            '.Input--invalid': {
                color: '#DF1B41',
            },
            '.Tab, .Block': {
                boxShadow:
                    'inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf',
            },
            '.Tab:hover': {
                backgroundColor: '#eee',
            },
            '.Tab--selected, .Tab--selected:focus, .Tab--selected:hover': {
                backgroundColor: '#ccc',
            },
        },
    },
    'dark-blue': {
        variables: {
            fontFamily: 'Sohne, system-ui, sans-serif',
            fontWeightNormal: '500',
            borderRadius: '8px',
            colorBackground: '#0A2540',
            colorPrimary: '#EFC078',
            colorPrimaryText: '#1A1B25',
            colorText: 'white',
            colorTextSecondary: 'white',
            colorTextPlaceholder: '#727F96',
            colorIconTab: 'white',
            colorLogo: 'dark',
        },
        rules: {
            '.Input, .Block': { backgroundColor: 'transparent', border: '1.5px solid var(--colorPrimary)' },
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
