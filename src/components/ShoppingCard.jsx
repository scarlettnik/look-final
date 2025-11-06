import styles from './ui/shoppingCart.module.css';
import Sidebar from "./Sidebar.jsx";

const ShoppingCard = () => {
    return (
        <div className={styles.container}>
            <div className={styles.contentWrapper}>
                <div className={styles.inCreate}>
                    <p style={{width: '100vw', textAlign: 'center', right: '0', fontSize: '14px'
                    }}>
                        Страница находится в разработке
                    </p>
                </div>
            </div>
            <Sidebar/>
        </div>
    );
};

export default ShoppingCard;