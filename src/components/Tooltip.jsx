import React, { useEffect, useRef, useState } from 'react';
import '../styles/Tooltip.css';
// import bgImg from '../assets/image/tech1.jpg';
import { FaArrowRightLong } from "react-icons/fa6";

function Tooltip({ children, content, onClick, isOpen, classTooltip, path, bgImg }) {
    const [tooltipOpen, setTooltipOpen] = useState(isOpen);
    const tooltipRef = useRef(null);

    const handleClick = () => {
        if (onClick && typeof onClick === 'function') {
            onClick();
        }
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

    const onOpenWindow = () => {
        if (path) {
            window.open(path);
            console.log('path', path);
        }
    };

    return (
        <div className="tooltip-container" ref={tooltipRef}>
            <div className="icon-container" onClick={handleClick}>
                {children}
            </div>
            {tooltipOpen && (
                <div className={classTooltip} onClick={(e) => { onOpenWindow(path) }}>
                    <div className='tooltip-body'>
                        <img src={bgImg} alt="img" className='tooltip-img' />
                        <FaArrowRightLong className='arrow-icon_up' />
                        <FaArrowRightLong className='arrow-icon' />
                        <FaArrowRightLong className='arrow-icon_down' />
                        <FaArrowRightLong className='arrow-icon_top' />
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
