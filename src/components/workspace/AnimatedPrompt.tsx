
import { useTypingEffect } from '@/hooks/useTypingEffect';

export const AnimatedPrompt = ({ text }: { text: string }) => {
    const displayText = useTypingEffect(text);
    return <>{displayText}</>;
};
