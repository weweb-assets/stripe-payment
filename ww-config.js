export default {
    editor: {
        label: 'Stripe - Element',
        icon: 'stripe',
    },
    properties: {
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
