import PropTypes from 'prop-types';

// Common prop types
export const commonPropTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  onRetry: PropTypes.func,
  isLoading: PropTypes.bool,
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.instanceOf(Error)
  ]),
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  color: PropTypes.oneOf(['purple', 'blue', 'pink', 'cyan', 'green', 'red']),
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info', 'question']),
};

// Component specific prop types
export const photoCardPropTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  borderColor: PropTypes.string,
  shadowColor: PropTypes.string,
  hoverShadowColor: PropTypes.string,
  placeholderIcon: PropTypes.string,
  placeholderText: PropTypes.string,
};

export const characterCardPropTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  borderColor: PropTypes.string,
};

export const loadingSpinnerPropTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  message: PropTypes.string,
  color: PropTypes.oneOf(['purple', 'blue', 'pink', 'cyan', 'green', 'red']),
  fullScreen: PropTypes.bool,
};

export const errorMessagePropTypes = {
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.instanceOf(Error)
  ]).isRequired,
  onRetry: PropTypes.func,
  title: PropTypes.string,
  showDetails: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

export const modalPropTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info', 'question']),
  onConfirm: PropTypes.func,
};

export const protectionWrapperPropTypes = {
  children: PropTypes.node.isRequired,
  pageName: PropTypes.string.isRequired,
};

export const countdownPagePropTypes = {
  // No props for now, but keeping for future extensibility
};

export const stepNavigationPropTypes = {
  // No props for now, but keeping for future extensibility
};
