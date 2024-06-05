import Navbar from "./Navbar";
import notFound from '../assets/img/notFound.jpg';

export default function Notfound() {
    return (
        <div>
            <Navbar />
            <div className="flex flex-col items-center justify-center h-screen text-center">
                <h1 className="mb-4">No encontrado</h1>
                <img className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl" src={notFound} alt="notFound" />
            </div>
        </div>
    );
}