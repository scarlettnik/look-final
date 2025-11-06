import { useState, useEffect } from 'react';
import styles from '../../ui/OnboardingModal.module.css';
import FullScreenButton from "../FullScrinButton.jsx";
import SizeGrid from "../size/SizeGrid.jsx";
import ParamsTab from "../size/ParamsTab.jsx";
import FitOptions from "../size/FitOptions.jsx";
import useIsKeyboardOpen from "../../../hooks/useIsKeyboardOpen.js";

const SizeStep = ({ params, updateParam, onUpdate, onNext, onSkip, onBack }) => {
    const [activeTab, setActiveTab] = useState("size");
    const [height, setHeight] = useState(0);

    useEffect(() => {
        setHeight(window.innerHeight*0.4);
    }, [])

    const isKeyboardOpen = useIsKeyboardOpen();

    const handleNext = () => {
        onNext();
    };

    return (
        <div className={styles.onboardingStep}>
            <div className={styles.stepHeader}>
                <button
                    style={{zIndex: 9999}}
                    className={styles.backButton}
                    onClick={onBack}
                >
                    <img src='/subicons/whitearrowleft.svg' alt="Назад"/>
                </button>
                <p className={styles.stepTitle}>Выберите размер или параметры</p>
            </div>
            <div className={styles.tabs}>
                <button
                    className={`${styles.tabButton} ${activeTab === "size" ? styles.active : ''}`}
                    onClick={() => setActiveTab("size")}
                >
                    Размер
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === "params" ? styles.active : ''}`}
                    onClick={() => setActiveTab("params")}
                >
                    Параметры
                </button>
            </div>
            <div className={styles.paramsBlock} style={{height: height}}>
                <div className={styles.tabContent}>
                    {activeTab === "size" && (
                        <SizeGrid
                            color='var(--ultralight-gray)'
                            params={params}
                            updateParam={updateParam}
                        />
                    )}

                    {activeTab === "params" && (
                        <ParamsTab
                            params={params}
                            updateParam={updateParam}
                        />
                    )}

                    <div style={{width:'calc(92vw-1vh)'}} className={styles.fitOptionsWrapper}>
                        <p className={styles.text}>Ношу одежду</p>
                        <FitOptions
                            params={params}
                            updateParam={(value) => updateParam('wearing_styles', value)}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.actions}>
                <FullScreenButton
                    color='var(--beige)'
                    textColor='var(--black)'
                    onClick={handleNext}
                >
                    Далее
                </FullScreenButton>
                {!isKeyboardOpen &&
                    <button
                        className={styles.secondaryButton}
                        onClick={onSkip}
                    >
                        Пропустить
                    </button>
                }
            </div>
        </div>
    );
};

export default SizeStep;