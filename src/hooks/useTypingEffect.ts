
import { useState, useEffect } from 'react';

export const useTypingEffect = (text: string = '', speed: number = 10) => {
    const [displayText, setDisplayText] = useState('');

    useEffect(() => {
        // Reset the animation when the text changes.
        setDisplayText('');
    }, [text]);

    useEffect(() => {
        if (text && displayText.length < text.length) {
            const timer = setTimeout(() => {
                setDisplayText(text.substring(0, displayText.length + 1));
            }, speed);
            return () => clearTimeout(timer);
        }
    }, [displayText, text, speed]);

    return displayText;
};
