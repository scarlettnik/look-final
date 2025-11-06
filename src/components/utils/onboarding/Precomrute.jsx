import React, { useState, useEffect } from 'react';
import styles from '../../ui/precompute.module.css';
import FullScreenButton from "../FullScrinButton.jsx";
import ButtonWrapper from "../ButtonWrapper.jsx";

const Precompute = ({onNext}) => {
    const [count, setCount] = useState(1);
    const images = [
        '/styles/y2k.png',
        '/styles/streetwear.png',
        '/styles/minimalist.png',
        '/styles/romantic.png',
        '/styles/bohemian.png',
        '/styles/preppy.png',
        '/styles/gothic.png',
        '/styles/punk.png'
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((prev) => (prev < 100 ? prev + 1 : 100));
        }, 40);

        return () => clearInterval(interval);
    }, []);


    return (
        <>
            <p style={{
                color: 'var(--white)',
                fontSize:'24px',
                marginTop: '20px',
                lineHeight: '1.2'
            }}>
                Собираем гардероб, <br/>секундочку...
            </p>
        <div className={styles.wrapper}>
            <div className={styles.spinner}>
                {images.map((src, i) => (
                    <div
                        key={i}
                        className={styles.imageContainer}
                        style={{
                            transform: `rotate(${i * 45}deg) translate(100px)`
                        }}
                    >
                        <img
                            src={src}
                            alt="orbit"
                            className={styles.image}
                            style={{ transform: 'rotate(105deg)' }}
                        />
                    </div>
                ))}
            </div>
            <div className={styles.centerText}>{count}%</div>

        </div>
            <ButtonWrapper>
                <FullScreenButton
                    color='var(--beige)'
                    textColor='var(--black)'
                    onClick={onNext}
                    disabled={count < 100}
                >
                    Далее
                </FullScreenButton>
            </ButtonWrapper>
            </>
    );
};

export default Precompute;