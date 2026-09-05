import * as React from "react";
import {
    Button,
    Drawer as DrawerComponent,
    Heading,
    Stack,
    Text,
    Textarea,
} from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // A part the caller has built rather than let the drawer draw, coloured so that what was built
    // by hand can be told from what the drawer would have put there itself
    custom: "bg-background-accent-muted",
};

// What every example is a drawer about. It is written once and read out into each of them, since
// what the examples are about is the drawer rather than the words inside it
const body = (
    <Text as="p">
        A drawer comes in from an edge of the screen and stays anchored to it, for work that runs
        alongside the page rather than in place of it: a set of filters, the details of the row that
        was picked, a form that is filled in without leaving what it belongs to.
    </Text>
);

// More than a drawer has room for, so that what a body does when it runs past its own height can be
// read rather than described
const longBody = (
    <Stack gap="normal">
        {Array.from({ length: 8 }, (_, index) => (
            <Text as="p" key={index}>
                A drawer comes in from an edge of the screen and stays anchored to it, for work that
                runs alongside the page rather than in place of it: a set of filters, the details of
                the row that was picked, a form that is filled in without leaving what it belongs
                to.
            </Text>
        ))}
    </Stack>
);

// What the examples have to have in hand before they can be drawn
const bodySetup = `const body = (
    <Text as="p">
        A drawer comes in from an edge of the screen and stays anchored to it, for work that runs
        alongside the page rather than in place of it: a set of filters, the details of the row that
        was picked, a form that is filled in without leaving what it belongs to.
    </Text>
);`;

const openSetup = `const [isOpen, setIsOpen] = React.useState(false);
const close = () => setIsOpen(false);`;

// A drawer is only ever on the page while it is open, so every example is a button that puts one up
// and a drawer that takes itself down again. The state has to be kept somewhere for that, so each
// example is a component of its own rather than an element the page holds ready
const Example = ({
    label = "Show drawer",
    render,
}: {
    label?: string;
    render: (close: () => void) => React.ReactNode;
}) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <Stack align="start">
            <Button onClick={() => setIsOpen(true)}>{label}</Button>
            {isOpen ? render(() => setIsOpen(false)) : null}
        </Stack>
    );
};

