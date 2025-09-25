import React, { useState, useEffect, useRef, useCallback } from 'react';
import fotowagner from './images/fotowagner.png';

// --- TIPOS ---
interface BootScreenProps {
    bootLog: string[];
}

interface OutputLine {
    type: 'command' | 'response';
    content: string;
}

interface ProfessionalPortfolioProps {
    onToggleMode: () => void;
}

interface TerminalProps {
    onToggleMode: () => void;
}


// --- ESTILOS (CSS PURO) ---
const PortfolioStyles: React.FC = () => (
    <style>{`
        :root {
            --bg-color: #F7FAFC;
            --main-color: #1A202C;
            --accent-color: #6B46C1; /* Roxo .NET */
            --text-color-light: #F7FAFC;
            --text-color-dark: #2D3748;
            --card-bg: #FFFFFF;
            --prompt-color: #9f7aea; /* Roxo mais claro para o terminal */
            --link-color: #63b3ed; 
        }

        /* --- Estilos Globais --- */
        html {
            scroll-behavior: smooth;
        }
        body {
            background-color: var(--bg-color);
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
            color: var(--text-color-dark);
            transition: background-color 0.3s ease;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        
        #root {
            min-height: 100vh;
        }

        /* --- MODO PROFISSIONAL --- */
        .site-header {
            position: sticky;
            top: 0;
            z-index: 10;
            background-color: var(--card-bg);
            border-bottom: 1px solid #E2E8F0;
            width: 100%;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .portfolio-pro-container {
            max-width: 1024px;
            margin: 0 auto;
            padding: 0 2rem;
            animation: fadeIn 0.5s ease-in-out;
        }

        .main-content {
            padding-top: 2rem;
            padding-bottom: 2rem;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .fade-in-section {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }

        .fade-in-section.is-visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .navbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 0;
        }

        .nav-brand {
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--main-color);
            font-family: 'Fira Code', 'Courier New', monospace;
            letter-spacing: -1px;
        }

        .nav-links {
            display: none; /* Escondido em mobile */
        }

        @media (min-width: 768px) {
            .nav-links {
                display: flex;
                gap: 2rem;
                list-style: none;
                margin: 0;
                padding: 0;
            }
            .nav-links a {
                text-decoration: none;
                color: var(--text-color-dark);
                font-weight: 600;
                position: relative;
                transition: color 0.2s ease;
            }
            .nav-links a:hover {
                color: var(--accent-color);
            }
            .nav-links a::after {
                content: '';
                position: absolute;
                width: 100%;
                transform: scaleX(0);
                height: 2px;
                bottom: -4px;
                left: 0;
                background-color: var(--accent-color);
                transform-origin: bottom right;
                transition: transform 0.25s ease-out;
            }
            .nav-links a:hover::after {
                transform: scaleX(1);
                transform-origin: bottom left;
            }
        }

        .toggle-button {
            background-color: transparent;
            color: var(--accent-color);
            border: 2px solid var(--accent-color);
            padding: 0.6rem 1rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.2s ease;
        }
        .toggle-button:hover {
            background-color: var(--accent-color);
            color: var(--text-color-light);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(107, 70, 193, 0.3);
        }
        .toggle-button svg {
            width: 1.25rem;
            height: 1.25rem;
            transition: transform 0.2s ease;
        }
        .toggle-button:hover svg {
            transform: scale(1.1);
        }

        .hero-section {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 4rem 0;
            animation: fadeIn 0.5s ease-in-out;
        }

        .hero-image {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            border: 4px solid var(--accent-color);
            box-shadow: 0 10px 30px -10px rgba(107, 70, 193, 0.5);
            object-fit: cover;
            margin-bottom: 2rem;
        }

        .hero-text h1 {
            font-size: 2.5rem;
            color: var(--main-color);
            margin: 0;
        }

        .hero-text .subtitle {
            font-size: 1.25rem;
            color: var(--accent-color);
            font-weight: 600;
            margin-top: 0.5rem;
        }

        .hero-text .description {
            max-width: 600px;
            margin: 1.5rem auto 0;
            font-size: 1.1rem;
            line-height: 1.6;
            color: #4A5568;
        }
        
        @media (min-width: 768px) {
            .hero-section {
                flex-direction: row;
                text-align: left;
                gap: 3rem;
            }
            .hero-image {
                width: 180px;
                height: 180px;
                margin-bottom: 0;
            }
            .hero-text h1 {
                font-size: 3rem;
            }
        }
        
        .pro-section {
            padding-top: 5rem; /* Espaço para o header fixo */
            margin-top: -4rem; /* Anular margem para o padding funcionar */
        }
        .pro-section h2 {
            font-size: 2.25rem;
            color: var(--main-color);
            text-align: center;
            margin-bottom: 2.5rem;
        }
        
        .grid {
            display: grid;
            gap: 1.5rem;
        }
        .skills-grid {
             grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        }
        .projects-grid {
             grid-template-columns: 1fr;
        }

        .card {
            background-color: var(--card-bg);
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border: 1px solid #E2E8F0;
        }
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.07), 0 4px 6px -2px rgba(0,0,0,0.04);
        }

        .skill-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            font-weight: 600;
            color: var(--text-color-dark);
        }
        .skill-card img, .skill-card .solid-icon {
            width: 48px;
            height: 48px;
        }
        
        .project-card {
            padding: 2rem;
        }
        .project-card h3 {
            margin: 0 0 0.5rem 0;
            color: var(--accent-color);
            font-size: 1.5rem;
        }
        .project-card .role {
            font-weight: 700;
            color: var(--main-color);
            margin-bottom: 1rem;
        }
        .project-card .tech-stack {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-top: 1.5rem;
        }
        .tech-tag {
            background-color: #EDF2F7;
            color: #4A5568;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 500;
        }

        .education-list {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }
        .education-item {
            display: flex;
            gap: 1.5rem;
            align-items: flex-start;
        }
        .education-icon {
            background-color: var(--accent-color);
            color: white;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        .education-icon svg {
            width: 24px;
            height: 24px;
        }
        .education-details h3 {
            margin: 0 0 0.25rem 0;
            font-size: 1.125rem;
        }
        .education-details p {
            margin: 0;
            color: #4A5568;
        }
        
        .contact-section {
            text-align: center;
        }
        .contact-links {
            display: flex;
            justify-content: center;
            gap: 1.5rem;
            margin-top: 1.5rem;
        }
        .contact-links a {
            color: var(--main-color);
            transition: color 0.2s ease, transform 0.2s ease;
        }
        .contact-links a:hover {
            color: var(--accent-color);
            transform: scale(1.1);
        }
        .contact-links svg {
            width: 32px;
            height: 32px;
        }

        /* --- MODO TERMINAL --- */
        .terminal-container { display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 1rem; background-color: #1A202C; }
        .terminal-window { width: 100%; max-width: 56rem; height: 80vh; background-color: var(--main-color); color: var(--text-color-light); border-radius: 0.5rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4); overflow: hidden; display: flex; flex-direction: column; position: relative; }
        .title-bar { background-color: #000; padding: 0.5rem; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #4A5568; }
        .title-bar-buttons { display: flex; gap: 0.5rem; }
        .title-bar-buttons div { width: 0.75rem; height: 0.75rem; border-radius: 9999px; }
        .btn-red { background-color: #ef4444; } .btn-yellow { background-color: #f59e0b; } .btn-green { background-color: #22c55e; }
        .title-bar-text { color: #a0aec0; font-size: 0.875rem; }
        .terminal-body { flex-grow: 1; padding: 1rem; overflow-y: auto; font-size: 0.875rem; font-family: 'Fira Code', 'Courier New', Courier, monospace; }
        .prompt-line { display: flex; margin-top: 0.25rem; }
        .prompt { color: var(--prompt-color); }
        .terminal-input { flex-grow: 1; margin-left: 0.5rem; background: transparent; border: none; outline: none; color: var(--text-color-light); font-family: inherit; font-size: inherit; }
        .terminal-body a { color: var(--link-color); text-decoration: underline; } .terminal-body a:hover { filter: brightness(0.8); }
        .text-glow { text-shadow: 0 0 5px var(--prompt-color), 0 0 10px rgba(159, 122, 234, 0.5); }
        .scanlines::before { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: linear-gradient(rgba(255, 255, 255, 0.02) 50%, rgba(0, 0, 0, 0.05) 50%); background-size: 100% 4px; pointer-events: none; z-index: 10; }
        .terminal-body::-webkit-scrollbar { width: 8px; } .terminal-body::-webkit-scrollbar-track { background: var(--main-color); } .terminal-body::-webkit-scrollbar-thumb { background: var(--accent-color); border-radius: 4px; } .terminal-body::-webkit-scrollbar-thumb:hover { background: #5a3a99; }
        .boot-screen { width: 100%; max-width: 56rem; height: 80vh; background-color: black; padding: 1rem; overflow: hidden; font-size: 0.875rem; color: var(--prompt-color); font-family: 'Fira Code', 'Courier New', Courier, monospace; }
    `}</style>
);


