import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';
import { filterSelectedActiveSystemIDs } from '../../Utilities/Helpers';
import dateValidator from '../../Utilities/dateValidator';
import { sortable } from '@patternfly/react-table/dist/js';
import React, { Fragment } from 'react';

export const reviewSystemColumns = [{
    key: 'display_name',
    title: 'Name',
    props: {
        width: 40
    },
    transforms: [sortable]
},
{
    title: 'OS',
    key: 'operating_system',
    props: {
        width: 20
    },
    transforms: [sortable]
},
{
    key: 'baseline_name',
    title: 'Template',
    props: {
        width: 20
    },
    transforms: [sortable]
},
{
    key: 'last_upload',
    title: 'Last seen',
    props: {
        width: 20
    },
    transforms: [sortable]
}
];

export const configurationFields = [
    {
        name: 'configurationStep',
        component: 'configurationStep'
    },
    {
        name: 'existing_patch_set',
        component: componentTypes.TEXT_FIELD,
        hidden: true
    }
];

export const contentStep = [
    {
        name: 'contentStep',
        component: 'contentStep'
    }
];

export const nameComponent = [{
    name: 'name',
    component: 'nameField',
    validate: [
        { type: validatorTypes.REQUIRED },
        { type: 'validate-name' }
    ]
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
        { type: 'validate-date' }
    ]
}];

export const getWizardTitle = (wizardType) => {
    return (wizardType === 'edit')
        ? intl.formatMessage(messages.templateEdit)
        : intl.formatMessage(messages.templateTitle);
};

export const schema = (wizardType) => {
    return ({
        fields: [
            {
                component: componentTypes.WIZARD,
                name: 'patch-set-wizard',
                isDynamic: true,
                inModal: true,
                title: getWizardTitle(wizardType),
                description: <Fragment>
                    {intl.formatMessage(messages.templateDescription)}
                    {/*
                    <a href={TEMPLATES_DOCS_LINK} target="__blank" rel="noopener noreferrer" className="pf-u-ml-sm">
                        {intl.formatMessage(messages.labelsDocumentation)}
                        <ExternalLinkAltIcon className="pf-u-ml-xs"/>
                    </a>*/}
                </Fragment>,
                fields: [
                    {
                        name: 'template-content',
                        title: intl.formatMessage(messages.templateContentStepSidebarName),
                        fields: contentStep,
                        nextStep: 'template-details'
                    },
                    {
                        name: 'template-details',
                        title: intl.formatMessage(messages.templateDetailStepSidebarName),
                        fields: configurationFields,
                        nextStep: 'template-systems'
                    },
                    {
                        name: 'template-systems',
                        title: intl.formatMessage(messages.templateStepSystems),
                        fields: [
                            {
                                name: 'systems',
                                component: 'reviewSystems'
                                //We can use this later in case UX wantes to prevent patch template s without zero systems
                                //validate: [{ type: 'validate-systems' }]
                            }
                        ],
                        nextStep: 'template-review'
                    },
                    {
                        name: 'template-review',
                        title: intl.formatMessage(messages.templateReview),
                        fields: [
                            {
                                name: 'review',
                                component: 'reviewPatchSet'
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
            return intl.formatMessage(messages.templateNoSystemSelected);
        }
    },
    'validate-date': () => dateValidator,
    'validate-name': () => (name, formValues) => {
        if (formValues.takenBaselineNamesLoading || formValues.templateDetailLoading) {
            return intl.formatMessage(messages.templateWizardValidateLoading);
        }

        if (formValues.previousName !== name && formValues.takenBaselineNames.includes(name)) {
            return intl.formatMessage(messages.templateWizardValidateNameTaken);
        }
    }
};

export const apiFailedNotification = (description) => ({
    title: 'There was an error while processing your request',
    description,
    variant: 'danger'
});
