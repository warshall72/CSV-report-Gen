import { Github } from "lucide-react";

const Footer = () => {
    return (
        <footer className="fixed bottom-0 left-0 right-0 z-50 h-[24px] bg-primary/95 text-primary-foreground backdrop-blur-sm flex items-center justify-center text-[10px] shadow-t-lg">
            <a
                href="https://github.com/krishsinghhura"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-white/80 transition-colors font-medium tracking-wide"
            >
                <Github className="w-3 h-3" />
                <span>Designed & Built by Krish Singh Hura</span>
            </a>
        </footer>
    );
};

export default Footer;
