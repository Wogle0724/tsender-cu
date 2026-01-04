import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FaBitcoin } from "react-icons/fa"; // Importing an icon from react-icons

export default function Header() {
    return (
        <header className="flex items-center justify-between p-4 bg-white shadow">
            <div className="flex items-center">
                <a
                    href="https://github.com/Wogle0724"
                    target = "_blank"
                    rel="noopener noreferrer"
                    className="flex items-center hover:opacity-75"
                >
                    <FaBitcoin className="text-2xl mr-2 text-yellow-500" />
                </a>
                <h1 className="text-2xl font-bold text-black">Crypto Sender</h1>
            </div>
            <ConnectButton />
        </header>
    );
}