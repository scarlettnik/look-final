import stylesM from "../ui/fullScreenModal.module.css";

export const FullScreenModal = ({ title, onClose, onApply, children, applyDisabled = false }) => {
    return (
        <div className={stylesM.modalOverlay}>
            <div className={stylesM.modalContent}>
                <div className={stylesM.modalHeader}>
                    <p className={stylesM.label}>{title}</p>
                    <button style={{ background: 'transparent' }} onClick={onClose}>
                        <img src='/subicons/close.svg' alt="Close"/>
                    </button>
                </div>
                <div className={stylesM.modalBody}>{children}</div>
                <button
                    className={stylesM.applyButton}
                    onClick={onApply}
                    disabled={applyDisabled}
                >
                    Показать
                </button>
            </div>
        </div>
    );
};
