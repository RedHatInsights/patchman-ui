import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';
import { filterSelectedActiveSystemIDs } from '../../Utilities/Helpers';

export const reviewSystemColumns = [{
    key: 'display_name',
    title: 'Name',
    props: {
        width: 50
    }
},
{
    title: 'OS',
    key: 'os',
    props: {
        width: 25
    }
},
{
    key: 'baseline_name',
    title: 'Patch set',
    props: {
        width: 25
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
    validate: [
        { type: validatorTypes.REQUIRED },
        { type: validatorTypes.PATTERN,
            pattern: /^(\d{4})-(\d{2})-(\d{2})$/
        }
    ]
}];

export const schema = (wizardType) =>{
    let wizardTitle = '';

    switch (wizardType) {
        case 'assign':
            wizardTitle = intl.formatMessage(messages.patchSetTitleAssignSystem);
            break;
        case 'edit':
            wizardTitle = intl.formatMessage(messages.patchSetTitleEdit);
            break;
        default:
            wizardTitle = intl.formatMessage(messages.patchSetTitleCreate);
    }

    return ({
        fields: [
            {
                component: componentTypes.WIZARD,
                name: 'patch-set-wizard',
                isDynamic: true,
                inModal: true,
                showTitles: true,
                title: wizardTitle,
                description: intl.formatMessage(messages.patchSetDescription),
                fields: [
                    {
                        name: 'patch-set-config',
                        title: intl.formatMessage(wizardType === 'edit' ? messages.patchSetEditSet : messages.patchSetNewSet),
                        fields: configurationFields,
                        nextStep: 'systems'
                    },
                    {
                        name: 'systems',
                        title: intl.formatMessage(messages.patchSetSelectSystems),
                        fields: [
                            {
                                name: 'systems',
                                component: 'review-systems'
                                //We can use this later in case UX wantes to prevent patch sets without zero systems
                                //validate: [{ type: 'validate-systems' }]
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
};

export const validatorMapper = {
    'validate-systems': () => (formValueSystems) => {
        const systems = filterSelectedActiveSystemIDs(formValueSystems);

        if (systems === undefined) {
            return;
        }
        else if (systems.length > 0) {
            return;
        } else {
            return intl.formatMessage(messages.patchSetNoSystemSelected);
        }
    }
};
