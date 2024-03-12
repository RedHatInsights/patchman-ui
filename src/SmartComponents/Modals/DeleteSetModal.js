import React, { useState } from 'react';
import propTypes from 'prop-types';
import { Button, Checkbox, Modal } from '@patternfly/react-core';
import messages from '../../Messages';
import { intl } from '../../Utilities/IntlProvider';

const DeleteSetModal = ({ isModalOpen, setModalOpen, templateName, onConfirm }) => {
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
                className="pf-v5-u-mt-md"
                isChecked={isCheckboxChecked}
                checked={isCheckboxChecked}
                onChange={(_event, value) => setCheckboxChecked(value)}
                label={intl.formatMessage(messages.titlesTemplateDeleteModalCheckbox)}
                id="template-delete-modal-checkbox"
            />
        </Modal>
    );
};

DeleteSetModal.propTypes = {
    isModalOpen: propTypes.bool,
    setModalOpen: propTypes.func,
    templateName: propTypes.string,
    onConfirm: propTypes.func
};

export default DeleteSetModal;
