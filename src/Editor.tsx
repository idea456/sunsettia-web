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

const GENERATED_APP_FILE = `
export default function() {
    let n = 0;

    function onClick() {
        _invalidate('n', n += 1);
    }
    let App_0;
    let h1_0;
    let text_0;
    let expr_0;
    let button_0;
    let text_1;
    let variableToNodesMapper = new Map();

    function _invalidate(variable, expr) {
        const nodes = variableToNodesMapper.get(variable);
        if (nodes) {
            for (let i = 0; i < nodes.length; i++) {
                nodes[i]();
            }
        }
    }

    function _listen(variable, fn) {
        if (!variableToNodesMapper.has(variable))
            variableToNodesMapper.set(variable, []);
        variableToNodesMapper.set(variable, [
            ...variableToNodesMapper.get(variable),
            fn,
        ]);
    }
    _listen('n', () => expr_0.data = n);
    return {
        create() {
            App_0 = document.createElement('div');
            document.body.appendChild(App_0)
            App_0.setAttribute('data-component', 'App')
            h1_0 = document.createElement('h1');
            App_0.appendChild(h1_0)
            text_0 = document.createTextNode('The number is ;')
            h1_0.appendChild(text_0);
            expr_0 = document.createTextNode(n)
            h1_0.appendChild(expr_0)
            button_0 = document.createElement('button');
            App_0.appendChild(button_0)
            text_1 = document.createTextNode('Increment;')
            button_0.appendChild(text_1);
            button_0.addEventListener('click', onClick);
        },
        destroy() {
            const component = document.querySelector('[data-component="App_0"]');
            document.body.removeChild(component);
        }
    }
}
`

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
                    code: GENERATED_APP_FILE,
                },
            }}
        >
            <EditorLayout />
        </SandpackProvider>
    );
};

export default Editor;
