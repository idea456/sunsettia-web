import React from "react";
import {
    SandpackLayout,
    SandpackCodeEditor,
    SandpackPreview,
    SandpackProvider,
    useActiveCode,
    useSandpack,
} from "@codesandbox/sandpack-react";
import Sunsettia from "sunsettia";

const APP_FILE = `<script>
    let n = 0;

    function onClick() {
        n += 1;
    }
</script>

<component name="App">
    <h1>The number is {n}.</h1>
    <button @click={onClick}>Increment</button>
</component>
`;

const ENTRY_FILE = `
<html>
    <head>
        <script type="module">
                import App from "/app.js";
                const app = App();
                app.create();

                document.body.addEventListener('app-change', () => {
                    import("/app.js").then(_App => {
                        const _app = _App.default()
                        _app.create()
                    });
                })
        </script>
    </head>
    <body>
        <div id="root"></div>
    </body>
</html>
`;

async function compileApp(code: string) {
    const generatedCode = await Sunsettia.compileRaw(code);
    return generatedCode;
}

const Editor = () => {
    const { sandpack } = useSandpack();
    const { code } = useActiveCode();
    React.useEffect(() => {
        compileApp(code).then((generatedCode) => {
            sandpack.updateFile("/app.js", generatedCode);
            sandpack.resetFile("/index.html");
            const event = new CustomEvent("app-change");
            document.body.dispatchEvent(event);
        });
    }, [code]);

    return (
        <>
            <SandpackLayout style={{ height: 500, borderRadius: 20 }}>
                <SandpackCodeEditor
                    style={{ height: 500 }}
                    showLineNumbers
                    showRunButton={false}
                    showTabs={false}
                    // showNavigator={false}
                />
                <SandpackPreview
                    showNavigator={false}
                    style={{ height: 500 }}
                    showOpenInCodeSandbox
                ></SandpackPreview>
            </SandpackLayout>
        </>
    );
};

const Header = () => {
    return (
        <div className='absolute top-5 w-screen flex justify-between px-8 text-4xl'>
            <span
                className='cursor-pointer hover:animate-spin'
                onClick={() => window.open("https://adrienne.quest")}
            >
                🍋
            </span>
            <div className='my-0'>
                <svg
                    className='cursor-pointer'
                    width='34'
                    height='34'
                    viewBox='0 0 15 15'
                    fill='#ffffff'
                    xmlns='http://www.w3.org/2000/svg'
                    onClick={() =>
                        window.open("https://github.com/idea456/sunsettia")
                    }
                >
                    <path
                        d='M7.49933 0.25C3.49635 0.25 0.25 3.49593 0.25 7.50024C0.25 10.703 2.32715 13.4206 5.2081 14.3797C5.57084 14.446 5.70302 14.2222 5.70302 14.0299C5.70302 13.8576 5.69679 13.4019 5.69323 12.797C3.67661 13.235 3.25112 11.825 3.25112 11.825C2.92132 10.9874 2.44599 10.7644 2.44599 10.7644C1.78773 10.3149 2.49584 10.3238 2.49584 10.3238C3.22353 10.375 3.60629 11.0711 3.60629 11.0711C4.25298 12.1788 5.30335 11.8588 5.71638 11.6732C5.78225 11.205 5.96962 10.8854 6.17658 10.7043C4.56675 10.5209 2.87415 9.89918 2.87415 7.12104C2.87415 6.32925 3.15677 5.68257 3.62053 5.17563C3.54576 4.99226 3.29697 4.25521 3.69174 3.25691C3.69174 3.25691 4.30015 3.06196 5.68522 3.99973C6.26337 3.83906 6.8838 3.75895 7.50022 3.75583C8.1162 3.75895 8.73619 3.83906 9.31523 3.99973C10.6994 3.06196 11.3069 3.25691 11.3069 3.25691C11.7026 4.25521 11.4538 4.99226 11.3795 5.17563C11.8441 5.68257 12.1245 6.32925 12.1245 7.12104C12.1245 9.9063 10.4292 10.5192 8.81452 10.6985C9.07444 10.9224 9.30633 11.3648 9.30633 12.0413C9.30633 13.0102 9.29742 13.7922 9.29742 14.0299C9.29742 14.2239 9.42828 14.4496 9.79591 14.3788C12.6746 13.4179 14.75 10.7025 14.75 7.50024C14.75 3.49593 11.5036 0.25 7.49933 0.25Z'
                        fill='#ffffff'
                        fill-rule='evenodd'
                        clip-rule='evenodd'
                    ></path>
                </svg>
            </div>
        </div>
    );
};

export default function App() {
    return (
        <div className='bg-yellow-400 h-screen flex flex-col items-center justify-center gap-5 w-screen'>
            <Header />
            <div className='relative overflow-hidden pb-4'>
                <h1 className='font-header-two md:max-2xl:text-8xl text-white italic font-black'>
                    Sunsettia
                </h1>
                <div className='decoration-wavy md:max-2xl:text-5xl underline-offset-[10px] underline decoration-white text-transparent absolute top-11 w-screen'>
                    ------------------------------------------------------
                </div>
            </div>
            <h2 className='font-header text-2xl font-semibold text-white'>
                A compile-time frontend library with{" "}
                <h2 className='text-orange-400 italic inline mx-1'>
                    reactivity
                </h2>{" "}
                and{" "}
                <h2 className='text-orange-400 italic inline'>composability</h2>
            </h2>

            <div className='w-4/5'>
                <SandpackProvider
                    template='static'
                    customSetup={{
                        entry: "/index.html",
                    }}
                    files={{
                        "/index.html": {
                            code: ENTRY_FILE,
                        },
                        "/index.sun": {
                            active: true,
                            code: APP_FILE,
                        },
                        "/app.js": {
                            code: "",
                        },
                    }}
                >
                    <Editor />
                </SandpackProvider>
            </div>
        </div>
    );
}
