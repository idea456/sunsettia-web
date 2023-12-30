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
                console.log("HEREEE");
                const app = App();
                app.create();

                document.body.addEventListener('app-change', () => {
                    console.log('wow')
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
        // console.log(sandpack.updateFile("/code.js", "console.log('xxx')"));
        // console.log(sandpack.files);
        compileApp(code).then((generatedCode) => {
            console.log(generatedCode);
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
                    showNavigator={false}
                    showOpenInCodeSandbox={false}
                />
                <SandpackPreview
                    showNavigator={false}
                    style={{ height: 500 }}
                    showOpenInCodeSandbox={false}
                ></SandpackPreview>
            </SandpackLayout>
        </>
    );
};

export default function App() {
    return (
        <div className='bg-yellow-400 h-screen flex flex-col items-center justify-center gap-5 w-screen'>
            <div className='absolute top-6 left-7 text-4xl cursor-pointer'>
                <a href='https://adrienne.quest'>🍋</a>
            </div>
            <h1 className='font-header-two md:max-2xl:text-8xl text-white italic font-black'>
                Sunsettia
            </h1>
            <h2 className='font-header text-3xl font-semibold text-white'>
                A compile-time frontend library with reactivity and
                composability
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
