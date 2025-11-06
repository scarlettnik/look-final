import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ui/TinderCard.module.css';
import CustomSkeleton from "./utils/CustomSkeleton.jsx";

const TinderCard = ({
                        card,
                        onSwipe,
                        updateSwipeFeedback,
                        zIndex,
                        offset,
                        isTopCard,
                        topCardPosition,
                        swipeProgress,
                        isExpanded,
                        setCardRef,
                        isOnboardingActive,
                        swipeConfig,
                        onSaveClick
                    }) => {
    const [position, setPosition] = useState({ x: 0, y: 0, rotate: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });

    const cardRef = useRef(null);
    const animationFrame = useRef(null);
    const startTime = useRef(0);
    const navigate = useNavigate();

    const [imageLoaded, setImageLoaded] = useState(false);
    const [localStyle, setLocalStyle] = useState({
        transform: 'translate(0,0) rotate(0deg)',
        opacity: 1,
    });

    // const [isInteractive, setIsInteractive] = useState(false);
    // const timeoutRef = useRef(null);
    //
    // useEffect(() => {
    //     if (isTopCard) {
    //         if (timeoutRef.current) {
    //             clearTimeout(timeoutRef.current);
    //         }
    //         timeoutRef.current = setTimeout(() => {
    //             setIsInteractive(true);
    //         }, 200);
    //     } else {
    //         setIsInteractive(false);
    //         if (timeoutRef.current) {
    //             clearTimeout(timeoutRef.current);
    //         }
    //     }
    //     return () => {
    //         if (timeoutRef.current) {
    //             clearTimeout(timeoutRef.current);
    //         }
    //     };
    // }, [isTopCard]);

    useEffect(() => {
        if (card._pending) {
            setLocalStyle({
                transform: 'translate(0,20px) rotate(0deg)',
                opacity: 0,
            });

            requestAnimationFrame(() => {
                setLocalStyle({
                    transform: 'translate(0,0) rotate(0deg)',
                    opacity: 1,
                    transition: 'all 300ms ease-out',
                });
            });
        }
    }, [card._key]);

    useEffect(() => {
        if (cardRef.current) {
            setCardRef(card.id, cardRef.current);
        }
        return () => setCardRef(card.id, null);
    }, [card.id, setCardRef]);

    useEffect(() => {
        if (cardRef.current) {
            cardRef.current.style.zIndex = zIndex;
        }
    }, [zIndex]);

    const handleStart = (clientX, clientY) => {
        // if (!isInteractive || isExpanded) {
        //     return false;
        // }

        if (isExpanded) {
            return false;
        }

        setStartPos({ x: clientX, y: clientY });
        setIsDragging(true);
        startTime.current = Date.now();

        if (cardRef.current) {
            cardRef.current.style.transition = 'none';
        }
        return true;
    };

    const handleMove = (clientX, clientY) => {
        if (!isDragging) return;

        cancelAnimationFrame(animationFrame.current);
        animationFrame.current = requestAnimationFrame(() => {
            const deltaX = clientX - startPos.x;
            const deltaY = clientY - startPos.y;

            const rotate = Math.min(
                Math.max(deltaX * 0.1, -swipeConfig.horizontal.rotationAngle),
                swipeConfig.horizontal.rotationAngle
            );

            setPosition({ x: deltaX, y: deltaY, rotate });

            if (cardRef.current) {
                let scale = 1 - Math.max(0, offset) * 0.03;
                let translateY = 0;
                let translateX = 0;

                if (offset > 0 && topCardPosition) {
                    const progress = Math.min(
                        1,
                        Math.max(
                            Math.abs(topCardPosition.x) / (window.innerWidth * 0.5),
                            Math.abs(topCardPosition.y) / (window.innerHeight * 0.5)
                        )
                    );
                    const influenceFactor = 1 - (offset - 1) * 0.3;
                    if (influenceFactor > 0) {
                        scale += 0.03 * progress * influenceFactor;
                        translateY += -5 * progress * influenceFactor;
                        if (topCardPosition.x !== 0) {
                            const direction = topCardPosition.x > 0 ? 1 : -1;
                            translateX = direction * 5 * progress * influenceFactor;
                        }
                    }
                }

                cardRef.current.style.transform = `translate3d(${deltaX + translateX}px, ${deltaY + translateY}px, 0) rotate(${rotate}deg) scale(${scale})`;
            }

            if (isTopCard) {
                updateSwipeFeedback(deltaX, deltaY);
            }
        });
    };

    const handleEnd = () => {
        if (!isDragging) return;

        setIsDragging(false);
        cancelAnimationFrame(animationFrame.current);

        const { innerWidth, innerHeight } = window;
        const deltaTime = Date.now() - startTime.current;

        const velocity = {
            x: (position.x / (deltaTime || 1)) * swipeConfig.physics.power * swipeConfig.horizontal.speedMultiplier,
            y: (position.y / (deltaTime || 1)) * swipeConfig.physics.power *
                (position.y < 0 ? swipeConfig.verticalUp.speedMultiplier : 0)
        };

        const direction = getSwipeDirection(velocity, innerWidth, innerHeight);

        if (direction) {
            animateSwipe(direction);
        } else {
            resetPosition();
        }
    };

    const getSwipeDirection = (velocity, screenWidth, screenHeight) => {
        const isHorizontalFast = Math.abs(velocity.x) > swipeConfig.physics.velocityThreshold;

        if (Math.abs(position.x) > screenWidth * swipeConfig.horizontal.threshold || isHorizontalFast) {
            return velocity.x > 0 ? 'right' : 'left';
        }

        if (position.y < -screenHeight * swipeConfig.verticalUp.threshold ||
            (velocity.y < -swipeConfig.physics.velocityThreshold)) {
            return 'up';
        }

        return null;
    };


    const animateSwipe = (direction) => {
        if (!cardRef.current) return;
        cardRef.current.style.transition = 'transform 300ms ease-out, opacity 300ms ease-out';

        if (direction === 'left') {
            cardRef.current.style.transform = 'translate3d(-100vw, 0, 0) rotate(-30deg)';
        } else if (direction === 'right') {
            cardRef.current.style.transform = 'translate3d(100vw, 0, 0) rotate(30deg)';
        } else if (direction === 'up') {
            cardRef.current.style.transform = 'translate3d(0, -100vh, 0)';
        }

        setTimeout(() => {
            onSwipe(direction, card);
        }, 50);
    };

    const resetPosition = () => {
        if (!cardRef.current) return;

        cardRef.current.style.transition = `transform ${swipeConfig.horizontal.animationDuration}ms cubic-bezier(0.23, 1, 0.32, 1)`;
        cardRef.current.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';

        const onTransitionEnd = () => {
            cardRef.current?.removeEventListener('transitionend', onTransitionEnd);
            setPosition({ x: 0, y: 0, rotate: 0 });
            if (isTopCard) updateSwipeFeedback(0, 0);
        };

        cardRef.current.addEventListener('transitionend', onTransitionEnd);
    };

    useEffect(() => {
        if (cardRef.current) {
            Object.entries(card.style || {}).forEach(([key, value]) => {
                cardRef.current.style[key] = value;
            });
        }
    }, [card.style]);

    return (
        <div
            ref={cardRef}
            id={card.id}
            className={`${styles.card} 
            ${isDragging ? styles.moving : ''} 
            ${isOnboardingActive ? styles['card-onboarding'] : ''}`}
            onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchEnd={handleEnd}
            onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
            onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            // onTouchStart={(e) => isInteractive && handleStart(e.touches[0].clientX, e.touches[0].clientY)}
            // onTouchMove={(e) => isInteractive && handleMove(e.touches[0].clientX, e.touches[0].clientY)}
            // onTouchEnd={() => isInteractive && handleEnd()}
            // onMouseDown={(e) => isInteractive && handleStart(e.clientX, e.clientY)}
            // onMouseMove={(e) => isInteractive && handleMove(e.clientX, e.clientY)}
            // onMouseUp={() => isInteractive && handleEnd()}
            // onMouseLeave={() => isInteractive && handleEnd()}
            style={{ zIndex, ...localStyle }}
        >
            <div onClick={() => navigate(`/product/${card.id}`)}>
                {!imageLoaded && (
                    <CustomSkeleton
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            zIndex: 2,
                            borderRadius: '8px'
                        }}
                    />
                )}
                <img onLoad={() => setImageLoaded(true)}
                     onError={() => setImageLoaded(true)}
                     className={styles.cardImage} src={card.image_urls[0]} alt={card.name} />
            </div>

            {isTopCard && (
                <>
                    <div className={`${styles.swipeFeedback} ${styles.swipeFeedbackLeft}`}/>
                    <div className={`${styles.swipeFeedback} ${styles.swipeFeedbackRight}`}/>
                    <div
                        className={`${styles.swipeFeedback} ${styles.swipeFeedbackLeft}`}
                        style={{
                            opacity: swipeProgress.direction === 'right' ? swipeProgress.opacity : 0,
                            transform: `scale(${swipeProgress.direction === 'left' ? 0.8 + swipeProgress.opacity * 0.4 : 1})`
                        }}
                    >
                        <img src="/subicons/darklike.svg" alt="Save" style={{width: '80px'}}/>
                    </div>
                    <div
                        className={`${styles.swipeFeedback} ${styles.swipeFeedbackRight}`}
                        style={{
                            opacity: swipeProgress.direction === 'left' ? swipeProgress.opacity : 0,
                            transform: `scale(${swipeProgress.direction === 'right' ? 0.8 + swipeProgress.opacity * 0.4 : 1})`
                        }}
                    >
                        <img src="/subicons/darkdislike.svg" alt="Close" style={{width: '80px'}}/>
                    </div>
                </>
            )}
            <div className={styles.cardContent}>
                <div className={styles.cardBottom}>
                    <div className={styles.cardInfo}>
                        <div className={styles.productName}>{card?.name}</div>
                        <div className={styles.manufacturer}>{card?.brand}</div>
                        <div className={styles.priceRow}>
                            <div className={styles.price}>{card?.discount_price || card?.price} ₽</div>
                            <button
                                className={styles.saveButton}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSaveClick(card);
                                }}
                            >
                                <img
                                    src={card.is_contained_in_user_collections
                                        ? "/subicons/fullwhitebookmark.svg"
                                        : "/subicons/whitebookmark.svg"}
                                    alt={card.is_contained_in_user_collections ? "Сохранено" : "Сохранить"}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TinderCard;