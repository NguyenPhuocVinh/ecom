import { BrowserRouter as Router } from "react-router-dom";
import TopHeader from "./components/header/TopHeader";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import AppRoutes from "./routes/routes";

function App() {
    return (
        <Router>
            <div className="min-h-screen flex flex-col">
                <TopHeader />
                <Header />

                <main className="flex-1 container mx-auto max-w-screen-2xl px-6 py-6">
                    <AppRoutes />
                </main>

                <Footer />
            </div>
        </Router>
    );
}

export default App;
