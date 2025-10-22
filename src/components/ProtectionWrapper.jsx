import React from "react";
import PropTypes from "prop-types";
import CountdownPage from "./CountdownPage";
import LoadingSpinner from "./LoadingSpinner";
import { useProtection } from "../hooks/useProtection";
import { protectionWrapperPropTypes } from "../utils/propTypes";

const ProtectionWrapper = ({ children, pageName, onBlockedChange }) => {
  const { isBlocked, isLoading } = useProtection(pageName);

  React.useEffect(() => {
    if (onBlockedChange) {
      onBlockedChange(!isBlocked);
    }
  }, [isBlocked, onBlockedChange]);

  if (isLoading) {
    return (
      <LoadingSpinner 
        size="xlarge" 
        message="Koruma ayarları kontrol ediliyor..." 
        color="purple"
        fullScreen={true}
      />
    );
  }

  if (isBlocked) {
    return <CountdownPage />;
  }

  return children;
};

ProtectionWrapper.propTypes = {
  ...protectionWrapperPropTypes,
  onBlockedChange: PropTypes.func,
};

export default ProtectionWrapper;