// --- ÍCONES E LOGOS ---
const techLogos: { [key: string]: string | React.ReactNode } = {
    'C#': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg',
    '.NET': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg',
    'JavaScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
    'TypeScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
    'PostgreSQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
    'React': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    'React Native': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    'Git': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
    'SOLID': <div className="solid-icon" style={{color: 'var(--accent-color)'}}><svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>SOLID</title><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5zM2 12l10 5 10-5-10-5-10 5z" fill="currentColor"/></svg></div>,
    'Python': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
    'MySQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
    'MongoDB': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
    'Figma': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
    'Postman': 'https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg',
};

// --- HOOK PARA ANIMAÇÃO DE SCROLL ---
const useScrollFadeIn = () => {
    useEffect(() => {
        const sections = document.querySelectorAll('.fade-in-section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(section => observer.observe(section));

        return () => sections.forEach(section => observer.unobserve(section));
    }, []);
};

// --- COMPONENTES DO TERMINAL ---
const BootScreen: React.FC<BootScreenProps> = ({ bootLog }) => {
    return (
        <div className="terminal-container">
            <div className="boot-screen">
                {bootLog.map((line, index) => (
                    <p key={index} style={{margin: 0}}>{line}</p>
                ))}
            </div>
        </div>
    );
};

const Terminal: React.FC<TerminalProps> = ({ onToggleMode }) => {
    const [output, setOutput] = useState<OutputLine[]>([]);
    const [input, setInput] = useState<string>('');
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState<number>(-1);
    const terminalBodyRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const welcomeMessageSent = useRef(false);

    const scrollToBottom = () => terminalBodyRef.current?.scrollTo(0, terminalBodyRef.current.scrollHeight);

    const typeOutput = useCallback(async (text: string) => {
        const lines = text.split('\n');
        for (const line of lines) {
            setOutput(prev => [...prev, { type: 'response', content: line }]);
            await new Promise(resolve => setTimeout(resolve, 30));
        }
    }, []);

    const processCommand = useCallback(async (command: string) => {
        const cmd = command.toLowerCase().split(' ')[0];
        let response = '';

        switch (cmd) {
            case 'help':
                response = `Comandos disponíveis:
  <span class="text-glow">whoami</span>    - Sobre mim.
  <span class="text-glow">education</span> - Minha formação acadêmica e cursos.
  <span class="text-glow">skills</span>    - Minhas competências técnicas.
  <span class="text-glow">projects</span>  - Meu projeto principal.
  <span class="text-glow">contact</span>   - Informações para contato.
  <span class="text-glow">clear</span>     - Limpa a tela do terminal.
  <span class="text-glow">exit</span>      - Retorna para o modo profissional.`;
                break;
            case 'whoami': response = `> Wagner Daniell\n> Estagiário em Desenvolvimento Backend\n\nComprometido em contribuir com minhas habilidades em C#, .NET e bancos de dados. Busco participar de projetos com tecnologias modernas e boas práticas, onde eu possa aprender, crescer e enfrentar desafios que impulsionem meu desenvolvimento profissional.`; break;
            case 'education': response = `Carregando histórico acadêmico...\n
  [Graduação]
  - Bacharelado em Ciência da Computação – UNINASSAU (Previsão: 2027)

  [Cursos & Certificações]
  - Back-end com .NET e IA – Avanade (2025 - Atual)
  - Curso de C# (NLW Connect) – Rocketseat (Fev/2025)
  - AWS re/Start (Cloud Computing) – Instituto Aliança / UECE (Em andamento)`;
                break;
            case 'skills': response = `Analisando competências...\n
  [Linguagens]: C#, JavaScript, TypeScript, Python (básico)
  [Frameworks e Tecnologias]: .NET, Entity Framework, React, React Native (com Expo), Axios, React Navigation
  [Bancos de Dados]: PostgreSQL, MySql, MongoDb
  [Boas Práticas]: Clean Architecture, SOLID, Separação por Camadas, Validação Client/Server
  [Ferramentas]: Git, Postman, Figma`; 
                break;
            case 'projects': response = `Iniciando query...\n
  1. <span class="text-glow">Cognitus – App Android para Revisão de Assuntos</span>
     - Cargo: Desenvolvedor Backend
     - Atuação: Criei a API REST em .NET (C#) e integrei ao frontend em React Native. Fui responsável pela modelagem e gestão do banco de dados PostgreSQL, garantindo a comunicação eficiente e confiável entre os sistemas.
     - Tecnologias: .NET, C#, PostgreSQL, Clean Architecture, SOLID.`; 
                break;
            case 'contact': response = `Conectando...\n
  - GitHub:   <a href="https://github.com/WagnerDaniell" target="_blank">github.com/WagnerDaniell</a>
  - LinkedIn: <a href="https://linkedin.com/in/wagnerdaniell" target="_blank">linkedin.com/in/wagnerdaniell</a>`; 
                break;
            case 'clear': setOutput([]); return;
            case 'exit': onToggleMode(); return;
            default: response = `bash: comando não encontrado: ${command}.`; break;
        }
        await typeOutput(response);
    }, [typeOutput, onToggleMode]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && input.trim()) {
            const command = input.trim();
            setOutput(prev => [...prev, { type: 'command', content: command }]);
            setHistory(prev => [command, ...prev]);
            setHistoryIndex(-1);
            processCommand(command);
            setInput('');
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex < history.length - 1) {
                const newIndex = historyIndex + 1;
                setInput(history[newIndex]);
                setHistoryIndex(newIndex);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setInput(history[newIndex]);
                setHistoryIndex(newIndex);
            } else {
                setInput('');
                setHistoryIndex(-1);
            }
        }
    };
    
    useEffect(() => {
        if (!welcomeMessageSent.current) {
            const asciiArt = `
████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗     
╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║     
   ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║     
   ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║     
   ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗
   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝`;
            const welcomeMessage = `<span class="text-glow" style="white-space: pre; color: var(--prompt-color);">${asciiArt}</span>\n\nBem-vindo ao meu terminal.\nDigite '<span class="text-glow">help</span>' para ver os comandos.`;
            typeOutput(welcomeMessage);
            welcomeMessageSent.current = true;
        }
    }, [typeOutput]);

    useEffect(scrollToBottom, [output]);

    return (
        <div className="terminal-container">
            <div className="terminal-window scanlines" onClick={() => inputRef.current?.focus()}>
                <div className="title-bar"><div className="title-bar-buttons"><div className="btn-red"></div><div className="btn-yellow"></div><div className="btn-green"></div></div><span className="title-bar-text">/home/wagnerdaniell/portfolio - bash</span><div></div></div>
                <div ref={terminalBodyRef} className="terminal-body">
                    {output.map((line, index) => <div key={index}>{line.type === 'command' ? <div className="prompt-line"><span className="prompt text-glow">wagner@portfolio:~$</span><span style={{marginLeft: '0.5rem'}}>{line.content}</span></div> : <p style={{margin: 0}} dangerouslySetInnerHTML={{ __html: line.content.replace(/ /g, '&nbsp;') }} />}</div>)}
                    <div className="prompt-line"><span className="prompt text-glow">wagner@portfolio:~$</span><input ref={inputRef} type="text" aria-label="Terminal command input" className="terminal-input" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} autoFocus autoComplete="off" /></div>
                </div>
            </div>
        </div>
    );
};


