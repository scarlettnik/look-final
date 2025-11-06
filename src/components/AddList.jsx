import React, { useState, useEffect, useRef } from 'react';
import styles from './ui/addList.module.css';
import ButtonWrapper from "./utils/ButtonWrapper.jsx";
import FullScreenButton from "./utils/FullScrinButton.jsx";
import useIsKeyboardOpen from "../hooks/useIsKeyboardOpen.js";
import {coverImages} from "../constants.js";

function AddList({
                     onCreate,
                     onUpdate,
                     collection = null,
                     coverImage
                 }) {
    const [closetName, setClosetName] = useState('');
    const [selectedCover, setSelectedCover] = useState(coverImage || '');
    const isKeyboardOpen = useIsKeyboardOpen();

    useEffect(() => {
        if (collection) {
            setClosetName(collection.name);
            setSelectedCover(collection.cover_image_url || coverImage || '');
        } else {
            setSelectedCover(coverImage || coverImages[0].url);
        }
    }, [collection, coverImage]);

    const handleSave = () => {
        if (!closetName.trim()) return;

        if (collection) {
            onUpdate(closetName, selectedCover || coverImage);
        } else {
            onCreate(closetName, selectedCover);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h2 className={styles.title}>
                    {collection ? "Редактировать подборку" : "Создать подборку"}
                </h2>

                <label className={styles.label}>Название</label>
                <input
                    type="text"
                    value={closetName === '__FAVOURITES__' ? 'Лайки' : closetName}
                    onChange={(e) => setClosetName(e.target.value)}
                    className={styles.input}
                    placeholder="Введите название подборки"
                />

                <label className={styles.label}>Обложка</label>
                <div className={styles.selectedCover}>
                    {selectedCover ? (
                        <img
                            src={selectedCover}
                            alt="Selected cover"
                            className={styles.previewImage}
                        />
                    ) : (
                        <div className={styles.placeholderCover} />
                    )}
                </div>

                <div className={styles.coverGrid}>
                    {coverImages.map((img) => (
                        <div
                            key={img.url}
                            className={styles.coverThumbContainer}
                            onClick={() => setSelectedCover(img.url)}
                        >
                            <img
                                src={img.url}
                                className={`${styles.coverThumb} ${selectedCover === img.url ? styles.active : ''}`}
                                alt="Cover option"
                            />
                            {selectedCover === img.url && (
                                <div className={styles.coverOverlay}>
                                    <img
                                        src="/subicons/checkmark.svg"
                                        className={styles.butterflyIcon}
                                        alt="Selected"
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {!isKeyboardOpen && (
                <ButtonWrapper>
                    <FullScreenButton
                        onClick={handleSave}
                        disabled={!closetName.trim()}
                    >
                        {collection ? "Сохранить изменения" : "Сохранить подборку"}
                    </FullScreenButton>
                </ButtonWrapper>
            )}
        </div>
    );
}

export default AddList;