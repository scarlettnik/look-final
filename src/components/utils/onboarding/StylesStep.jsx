import { useEffect, useState } from 'react';
import styles from '../../ui/OnboardingModal.module.css';
import CustomCheckbox from "../CustomCheckbox.jsx";
import FullScreenButton from "../FullScrinButton.jsx";
import CustomSkeleton from "../CustomSkeleton.jsx";
import {CLOTH_STYLES} from "../../../constants.js";
import ButtonWrapper from "../ButtonWrapper.jsx";

const StylesStep = ({ selectedStyles, onUpdate, onNext, onSkip, onBack }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [loadedImages, setLoadedImages] = useState({});
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowContent(true);
            setIsLoading(false);
        }, 300);

        CLOTH_STYLES.forEach(style => {
            const img = new Image();
            img.src = style.url;
            img.onload = img.onerror = () => {
                setLoadedImages(prev => ({ ...prev, [style.id]: true }));
            };
        });

        return () => clearTimeout(timer);
    }, []);

    const handleStyleToggle = (styleName) => {
        onUpdate('styles', styleName);
    };

    const handleCardClick = (styleName) => {
        handleStyleToggle(styleName);
    };

    if (!showContent) {
        return (
            <div className={styles.onboardingStep}>
                <div className={styles.stepHeader}>
                    <button style={{zIndex: 9999}}
                            className={styles.backButton}
                            onClick={onBack}>
                        <img src='/subicons/whitearrowleft.svg' alt="Назад" />
                    </button>
                    <p className={styles.stepTitle}>Выберите стили</p>
                </div>

                <div className={styles.scrollContainer}>
                    <div className={styles.styleGrid}>
                        {Array.from({ length: Math.min(6, CLOTH_STYLES.length) }).map((_, index) => (
                            <CustomSkeleton
                                key={index}
                                className={styles.styleCard}
                                style={{ height: '200px' }}
                            />
                        ))}
                    </div>
                </div>

                <div className={styles.onboardingActions}>
                    <ButtonWrapper>
                        <FullScreenButton
                            color='var(--beige)'
                            textColor='var(--black)'
                            className={`${styles.onboardingButton} ${styles.primary}`}
                            disabled={true}
                        >
                            Загрузка...
                        </FullScreenButton>
                        <button className={styles.secondaryButton} disabled>
                            Пропустить
                        </button>
                    </ButtonWrapper>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.onboardingStep}>
            <div className={styles.stepHeader}>
                <button style={{zIndex: 9999}} className={styles.backButton} onClick={onBack}>
                    <img src='/subicons/whitearrowleft.svg' alt="Назад" />
                </button>
                <p className={styles.stepTitle}>Выберите стили</p>
            </div>

            <div className={styles.scrollContainer}>
                <div className={styles.styleGrid}>
                    {CLOTH_STYLES.map(style => (
                        <div
                            key={style.id}
                            /* eslint-disable-next-line react/prop-types */
                            className={`${styles.styleCard} ${(!selectedStyles.includes(style.name) ? '' : styles.selected)}`}
                            onClick={() => handleCardClick(style.name)}
                        >
                            <div style={{height: '250px'}}>
                                <img
                                    src={style.url}
                                    alt={style.name}
                                    className={styles.styleImage}
                                    loading="lazy"
                                    onError={(e) => {
                                        e.target.src = '/placeholder-style.jpg';
                                    }}
                                />
                            </div>
                            <div className={styles.styleContent}>
                                <CustomCheckbox
                                    className={styles.styleCheckbox}
                                    /* eslint-disable-next-line react/prop-types */
                                    checked={selectedStyles.includes(style.name)}
                                    onChange={() => handleStyleToggle(style.name)}
                                />
                                <span className={styles.styleName}>{style.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.onboardingActions}>
                <ButtonWrapper>
                    <FullScreenButton
                        color='var(--beige)'
                        textColor='var(--black)'
                        className={`${styles.onboardingButton} ${styles.primary}`}
                        onClick={onNext}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Загрузка...' : 'Вперед'}
                    </FullScreenButton>
                    <button
                        className={styles.secondaryButton}
                        onClick={onSkip}
                        disabled={isLoading}
                    >
                        Пропустить
                    </button>
                </ButtonWrapper>
            </div>
        </div>
    );
};

export default StylesStep;