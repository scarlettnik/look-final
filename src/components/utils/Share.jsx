import { useState } from 'react';
import styles from '../ui/share.module.css';
import FullScreenButton from "./FullScrinButton.jsx";
import {BOTNAME, shareButtons} from "../../constants.js";

const Share = ({ id }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(`https://t.me/${BOTNAME}?startapp=collection_${id}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            alert('Ошибка копирования');
        }
    };

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Поделиться</h3>
            <div className={styles.scrollContainer}>
                <div className={styles.scrollContent}>
                    {shareButtons.map(({ Button, Icon, name }) => (
                        <div className={styles.scrollItem} key={name}>
                            <Button url={`https://t.me/${BOTNAME}?startapp=collection_${id}`}>
                                <div className={styles.iconContainer}>
                                    <Icon size={64} round />
                                    <span className={styles.iconLabel}>{name}</span>
                                </div>
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.copyButton}>
                <FullScreenButton onClick={handleCopy} title="Скопировать ссылку">
                    Копировать ссылку
                </FullScreenButton>
            </div>

            {copied && <div className={styles.toast}>Ссылка скопирована!</div>}
        </div>
    );
};

export default Share;