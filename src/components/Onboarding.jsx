import {useCallback, useEffect, useState} from 'react';
import styles from './ui/TinderCards.module.css';
import { observer } from 'mobx-react-lite';
import {ONBOARDING_STEPS} from "../constants.js";

export const Onboarding = observer(({
                                        showOnboarding,
                                        onboardingStep,
                                        setOnboardingStep,
                                        simulateSwipe,
                                        isAnimating,
                                        handleSaveChanges,
                                        setUndoButtonHighlight,
                                        setsaveHighlight,
                                        setPopularHighlight
                                    }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        setHeight(window.innerHeight);
    }, [])

    const handleNextOnboardingStep = useCallback(async () => {
        if (isProcessing || isAnimating) return;
        setIsProcessing(true);

        const currentStepData = ONBOARDING_STEPS[onboardingStep];

        if (currentStepData?.swipe) {
            await simulateSwipe(currentStepData.swipe);
        }

        if (onboardingStep === 3) setUndoButtonHighlight(true);
        if (onboardingStep === 4) {
            setUndoButtonHighlight(false);
            setsaveHighlight(true);
        }
        if (onboardingStep === 5) {
            setsaveHighlight(false);
            setPopularHighlight(true);
        }

        const nextStep = onboardingStep + 1;

        if (nextStep in ONBOARDING_STEPS) {
            setOnboardingStep(nextStep);
        } else {
            setPopularHighlight(false);
            if (handleSaveChanges) {
                await handleSaveChanges();
            }
            setOnboardingStep(0);
        }

        setIsProcessing(false);
    }, [
        onboardingStep,
        isProcessing,
        isAnimating,
        simulateSwipe,
        setOnboardingStep,
        handleSaveChanges,
        setUndoButtonHighlight,
        setsaveHighlight,
        setPopularHighlight
    ]);

    if (!showOnboarding || onboardingStep === 0) return null;

    const currentStep = ONBOARDING_STEPS[onboardingStep];

    if (!currentStep) return null;

    return (
        <div className={styles.onboardingOverlay} style={{height: height}} role="dialog" aria-modal="true">
            {currentStep.images && currentStep.images.map((img, index) => (
                <img key={index} src={img.src} alt={img.alt} style={img.style} />
            ))}
            <div className={styles.onboardingContent}>
                <p className={styles.onboardingText}>{currentStep.text}</p>
                <div className={styles.onboardingBlock}>
                    <p>{currentStep.page}</p>
                    <button
                        className={styles.onboardingButton}
                        onClick={handleNextOnboardingStep}
                        // disabled={isProcessing || isAnimating}
                    >
                        {onboardingStep === 6 ? 'Go on' : 'Далее'}
                    </button>
                </div>
            </div>
        </div>
    );
});