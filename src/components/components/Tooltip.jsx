import React, { useEffect, useRef, useState } from 'react';
import '../styles/Tooltip.css';
import bgImg from '../assets/image/tech1.jpg'

function Tooltip({ children, content, onClick, isOpen,classTooltip }) {

    const [tooltipOpen, setTooltipOpen] = useState(isOpen);
    const tooltipRef = useRef(null);

    const handleClick = () => {
        onClick();
    };


    const handleOutsideClick = (event) => {
        if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
            setTooltipOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    useEffect(() => {
        setTooltipOpen(isOpen);
    }, [isOpen]);



    return (
        <div className="tooltip-container"  ref={tooltipRef}>
            <div className="icon-container" onClick={handleClick}>
                {children}
            </div>
            {tooltipOpen && (
                <div className={classTooltip}>
                    <div className='tooltip-body'>
                        <img src={bgImg} alt="img" className='tooltip-img' />
                        <span className='tooltip-text'>
                            {content}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Tooltip;

