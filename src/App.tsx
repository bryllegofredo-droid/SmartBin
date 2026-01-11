import Header from '@/components/layout/Header';
import AppRoutes from '@/routes';

function App() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-6">
                <AppRoutes />
            </main>
        </div>
    );
}

export default App;
