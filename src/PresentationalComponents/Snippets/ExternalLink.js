import ExternalLinkAltIcon from '@patternfly/react-icons/dist/js/icons/external-link-alt-icon';
import propTypes from 'prop-types';
import React from 'react';

const ExternalLink = ({ link, text }) => (
  <a href={link} target='_blank' rel='noreferrer'>
    {text}
    <span className='pf-v6-u-text-nowrap'>
      {'\u200d'}
      <ExternalLinkAltIcon className='pf-v6-u-ml-xs' />
    </span>
  </a>
);

ExternalLink.propTypes = {
  link: propTypes.string,
  text: propTypes.string,
};

export default ExternalLink;
