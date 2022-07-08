export default {
    editor: {
        label: 'Stripe - Payment',
        icon: 'stripe',
    },
    properties: {
        labels: {
            label: 'Labels',
            type: 'TextSelect',
            options: {
                options: [
                    { label: 'Above', value: 'above' },
                    { label: 'Floating', value: 'floating' },
                ],
            },
            defaultValue: 'above',
        },
        theme: {
            label: 'Theme',
            type: 'TextSelect',
            options: {
                options: [
                    { label: 'Stripe', value: 'stripe' },
                    { label: 'Night', value: 'night' },
                    { label: 'Flat', value: 'flat' },
                    { label: 'None', value: 'none' },
                ],
            },
            defaultValue: 'stripe',
        },
        colorPrimary: {
            label: 'Primary color',
            type: 'Color',
            options: { nullable: true },
            hidden: content => content.theme !== 'none',
        },
        colorBackground: {
            label: 'Background color',
            type: 'Color',
            options: { nullable: true },
            hidden: content => content.theme !== 'none',
        },
        colorText: {
            label: 'Text color',
            type: 'Color',
            options: { nullable: true },
            hidden: content => content.theme !== 'none',
        },
        colorDanger: {
            label: 'Danger color',
            type: 'Color',
            options: { nullable: true },
        },
        fontFamily: {
            label: 'Font family',
            type: 'FontFamily',
        },
        fontSizeBase: {
            label: 'Font size',
            type: 'Length',
            options: {
                unitChoices: [
                    { value: 'px', label: 'px', min: 1, max: 100 },
                    { value: 'em', label: 'em', min: 1, max: 10, digits: 2 },
                    { value: 'rem', label: 'rem', min: 1, max: 10, digits: 2 },
                ],
            },
            responsive: true,
            defaultValue: '16px',
        },
        borderRadius: {
            label: 'Border radius',
            type: 'Length',
            options: { unitChoices: [{ value: 'px', label: 'px', min: 0, max: 100 }] },
            defaultValue: '4px',
            responsive: true,
        },
        spacingUnit: {
            label: 'Spacing',
            type: 'Length',
            options: { unitChoices: [{ value: 'px', label: 'px', min: 0, max: 100 }] },
            defaultValue: '4px',
            responsive: true,
        },
        clientSecret: {
            label: 'Client secret',
            type: 'Text',
            options: { placeholder: 'pi_********' },
            bindable: true,
            defaultValue: '',
            section: 'settings',
        },
    },
};