// The plainest drawer there is: a title, what it is about, and the buttons that answer it. It is
// described rather than built, so the header is laid out from what the drawer was told rather than
// written out part by part.
//
// The title names the drawer to a screen reader as well as heading it, so there is nothing else to
// name it with. Focus is held inside it while it stands and handed back to the button that opened
// it once it goes.
//
// The page and the component it is about are both called Drawer, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Drawer, as an application
// importing it would
const DefaultPreview = () => (
    <Example
        render={(close) => (
            <DrawerComponent title="Filters" subtitle="Narrow down what is listed" onClose={close}>
                {body}
                <DrawerComponent.Footer>
                    <Button onClick={close}>Cancel</Button>
                    <Button variant="primary" onClick={close}>
                        Apply
                    </Button>
                </DrawerComponent.Footer>
            </DrawerComponent>
        )}
    />
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<>
    <Button onClick={() => setIsOpen(true)}>Show drawer</Button>
    {isOpen ? (
        <Drawer title="Filters" subtitle="Narrow down what is listed" onClose={close}>
            {body}
            <Drawer.Footer>
                <Button onClick={close}>Cancel</Button>
                <Button variant="primary" onClick={close}>
                    Apply
                </Button>
            </Drawer.Footer>
        </Drawer>
    ) : null}
</>`;

// Which edge the drawer settles against, which is also the edge it arrives from. A drawer against a
// side runs the full height of the screen; one against the top or the bottom runs the full width
const PositionPreview = () => (
    <Stack direction="horizontal" gap="condensed" wrap="wrap">
        {(["left", "right", "top", "bottom"] as const).map((position) => (
            <Example
                key={position}
                label={position}
                render={(close) => (
                    <DrawerComponent
                        title={`From the ${position}`}
                        position={position}
                        onClose={close}
                    >
                        {body}
                    </DrawerComponent>
                )}
            />
        ))}
    </Stack>
);

const positionCode = `<Drawer title="From the left" position="left" onClose={close}>
    {body}
</Drawer>

<Drawer title="From the right" position="right" onClose={close}>
    {body}
</Drawer>

<Drawer title="From the top" position="top" onClose={close}>
    {body}
</Drawer>

<Drawer title="From the bottom" position="bottom" onClose={close}>
    {body}
</Drawer>`;

// How far the drawer comes in from the edge it settles against. The steps are the overlay scale, so
// a drawer and a dialog asking for the same size come out the same width
const SizePreview = () => (
    <Stack direction="horizontal" gap="condensed" wrap="wrap">
        {(["small", "medium", "large", "xlarge"] as const).map((size) => (
            <Example
                key={size}
                label={size}
                render={(close) => (
                    <DrawerComponent title="Filters" size={size} onClose={close}>
                        {body}
                    </DrawerComponent>
                )}
            />
        ))}
    </Stack>
);

const sizeCode = `<Drawer title="Filters" size="small" onClose={close}>
    {body}
</Drawer>

<Drawer title="Filters" size="medium" onClose={close}>
    {body}
</Drawer>

<Drawer title="Filters" size="large" onClose={close}>
    {body}
</Drawer>

<Drawer title="Filters" size="xlarge" onClose={close}>
    {body}
</Drawer>`;

// A size no step of the scale fits, given as a length of the caller's own. It is read the same way
// the steps are: as a width against a side, and as a height against the top or the bottom
const CustomSizePreview = () => (
    <Stack direction="horizontal" gap="condensed" wrap="wrap">
        <Example
            label="A width of its own"
            render={(close) => (
                <DrawerComponent title="Filters" size="22rem" onClose={close}>
                    {body}
                </DrawerComponent>
            )}
        />
        <Example
            label="A height of its own"
            render={(close) => (
                <DrawerComponent title="Filters" position="bottom" size="14rem" onClose={close}>
                    {body}
                </DrawerComponent>
            )}
        />
    </Stack>
);

const customSizeCode = `<Drawer title="Filters" size="22rem" onClose={close}>
    {body}
</Drawer>

<Drawer title="Filters" position="bottom" size="14rem" onClose={close}>
    {body}
</Drawer>`;

// A drawer that leaves the page behind it to be used. Nothing is dimmed, the page still scrolls and
// focus is free to move on past the drawer to whatever it stands beside
const ModelessPreview = () => (
    <Example
        render={(close) => (
            <DrawerComponent
                title="Activity"
                subtitle="Everything that has happened today"
                modal={false}
                onClose={close}
            >
                {body}
            </DrawerComponent>
        )}
    />
);

const modelessCode = `<Drawer
    title="Activity"
    subtitle="Everything that has happened today"
    modal={false}
    onClose={close}
>
    {body}
</Drawer>`;

// A footer, which stays put at the foot of the drawer rather than scrolling away with the body
const FooterPreview = () => (
    <Example
        render={(close) => (
            <DrawerComponent title="Filters" subtitle="Narrow down what is listed" onClose={close}>
                {body}
                <DrawerComponent.Footer>
                    <Button onClick={close}>Cancel</Button>
                    <Button variant="primary" onClick={close}>
                        Apply
                    </Button>
                </DrawerComponent.Footer>
            </DrawerComponent>
        )}
    />
);

const footerCode = `<Drawer title="Filters" subtitle="Narrow down what is listed" onClose={close}>
    {body}
    <Drawer.Footer>
        <Button onClick={close}>Cancel</Button>
        <Button variant="primary" onClick={close}>
            Apply
        </Button>
    </Drawer.Footer>
</Drawer>`;

// A body with more in it than the drawer has room for. It scrolls under a header and above a footer
// that both stay where they are, and is ruled off from the footer for as long as there is more to
// read, so the line says there is something below rather than merely dividing the two
const ScrollingPreview = () => (
    <Example
        render={(close) => (
            <DrawerComponent title="Release notes" size="small" onClose={close}>
                {longBody}
                <DrawerComponent.Footer>
                    <Button variant="primary" onClick={close}>
                        Done
                    </Button>
                </DrawerComponent.Footer>
            </DrawerComponent>
        )}
    />
);

const scrollingSetup = `const longBody = (
    <Stack gap="normal">
        {Array.from({ length: 8 }, (_, index) => (
            <Text as="p" key={index}>
                A drawer comes in from an edge of the screen and stays anchored to it, for work
                that runs alongside the page rather than in place of it.
            </Text>
        ))}
    </Stack>
);

${openSetup}`;

const scrollingCode = `<Drawer title="Release notes" size="small" onClose={close}>
    {longBody}
    <Drawer.Footer>
        <Button variant="primary" onClick={close}>
            Done
        </Button>
    </Drawer.Footer>
</Drawer>`;

// A header built out of the drawer's own parts rather than described. The title carries the id the
// drawer is already pointing at, so the drawer is still named by it, and the close button finds the
// drawer around it rather than being told how to close it
const CustomHeaderPreview = () => (
    <Example
        render={(close) => (
            <DrawerComponent onClose={close}>
                <DrawerComponent.Header className={classes.custom}>
                    <DrawerComponent.Title>Filters</DrawerComponent.Title>
                    <DrawerComponent.CloseButton />
                </DrawerComponent.Header>
                <DrawerComponent.Body>{body}</DrawerComponent.Body>
            </DrawerComponent>
        )}
    />
);

const customSetup = `${bodySetup}

const custom = "bg-background-accent-muted";

${openSetup}`;

const customHeaderCode = `<Drawer onClose={close}>
    <Drawer.Header className={custom}>
        <Drawer.Title>Filters</Drawer.Title>
        <Drawer.CloseButton />
    </Drawer.Header>
    <Drawer.Body>{body}</Drawer.Body>
</Drawer>`;

// A body of the caller's own, in place of the padding the drawer would have given it. The header is
// still the drawer's, so a body written out by hand does not cost the title and the close button
const CustomBodyPreview = () => (
    <Example
        render={(close) => (
            <DrawerComponent title="Filters" onClose={close}>
                <DrawerComponent.Body className={classes.custom}>{body}</DrawerComponent.Body>
            </DrawerComponent>
        )}
    />
);

const customBodyCode = `<Drawer title="Filters" onClose={close}>
    <Drawer.Body className={custom}>{body}</Drawer.Body>
</Drawer>`;

// Where focus goes as the drawer opens, and where it goes once it closes. A drawer holding a field
// opens on the field rather than on the close button, since typing is what it was opened for; one
// that leaves the reader somewhere new hands focus there rather than back where it came from
const FocusPreview = () => {
    const noteRef = React.useRef<HTMLTextAreaElement>(null);
    const afterwardsRef = React.useRef<HTMLButtonElement>(null);
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <Stack direction="horizontal" gap="condensed" wrap="wrap" align="start">
            <Example
                label="Opens on the field"
                render={(close) => (
                    <DrawerComponent title="Add a note" initialFocusRef={noteRef} onClose={close}>
                        <Textarea ref={noteRef} aria-label="Note" block />
                        <DrawerComponent.Footer>
                            <Button variant="primary" onClick={close}>
                                Save
                            </Button>
                        </DrawerComponent.Footer>
                    </DrawerComponent>
                )}
            />
            <Button onClick={() => setIsOpen(true)}>Hands focus onwards</Button>
            <Button ref={afterwardsRef}>Takes focus afterwards</Button>
            {isOpen ? (
                <DrawerComponent
                    title="Filters"
                    returnFocusRef={afterwardsRef}
                    onClose={() => setIsOpen(false)}
                >
                    {body}
                </DrawerComponent>
            ) : null}
        </Stack>
    );
};

const focusSetup = `${bodySetup}

const noteRef = React.useRef(null);
const afterwardsRef = React.useRef(null);
${openSetup}`;

const focusCode = `<Drawer title="Add a note" initialFocusRef={noteRef} onClose={close}>
    <Textarea ref={noteRef} aria-label="Note" block />
    <Drawer.Footer>
        <Button variant="primary" onClick={close}>
            Save
        </Button>
    </Drawer.Footer>
</Drawer>

<Button ref={afterwardsRef}>Takes focus afterwards</Button>

<Drawer title="Filters" returnFocusRef={afterwardsRef} onClose={close}>
    {body}
</Drawer>`;

// The drawer as it is reached for, drawn and written out one above the other. The plainest one
// comes first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        setup: `${bodySetup}\n\n${openSetup}`,
        preview: <DefaultPreview />,
        code: defaultCode,
    },
    {
        name: "Which edge it settles against",
        description:
            "Also the edge it arrives from, since a drawer comes in from where it comes to rest. A drawer against a side runs the full height of the screen and a drawer against the top or the bottom runs the full width, so only the one measurement is ever left to say.",
        setup: `${bodySetup}\n\n${openSetup}`,
        preview: <PositionPreview />,
        code: positionCode,
    },
    {
        name: "How far it comes in",
        description:
            "The steps are the overlay scale, so a drawer and a dialog asking for the same size come out the same width. It is read as a width against a side and as a height against the top or the bottom, which is the one measurement the edge leaves open.",
        setup: `${bodySetup}\n\n${openSetup}`,
        preview: <SizePreview />,
        code: sizeCode,
    },
    {
        name: "A size of its own",
        description:
            "Anything that is not a step of the scale is passed straight through as a CSS length, for a drawer that has to hold something of a size the scale was not drawn around.",
        setup: `${bodySetup}\n\n${openSetup}`,
        preview: <CustomSizePreview />,
        code: customSizeCode,
    },
    {
        name: "Left open beside the page",
        description:
            "A modeless drawer leaves the page behind it to be used: nothing is dimmed, the page still scrolls and focus is free to move on past the drawer. It is what a panel that is read alongside the work wants, rather than one that has to be dealt with before the work goes on.",
        setup: `${bodySetup}\n\n${openSetup}`,
        preview: <ModelessPreview />,
        code: modelessCode,
    },
    {
        name: "A footer that stays put",
        description:
            "It sits at the foot of the drawer rather than scrolling away with the body, so the buttons answering the drawer are where they were however far down the reader has gone.",
        setup: `${bodySetup}\n\n${openSetup}`,
        preview: <FooterPreview />,
        code: footerCode,
    },
    {
        name: "More than it can show",
        description:
            "The body scrolls under a header and above a footer that both stay where they are. It is ruled off from the footer for as long as there is more to read, so the line says there is something below rather than merely dividing the two.",
        setup: scrollingSetup,
        preview: <ScrollingPreview />,
        code: scrollingCode,
    },
    {
        name: "A header of its own",
        description:
            "Built out of the drawer's own parts rather than described. The title carries the id the drawer already points at, so the drawer is still named by it, and the close button finds the drawer around it rather than being told how to close it.",
        setup: customSetup,
        preview: <CustomHeaderPreview />,
        code: customHeaderCode,
    },
    {
        name: "A body of its own",
        description:
            "In place of the padding the drawer would have given it. The header is still the drawer's, so a body written out by hand costs neither the title nor the close button.",
        setup: customSetup,
        preview: <CustomBodyPreview />,
        code: customBodyCode,
    },
    {
        name: "Where focus goes",
        description:
            "Focus is held inside a modal drawer while it stands, and handed back to whatever had it once it goes. A drawer holding a field opens on the field rather than on the close button, since typing is what it was opened for; one that leaves the reader somewhere new hands focus there instead of back where it came from.",
        setup: focusSetup,
        preview: <FocusPreview />,
        code: focusCode,
    },
];

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// What the element being drawn takes on top of what the library declares itself. Those props are
// the element's own and are documented wherever elements are, so what is said here is what the
// library adds to them
const polymorphic = (element: string) => ({
    name: "as",
    type: "React.ElementType",
    default: `"${element}"`,
    description: "The element or component this is drawn as, in place of its default",
});

// Every prop the drawer and its parts take, under the part that takes it.
//
// The drawer comes first, since it is what a caller reaches for; the parts follow, and are only
// there for a drawer built up rather than described
const groups: ComponentPropGroup[] = [
    {
        name: "Drawer",
        props: [
            {
                name: "onClose",
                type: "(gesture: DrawerCloseGesture) => void",
                required: true,
                description:
                    "Called when the drawer is dismissed, with what dismissed it: the close button or Escape. Pressing the backdrop is read as Escape, since both are the reader backing out rather than answering",
            },
            {
                name: "title",
                type: "React.ReactNode",
                default: '"Drawer"',
                description:
                    "Names the drawer to a screen reader as well as heading it, so there is nothing else to name it with",
            },
            {
                name: "subtitle",
                type: "React.ReactNode",
                description:
                    "Stands below the title in smaller type, and describes the drawer to a screen reader",
            },
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "What the drawer holds, which the body takes unless a body of the caller's own is given. A Drawer.Header, a Drawer.Body or a Drawer.Footer among them stands in for the part the drawer would have drawn",
            },
            {
                name: "position",
                type: '"left" | "right" | "top" | "bottom"',
                default: '"right"',
                options: ["left", "right", "top", "bottom"],
                description:
                    "Which edge of the screen the drawer settles against, and the edge it arrives from",
            },
            {
                name: "size",
                type: "DrawerSize",
                default: '"medium"',
                description:
                    "How far the drawer comes in from the edge it settles against: a step of the overlay scale, small through xlarge, or a CSS length of its own. It is read as a width against a side and as a height against the top or the bottom",
            },
            {
                name: "modal",
                type: "boolean",
                default: "true",
                description:
                    "Holds the page still behind the drawer and keeps focus within it. A modeless drawer leaves the page to be used: nothing is dimmed, focus is free to move on and the page still scrolls",
            },
            {
                name: "initialFocusRef",
                type: "React.RefObject<HTMLElement | null>",
                description:
                    "Takes focus as the drawer opens, in place of the first thing inside it that can",
            },
            {
                name: "returnFocusRef",
                type: "React.RefObject<HTMLElement | null>",
                description:
                    "Takes focus once the drawer closes, in place of whatever held it beforehand",
            },
            styling,
        ],
    },
    {
        name: "Drawer.Header",
        props: [styling, polymorphic("div")],
    },
    {
        name: "Drawer.Title",
        props: [styling, polymorphic("h1")],
    },
    {
        name: "Drawer.Subtitle",
        props: [styling, polymorphic("h2")],
    },
    {
        name: "Drawer.Body",
        props: [styling, polymorphic("div")],
    },
    {
        name: "Drawer.Footer",
        props: [styling, polymorphic("div")],
    },
    {
        name: "Drawer.CloseButton",
        props: [
            {
                name: "onClose",
                type: "() => void",
                description:
                    "Called when the button is pressed. The drawer around the button already knows how to close itself, so a header of the caller's own does not have to be told how. The button is named by the drawer, so there is nothing left to name it with",
            },
            styling,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the drawer is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const Drawer = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Drawer
            </Heading>
            <Text as="p" size="large">
                A panel that comes in from an edge of the screen and stays anchored to it, for work
                that runs alongside the page rather than in place of it: a set of filters, the
                details of the row that was picked, a form that is filled in without leaving what it
                belongs to. A modal drawer holds the page still behind it the way a dialog does; a
                modeless one leaves it to be used. Something the reader has to deal with before
                going back to what they were doing is a Dialog instead.
            </Text>
        </Stack>
        <ComponentExamples component="Drawer" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Drawer;
