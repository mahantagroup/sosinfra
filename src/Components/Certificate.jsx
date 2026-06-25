
import React, { forwardRef } from 'react';
import './Certificate.css';

const Certificate = forwardRef((props, ref) => {
  const { fullName } = props;

  return (
    <div ref={ref} className="certificate-container">
      <div className="recipient-name">{fullName || 'NAME'}</div>
    </div>
  );
});

Certificate.displayName = 'Certificate';

export default Certificate;
