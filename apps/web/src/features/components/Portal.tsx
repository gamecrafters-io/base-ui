import * as React from "react";
import {
    Button,
    Heading,
    Portal as PortalComponent,
    PortalContext,
    registerPortalRoot,
    Stack,
    Text,
} from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // Where a portal is written. The boxes are drawn so that where the children were written can be
    // told apart from where they ended up, which is the whole of what there is to see here
    written:
        "p-[var(--base-size-12)] rounded-[var(--border-radius-medium)] border border-solid border-[var(--border-color-default)]",
    // A box written inside another one, to show that how deep the portal stands makes no difference
    nested: "mt-[var(--base-size-8)] p-[var(--base-size-12)] rounded-[var(--border-radius-medium)] border border-solid border-[var(--border-color-muted)]",
    // Where the children end up
    target: "p-[var(--base-size-12)] rounded-[var(--border-radius-medium)] bg-[var(--background-color-inset)]",
    muted: "text-[var(--foreground-color-muted)]",
};

// What every example has to have in hand before it can be drawn. A container has to be registered
// before a portal can render into it, and a ref is only filled in once the element it points at has
// been drawn — so nothing is portalled until the registration has happened
const setup = `const written = "p-[var(--base-size-12)] rounded-[var(--border-radius-medium)] border border-solid border-[var(--border-color-default)]";
const nested = "mt-[var(--base-size-8)] p-[var(--base-size-12)] rounded-[var(--border-radius-medium)] border border-solid border-[var(--border-color-muted)]";
const target = "p-[var(--base-size-12)] rounded-[var(--border-radius-medium)] bg-[var(--background-color-inset)]";`;

// Where the children go: written inside two boxes, drawn in a third. How deep the portal stands
// makes no difference, since what settles where the children end up is the container it names
// rather than anything about where it was written.
//
// The state is what holds the example back until the container is there to render into, which
// makes this a component of its own rather than an element the page holds ready.
//
// The page and the component it is about are both called Portal, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Portal, as an application
// importing it would
const DefaultPreview = () => {
    const targetRef = React.useRef<HTMLDivElement>(null);
    const [registered, setRegistered] = React.useState(false);

    React.useEffect(() => {
        if (targetRef.current) {
            registerPortalRoot(targetRef.current, "portal-page-notes");
            setRegistered(true);
        }
    }, []);

    return (
        <Stack gap="normal">
            <div className={classes.written}>
                <Text size="small">Written in this box</Text>
                <div className={classes.nested}>
                    <Text size="small">and inside this one</Text>
                    {registered ? (
                        <PortalComponent containerName="portal-page-notes">
                            <Text size="small">These words were written two boxes up.</Text>
                        </PortalComponent>
                    ) : null}
                </div>
            </div>
            <div ref={targetRef} className={classes.target}>
                <Text size="small" className={classes.muted}>
                    Drawn in this one
                </Text>
            </div>
        </Stack>
    );
};

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `const targetRef = React.useRef(null);
const [registered, setRegistered] = React.useState(false);

React.useEffect(() => {
    if (targetRef.current) {
        registerPortalRoot(targetRef.current, "notes");
        setRegistered(true);
    }
}, []);

<Stack gap="normal">
    <div className={written}>
        <Text size="small">Written in this box</Text>
        <div className={nested}>
            <Text size="small">and inside this one</Text>
            {registered ? (
                <Portal containerName="notes">
                    <Text size="small">These words were written two boxes up.</Text>
                </Portal>
            ) : null}
        </div>
    </div>
    <div ref={targetRef} className={target}>
        <Text size="small">Drawn in this one</Text>
    </div>
</Stack>`;

// Two containers registered under names of their own, and two portals written side by side landing
// in one each. A name is how a portal is told which of them it belongs to
const SeveralPreview = () => {
    const firstRef = React.useRef<HTMLDivElement>(null);
    const secondRef = React.useRef<HTMLDivElement>(null);
    const [registered, setRegistered] = React.useState(false);

    React.useEffect(() => {
        if (firstRef.current && secondRef.current) {
            registerPortalRoot(firstRef.current, "portal-page-first");
            registerPortalRoot(secondRef.current, "portal-page-second");
            setRegistered(true);
        }
    }, []);

    return (
        <Stack gap="normal">
            <div className={classes.written}>
                <Text size="small">Both were written here</Text>
                {registered ? (
                    <>
                        <PortalComponent containerName="portal-page-first">
                            <Text size="small">The first one.</Text>
                        </PortalComponent>
                        <PortalComponent containerName="portal-page-second">
                            <Text size="small">The second one.</Text>
                        </PortalComponent>
                    </>
                ) : null}
            </div>
            <div ref={firstRef} className={classes.target}>
                <Text size="small" className={classes.muted}>
                    First container
                </Text>
            </div>
            <div ref={secondRef} className={classes.target}>
                <Text size="small" className={classes.muted}>
                    Second container
                </Text>
            </div>
        </Stack>
    );
};

