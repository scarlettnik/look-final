import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { BackButton } from '@twa-dev/sdk/react';
import {useEffect, useRef} from 'react';
import ProductPage from './components/ProductPage';
import TinderCards from "./components/TinderCards.jsx";
import Profile from "./components/Profile.jsx";
import Comparing from "./components/Comparing.jsx";
import Save from "./components/Save.jsx";
import ShoppingCard from "./components/ShoppingCard.jsx";
import Compilation from "./components/Compilation.jsx";
import { AuthProvider } from "./provider/AuthProvider.jsx";
import AddList from "./components/AddList.jsx";
import { StoreProvider } from './provider/StoreContext.jsx';
import OnboardingModal from "./components/OnboardingModal.jsx";
import AccountDeleted from "./components/AccountDeleted.jsx";
import PopularCollection from "./components/PopularCollection.jsx";

function App() {
    return (
        <StoreProvider>
            <AuthProvider>
                <Router>
                    <AppContent />
                </Router>
            </AuthProvider>
        </StoreProvider>
    );
}

function AppContent() {
    const navigate = useNavigate();
    const hasRedirected = useRef(false);

    const isTWA = typeof window !== 'undefined' && window.Telegram?.WebApp?.initDataUnsafe?.user;
    const startParamFromInitData = window.Telegram?.WebApp?.initDataUnsafe?.start_param;

    useEffect(() => {
        if (!isTWA) return;

        const tgWebApp = window.Telegram.WebApp;

        tgWebApp.ready();
        tgWebApp.disableVerticalSwipes();
        tgWebApp.expand();
    }, [isTWA]);

    useEffect(() => {
        if (hasRedirected.current) {
            return;
        }

        if (startParamFromInitData && startParamFromInitData.startsWith('collection_')) {
            const collectionId = startParamFromInitData.split('_')[1];
            hasRedirected.current = true;
            navigate(`/trands/collection/${collectionId}`, { replace: true });
        }
    }, [startParamFromInitData, navigate]);

    return (
        <div>
            {window.history.state?.idx > 0 && <BackButton onClick={() => navigate(-1)} />}
            <Routes>
                <Route path="/add" element={<AddList/>}/>
                <Route path="/cards" element={<TinderCards/>}/>
                <Route path="/" element={<OnboardingModal/>}/>
                <Route path="/product/:id" element={<ProductPage/>}/>
                <Route path="/profile" element={<Profile/>}/>
                <Route path="/save" element={<Save/>}/>
                <Route path="/save/:id" element={<Compilation/>}/>
                <Route path="/collection/:id" element={<Compilation/>}/>
                <Route path="/save/:id/product/:id" element={<ProductPage/>}/>
                <Route path="/trands/product/:id" element={<ProductPage/>}/>
                <Route path='/shoppingcard' element={<ShoppingCard/>}/>
                <Route path='/trands' element={<Comparing/>}/>
                <Route path='/trands/:id' element={<PopularCollection/>}/>
                <Route path='/trands/collection/:id' element={<Compilation/>}/>
                <Route path='/trands/collection/:id/product/:id' element={<ProductPage/>}/>
                <Route path="/account-deleted" element={<AccountDeleted />} />
            </Routes>
        </div>
    );
}

export default App;