// --- COMPONENTE MODO PROFISSIONAL ---
const ProfessionalPortfolio: React.FC<ProfessionalPortfolioProps> = ({ onToggleMode }) => {
    useScrollFadeIn();
    const [brandText, setBrandText] = useState("Wagner Daniell");
    const intervalRef = useRef<number | null>(null);
    const originalName = "Wagner Daniell";
    const chars = "!<>-_\\/[]{}—=+*^?#";

    const scramble = () => {
        let iteration = 0;
        
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        intervalRef.current = window.setInterval(() => {
            setBrandText(
                originalName
                    .split("")
                    .map((_letter, index) => {
                        if(index < iteration) {
                            return originalName[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)]
                    })
                    .join("")
            );

            if(iteration >= originalName.length){ 
                if (intervalRef.current) clearInterval(intervalRef.current);
            }
            
            iteration += 1 / 3;
        }, 30);
    };

    const resetName = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        setBrandText(originalName);
    };
    
    return (
    <>
    <header className="site-header">
        <div className="portfolio-pro-container">
            <nav className="navbar">
                <div 
                    className="nav-brand"
                    onMouseEnter={scramble}
                    onMouseLeave={resetName}
                >
                    {brandText}
                </div>
                <ul className="nav-links">
                    <li><a href="#competencias">Competências</a></li>
                    <li><a href="#educacao">Educação</a></li>
                    <li><a href="#projeto">Projeto</a></li>
                    <li><a href="#contato">Contato</a></li>
                </ul>
                <button onClick={onToggleMode} className="toggle-button">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3" /></svg>
                    Modo Terminal
                </button>
            </nav>
        </div>
    </header>
    <main className="portfolio-pro-container main-content">
        <section className="hero-section">
            <img src={fotowagner} alt="Foto de Wagner Daniell" className="hero-image" />
            <div className="hero-text">
                <h1>Desenvolvedor de Software</h1>
                <p className="subtitle">Backend com .NET & Frontend com React</p>
                <p className="description">
                    Busco uma oportunidade para contribuir com minhas habilidades em C#, .NET e bancos de dados, participando de projetos com tecnologias modernas e boas práticas para impulsionar meu desenvolvimento profissional.
                </p>
            </div>
        </section>

        <section id="competencias" className="pro-section fade-in-section">
            <h2>Competências</h2>
            <div className="grid skills-grid">
                {['C#', '.NET', 'JavaScript', 'TypeScript', 'React', 'React Native', 'PostgreSQL', 'MySQL', 'MongoDB', 'Git', 'Figma', 'Postman', 'Python', 'SOLID'].map(skill => (
                    <div key={skill} className="card skill-card">
                        {typeof techLogos[skill] === 'string' ? 
                            <img src={techLogos[skill] as string} alt={`${skill} logo`} /> : 
                            techLogos[skill]
                        }
                        <span>{skill}</span>
                    </div>
                ))}
            </div>
        </section>
        
        <section id="educacao" className="pro-section fade-in-section">
            <h2>Educação e Certificações</h2>
            <div className="education-list">
                 <div className="education-item">
                    <div className="education-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0l-2.072-1.036A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41l-2.072 1.036m-15.482 0l2.072 1.036A48.627 48.627 0 0012 3.493a48.627 48.627 0 008.232 4.41l2.072-1.036" /></svg></div>
                    <div>
                        <h3>Bacharelado em Ciência da Computação</h3>
                        <p>UNINASSAU (Grupo Ser) – 4º Período – Conclusão prevista: 2027</p>
                    </div>
                </div>
                 <div className="education-item">
                    <div className="education-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75c0 3.142-2.558 5.7-5.7 5.7S6 9.892 6 6.75 8.558 1.05 11.7 1.05 17.25 3.608 17.25 6.75zM12 21a8.25 8.25 0 006.03-2.69.75.75 0 00-.94-1.125 6.75 6.75 0 00-10.18 0 .75.75 0 00-.94 1.125A8.25 8.25 0 0012 21z" /></svg></div>
                    <div>
                        <h3>Back-end com .NET e IA</h3>
                        <p>Avanade – fev/2025 – atual</p>
                    </div>
                </div>
                 <div className="education-item">
                    <div className="education-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25l-2.25-2.25-2.25 2.25-2.25-2.25-2.25 2.25M12 21a9 9 0 100-18 9 9 0 000 18z" /></svg></div>
                    <div>
                        <h3>Curso de C# – NLW Connect</h3>
                        <p>Rocketseat – Data de emissão: 21/02/2025</p>
                    </div>
                </div>
                 <div className="education-item">
                    <div className="education-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M21.75 9V5.25A2.25 2.25 0 0019.5 3h-15A2.25 2.25 0 002.25 5.25v13.5A2.25 2.25 0 004.5 21h15a2.25 2.25 0 002.25-2.25V15.25M21.75 9h-9.375" /></svg></div>
                    <div>
                        <h3>AWS re/Start – Cloud Computing</h3>
                        <p>Instituto Aliança / UECE (335h) – 2025.2 (Em andamento)</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="projeto" className="pro-section fade-in-section">
            <h2>Projeto em Destaque</h2>
            <div className="grid projects-grid">
                <div className="project-card card">
                    <h3>Cognitus – App Android</h3>
                    <p className="role">Desenvolvedor Backend</p>
                    <p>Atuei no desenvolvimento da API REST em .NET (C#) e na gestão do banco de dados PostgreSQL. Garanti a comunicação eficiente com o frontend (React Native) e apliquei boas práticas como Clean Architecture e SOLID para uma base de código robusta e escalável.</p>
                     <div className="tech-stack">
                        {['.NET', 'C#', 'PostgreSQL', 'React Native', 'Clean Architecture', 'SOLID'].map(tech => (
                            <div key={tech} className="tech-tag">{tech}</div>
                        ))}
                    </div>
                </div>
            </div>
        </section>

        <section id="contato" className="pro-section fade-in-section">
            <h2>Vamos nos Conectar?</h2>
            <div className="contact-links">
                <a href="https://github.com/WagnerDaniell" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
                <a href="https://linkedin.com/in/wagnerdaniell" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <svg fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
            </div>
        </section>
    </main>
    </>
    );
};


