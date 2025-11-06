import React, {useEffect, useRef, useState} from 'react';
import styles from '../../ui/aboutStep.module.css';
import FullScreenButton from "../FullScrinButton.jsx";
import titleStyle from '../../ui/OnboardingModal.module.css'

const AboutStep = ({ age, onUpdate, onNext, onSkip, onBack }) => {
    const sliderRef = useRef(null);
    const [valuePosition, setValuePosition] = useState(0);
    const handleBack = (e) => {
        e.stopPropagation();
        onBack();
    };

    useEffect(() => {
        if (sliderRef.current) {
            const sliderWidth = sliderRef.current.offsetWidth * 0.96;
            const min = 16;
            const max = 80;
            const thumbSize = 20;

            const ratio = (age - min) / (max - min);

            const position = ratio * (sliderWidth - thumbSize) + (thumbSize / 2);

            setValuePosition(position);
        }
    }, [age]);

    return (
        <div className={styles.container}>
            <div className={titleStyle.stepHeader}>
                <button
                    style={{zIndex: 9999}}
                    className={titleStyle.backButton}
                    onClick={handleBack}
                >
                    <img src='/subicons/whitearrowleft.svg' alt="Назад"/>
                </button>
                <p className={titleStyle.stepTitle}>Выберите пол и возраст</p>
            </div>

            <div className={styles.genderContainer}>
                <button
                    className={`${styles.genderOption} ${styles.selected}`}
                    onClick={() => onUpdate({gender: 'female'})}
                >
                    Девушка
                </button>
                <button
                    className={`${styles.genderOption}`}
                    onClick={() => onUpdate({gender: 'male'})}
                    disabled={true}
                >
                    Парень*
                </button>
                <p style={{fontSize: '8px', fontWeight: '400', color: 'var(--beige)'}}>
                    *В разработке
                </p>
            </div>

            <div className={styles.sliderWrapper} ref={sliderRef}>
                <input
                    type="range"
                    min="16"
                    max="80"
                    value={age}
                    onChange={(e) => onUpdate('age', Number(e.target.value))}
                    className={styles.ageSlider}
                />
                <div
                    className={styles.ageValue}
                    style={{
                        marginLeft: '2%',
                        left: `${valuePosition}px`,
                        transform: 'translateX(-50%)'
                    }}
                >
                    {age}
                </div>
            </div>


            <div className={styles.actions}>
                <FullScreenButton
                    color='var(--beige)'
                    textColor='var(--black)'
                    className={styles.primaryButton}
                    onClick={onNext}
                >
                    Далее
                </FullScreenButton>
                <button
                    className={styles.secondaryButton}
                    onClick={onSkip}
                >
                    Войти без регистрации
                </button>
            </div>
        </div>
    );
};

export default AboutStep;