const severalCode = `const firstRef = React.useRef(null);
const secondRef = React.useRef(null);
const [registered, setRegistered] = React.useState(false);

React.useEffect(() => {
    if (firstRef.current && secondRef.current) {
        registerPortalRoot(firstRef.current, "first");
        registerPortalRoot(secondRef.current, "second");
        setRegistered(true);
    }
}, []);

<Stack gap="normal">
    <div className={written}>
        <Text size="small">Both were written here</Text>
        {registered ? (
            <>
                <Portal containerName="first">
                    <Text size="small">The first one.</Text>
                </Portal>
                <Portal containerName="second">
                    <Text size="small">The second one.</Text>
                </Portal>
            </>
        ) : null}
    </div>
    <div ref={firstRef} className={target}>
        <Text size="small">First container</Text>
    </div>
    <div ref={secondRef} className={target}>
        <Text size="small">Second container</Text>
    </div>
</Stack>`;

// A name handed down rather than written on each portal, and the one case where a portal says
// otherwise. What a portal is told itself wins over what it was handed
const ContextPreview = () => {
    const contextRef = React.useRef<HTMLDivElement>(null);
    const overrideRef = React.useRef<HTMLDivElement>(null);
    const [registered, setRegistered] = React.useState(false);

    React.useEffect(() => {
        if (contextRef.current && overrideRef.current) {
            registerPortalRoot(contextRef.current, "portal-page-context");
            registerPortalRoot(overrideRef.current, "portal-page-override");
            setRegistered(true);
        }
    }, []);

    return (
        <Stack gap="normal">
            <PortalContext.Provider value={{ portalContainerName: "portal-page-context" }}>
                <div className={classes.written}>
                    <Text size="small">Both were written under the same context</Text>
                    {registered ? (
                        <>
                            <PortalComponent>
                                <Text size="small">This one took the name it was handed.</Text>
                            </PortalComponent>
                            <PortalComponent containerName="portal-page-override">
                                <Text size="small">This one named its own.</Text>
                            </PortalComponent>
                        </>
                    ) : null}
                </div>
            </PortalContext.Provider>
            <div ref={contextRef} className={classes.target}>
                <Text size="small" className={classes.muted}>
                    The container the context names
                </Text>
            </div>
            <div ref={overrideRef} className={classes.target}>
                <Text size="small" className={classes.muted}>
                    The container the prop names
                </Text>
            </div>
        </Stack>
    );
};

const contextCode = `const contextRef = React.useRef(null);
const overrideRef = React.useRef(null);
const [registered, setRegistered] = React.useState(false);

React.useEffect(() => {
    if (contextRef.current && overrideRef.current) {
        registerPortalRoot(contextRef.current, "context");
        registerPortalRoot(overrideRef.current, "override");
        setRegistered(true);
    }
}, []);

<Stack gap="normal">
    <PortalContext.Provider value={{ portalContainerName: "context" }}>
        <div className={written}>
            <Text size="small">Both were written under the same context</Text>
            {registered ? (
                <>
                    <Portal>
                        <Text size="small">This one took the name it was handed.</Text>
                    </Portal>
                    <Portal containerName="override">
                        <Text size="small">This one named its own.</Text>
                    </Portal>
                </>
            ) : null}
        </div>
    </PortalContext.Provider>
    <div ref={contextRef} className={target}>
        <Text size="small">The container the context names</Text>
    </div>
    <div ref={overrideRef} className={target}>
        <Text size="small">The container the prop names</Text>
    </div>
</Stack>`;

// Put up and taken down again. What is portalled is a node of the portal's own, added to the
// container as the portal arrives and taken out again as it goes, so a container is left as it was
// found rather than filling up with what has been through it
const ToggledPreview = () => {
    const targetRef = React.useRef<HTMLDivElement>(null);
    const [registered, setRegistered] = React.useState(false);
    const [shown, setShown] = React.useState(true);
    const [arrived, setArrived] = React.useState(false);

    React.useEffect(() => {
        if (targetRef.current) {
            registerPortalRoot(targetRef.current, "portal-page-toggle");
            setRegistered(true);
        }
    }, []);

    const toggle = () => {
        setShown((current) => !current);
        setArrived(false);
    };

    return (
        <Stack gap="normal">
            <Stack direction="horizontal" gap="condensed" align="center">
                <Button onClick={toggle}>{shown ? "Take it away" : "Put it back"}</Button>
                <Text size="small" className={classes.muted}>
                    {arrived ? "In the document" : "Not in the document"}
                </Text>
            </Stack>
            {registered && shown ? (
                <PortalComponent
                    containerName="portal-page-toggle"
                    onMount={() => setArrived(true)}
                >
                    <Text size="small">Put here by a portal.</Text>
                </PortalComponent>
            ) : null}
            <div ref={targetRef} className={classes.target}>
                <Text size="small" className={classes.muted}>
                    The container
                </Text>
            </div>
        </Stack>
    );
};