// --- COMPONENTE PRINCIPAL (APP) ---
const App: React.FC = () => {
    const [mode, setMode] = useState<'professional' | 'booting' | 'terminal'>('professional');
    const [bootLog, setBootLog] = useState<string[]>([]);
    
    const handleToggleMode = () => {
        if (mode === 'professional') {
            setMode('booting');
        } else {
            setMode('professional');
        }
    };

    useEffect(() => {
        if (mode === 'booting') {
            const bootSequence = [ 
                "Initializing system...", 
                "Loading kernel module v5.8.0-43-generic...", 
                "Checking file systems... [OK]", 
                "Mounting local file systems... [OK]", 
                "Starting system logger... [OK]", 
                "Configuring network interfaces... [OK]", 
                "Establishing secure connection to portfolio server...", 
                "Connection established. Encrypting data stream...", 
                "Authentication successful. Welcome, user.", 
                "Loading interactive shell...", 
                " "
            ];
            let i = 0;
            const interval = setInterval(() => {
                if (i < bootSequence.length) {
                    setBootLog(prev => [...prev, bootSequence[i]]);
                    i++;
                } else {
                    clearInterval(interval);
                    setTimeout(() => setMode('terminal'), 500); 
                }
            }, 150);
            return () => clearInterval(interval);
        } else if (mode === 'professional') {
            setBootLog([]);
        }
    }, [mode]);

    const renderContent = () => {
        switch (mode) {
            case 'terminal': return <Terminal onToggleMode={handleToggleMode} />;
            case 'booting': return <BootScreen bootLog={bootLog} />;
            default: return <ProfessionalPortfolio onToggleMode={handleToggleMode} />;
        }
    };

    return (
        <>
            <PortfolioStyles />
            {renderContent()}
        </>
    );
};

export default App;

