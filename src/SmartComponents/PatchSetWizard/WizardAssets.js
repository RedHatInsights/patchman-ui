import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

export const reviewSystemColumns = [{
    key: 'display_name',
    title: 'Name',
    props: {
        width: 40
    }
},
{
    title: 'OS',
    key: 'os',
    props: {
        width: 60
    }
}
];

export const configurationFields = [
    {
        name: 'configuration-step',
        component: 'configuration-step'
    },
    {
        name: 'existing_patch_set',
        component: componentTypes.TEXT_FIELD,
        hidden: true
    }
];

export const nameComponent = [{
    name: 'name',
    component: 'nameField',
    validate: [{ type: validatorTypes.REQUIRED }]
}];

export const descriptionComponent = [{
    name: 'description',
    component: 'descriptionField'
}];

export const toDateComponent = [{
    name: 'toDate',
    component: 'toDateField',
    validate: [{ type: validatorTypes.REQUIRED }]
}];

export const schema = (patchSetID) => ({
    fields: [
        {
            component: componentTypes.WIZARD,
            name: 'patch-set-wizard',
            isDynamic: true,
            inModal: true,
            showTitles: true,
            title: intl.formatMessage(messages.patchSetTitle),
            description: intl.formatMessage(messages.patchSetDescription),
            fields: [
                {
                    name: 'patch-set-config',
                    title: intl.formatMessage(patchSetID && messages.patchSetEditSet || messages.patchSetNewSet),
                    fields: configurationFields,
                    nextStep: 'systems'
                },
                {
                    name: 'systems',
                    title: intl.formatMessage(messages.patchSetSelectSystems),
                    fields: [
                        {
                            name: 'systems',
                            component: 'review-systems',
                            validate: [{ type: 'validate-systems' }]
                        }
                    ],
                    nextStep: 'review'
                },
                {
                    name: 'review',
                    title: intl.formatMessage(messages.patchSetReviewSet),
                    fields: [
                        {
                            name: 'review',
                            component: 'review-patch-set'
                        }
                    ]
                }

            ]

        }
    ]
});

export const validatorMapper = {
    'validate-systems': () => (system) => {
        if (system === undefined) {
            return;
        }
        else if (system.length > 0) {
            return;
        } else {
            return intl.formatMessage(messages.patchSetNoSystemSelected);
        }
    }
};