const toggledCode = `const targetRef = React.useRef(null);
const [registered, setRegistered] = React.useState(false);
const [shown, setShown] = React.useState(true);
const [arrived, setArrived] = React.useState(false);

React.useEffect(() => {
    if (targetRef.current) {
        registerPortalRoot(targetRef.current, "toggle");
        setRegistered(true);
    }
}, []);

const toggle = () => {
    setShown((current) => !current);
    setArrived(false);
};

<Stack gap="normal">
    <Stack direction="horizontal" gap="condensed" align="center">
        <Button onClick={toggle}>{shown ? "Take it away" : "Put it back"}</Button>
        <Text size="small">{arrived ? "In the document" : "Not in the document"}</Text>
    </Stack>
    {registered && shown ? (
        <Portal containerName="toggle" onMount={() => setArrived(true)}>
            <Text size="small">Put here by a portal.</Text>
        </Portal>
    ) : null}
    <div ref={targetRef} className={target}>
        <Text size="small">The container</Text>
    </div>
</Stack>`;

// The portal as it is reached for, drawn and written out one above the other. Where the children go
// comes first, since that is the whole of what a portal does, then how a container is named, and
// last what happens as one arrives and goes again
const examples: ComponentExample[] = [
    {
        name: "Where the children go",
        description:
            "Written two boxes deep and drawn in a third. How deep the portal stands makes no difference: what settles where its children end up is the container it names rather than anything about where it was written. A container has to be registered before a portal can render into it, and a ref is only filled in once the element it points at has been drawn — so nothing is portalled until the registration has happened, which is what the guard is for.",
        setup,
        preview: <DefaultPreview />,
        code: defaultCode,
    },
    {
        name: "Several containers at once",
        description:
            "Two containers registered under names of their own, and two portals written side by side landing in one each. A name is how a portal is told which of them it belongs to, so an application can keep one place for its menus and another for its dialogs without either knowing about the other.",
        setup,
        preview: <SeveralPreview />,
        code: severalCode,
    },
    {
        name: "Named by the context",
        description:
            "A name handed down rather than written on every portal, for a subtree that should send everything it portals to the same place. A portal that names a container of its own still takes it: what it was told itself wins over what it was handed, and where there is neither it falls back to the default root.",
        setup,
        preview: <ContextPreview />,
        code: contextCode,
    },
    {
        name: "Put up and taken down again",
        description:
            "What is portalled is a node of the portal's own, added to the container as the portal arrives and taken out again as it goes, so a container is left as it was found rather than filling up with everything that has been through it. The arrival is reported once the node is in the document, which is when whatever was portalled can first be measured or focused.",
        setup,
        preview: <ToggledPreview />,
        code: toggledCode,
    },
];

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const groups: ComponentPropGroup[] = [
    {
        name: "Portal",
        props: [
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "What is drawn somewhere other than where it was written. It is put inside a node of the portal's own, which carries a stacking context so that two portals cannot reach into one another's",
            },
            {
                name: "containerName",
                type: "string",
                description:
                    "Which registered container the children are drawn in. Left out, the name is taken from the portal context, and where there is neither the default root is used. A name that has not been registered throws rather than drawing nowhere, since a portal that quietly rendered into nothing would be the harder of the two to find",
            },
            {
                name: "onMount",
                type: "() => void",
                description:
                    "Called once the portal's node has been added to the container, which is when whatever was portalled can first be measured or focused. It is read once rather than watched, so passing a fresh function on every render does not move the portal out of the document and back into it",
            },
        ],
    },
    {
        name: "PortalContext",
        props: [
            {
                name: "portalContainerName",
                type: "string",
                description:
                    "The container every portal beneath the provider is drawn in, unless one names its own. It is how a subtree sends everything it portals to the same place without each portal being told separately",
            },
        ],
    },
    {
        name: "registerPortalRoot",
        props: [
            {
                name: "root",
                type: "Element",
                required: true,
                description: "The element portals sent to this name are drawn inside",
            },
            {
                name: "name",
                type: "string",
                description:
                    "What portals call it. Left out, the element is registered as the default root, which every portal that names nothing is drawn in — so an application registers this once, if at all, rather than per screen",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the portal is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const Portal = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Portal
            </Heading>
            <Text as="p" size="large">
                Draws what is written inside it somewhere else in the document, which is what
                anything standing over the page rather than in it needs: a menu, an overlay, a
                dialog, none of which should be clipped by whatever they were opened from. Which
                container the children land in is settled by the name the portal was given, then by
                the name handed down through the context, and last by the default root — a container
                the library makes for itself the first time one is needed, inside whichever element
                the application has marked as the place for them. Every other name has to be
                registered before a portal can reach it, and one that has not been throws rather
                than drawing nowhere.
            </Text>
            <Text as="p" size="large" className={classes.muted}>
                The examples below all name containers of their own. A portal left to the default
                root would draw over the top of this page rather than beside the example, since the
                default root is the one every menu and dialog on this site already uses — which is
                itself the arrangement described above, declared in the application's entry point.
            </Text>
        </Stack>
        <ComponentExamples component="Portal" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Portal;
