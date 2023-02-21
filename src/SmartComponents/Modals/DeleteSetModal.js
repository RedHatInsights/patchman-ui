import React, { useState } from 'react';
import propTypes from 'prop-types';
import { Button, Checkbox, Modal } from '@patternfly/react-core';
import { injectIntl } from 'react-intl';
import messages from '../../Messages';

const DeleteSetModal = ({ intl, isModalOpen, setModalOpen, templateName, onConfirm }) => {
    const [isCheckboxChecked, setCheckboxChecked] = useState(false);

    const onClose = () => {
        setModalOpen(false);
        setCheckboxChecked(false);
    };

    return (
        <Modal
            title={intl.formatMessage(messages.titlesTemplateDeleteModalTitle)}
            titleIconVariant="warning"
            isOpen={isModalOpen}
            onClose={onClose}
            variant="small"
            actions={[
                <Button key="confirm" variant="danger" onClick={() => {onClose(); onConfirm();}} isDisabled={!isCheckboxChecked}>
                    {intl.formatMessage(messages.labelsDelete)}
                </Button>,
                <Button key="cancel" variant="link" onClick={onClose}>
                    {intl.formatMessage(messages.labelsCancel)}
                </Button>
            ]}
        >
            {intl.formatMessage(messages.titlesTemplateDeleteModalText, { templateName, b: (...chunks) => <b>{chunks}</b> })}
            <Checkbox
                className="pf-u-mt-md"
                isChecked={isCheckboxChecked}
                checked={isCheckboxChecked}
                onChange={(value) => setCheckboxChecked(value)}
                label={intl.formatMessage(messages.titlesTemplateDeleteModalCheckbox)}
                id="template-delete-modal-checkbox"
            />
        </Modal>
    );
};

DeleteSetModal.propTypes = {
    intl: propTypes.any,
    isModalOpen: propTypes.bool,
    setModalOpen: propTypes.func,
    templateName: propTypes.string,
    onConfirm: propTypes.func
};

export default injectIntl(DeleteSetModal);
