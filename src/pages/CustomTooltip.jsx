// import React from 'react';

// const CustomTooltip = ({ children, content }) => (
//   <Tooltip content={content}>
//     {children}
//   </Tooltip>
// );

// export default CustomTooltip;


import React from 'react';
import PropTypes from 'prop-types';

const CustomTooltip = ({ content, children }) => {
    return (
        <div className="tooltip">
            <span className="tooltiptext">{content}</span>
            {children}
        </div>
    );
};

CustomTooltip.propTypes = {
    content: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired,
};

export default CustomTooltip;

