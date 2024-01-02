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
    <h1>The number is {n}</h1>
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

const EditorLayout = () => {
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
    );
};

const Editor = () => {
    return (
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
            <EditorLayout />
        </SandpackProvider>
    );
};

export default Editor;
