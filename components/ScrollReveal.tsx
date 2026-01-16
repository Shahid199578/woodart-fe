import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
    children: React.ReactNode;
    animation?: 'slide-up' | 'fade-in' | 'scale-up' | 'slide-right' | 'slide-left';
    delay?: number; // ms
    duration?: number; // ms
    className?: string; // extra classes
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
    children,
    animation = 'slide-up',
    delay = 0,
    duration = 800,
    className = ''
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(entry.target);
            }
        }, {
            threshold: 0.1, // Trigger when 10% visible
            rootMargin: '50px',
        });

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) observer.unobserve(ref.current);
        };
    }, []);

    const getAnimationClass = () => {
        switch (animation) {
            case 'slide-up': return 'translate-y-0 opacity-100';
            case 'fade-in': return 'opacity-100';
            case 'scale-up': return 'scale-100 opacity-100';
            case 'slide-right': return 'translate-x-0 opacity-100';
            case 'slide-left': return 'translate-x-0 opacity-100';
            default: return 'opacity-100';
        }
    };

    const getInitialClass = () => {
        switch (animation) {
            case 'slide-up': return 'translate-y-20 opacity-0';
            case 'fade-in': return 'opacity-0';
            case 'scale-up': return 'scale-95 opacity-0';
            case 'slide-right': return '-translate-x-20 opacity-0';
            case 'slide-left': return 'translate-x-20 opacity-0';
            default: return 'opacity-0';
        }
    };

    return (
        <div
            ref={ref}
            className={`transition-all cubic-bezier(0.2, 0.8, 0.2, 1) ${isVisible ? getAnimationClass() : getInitialClass()} ${className}`}
            style={{ transitionDuration: `${duration}ms`, transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};
