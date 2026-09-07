import { SparkleRegular } from "@gamecrafters/base-ui-icons";
import { Button, Heading, Stack, Text, Toaster, toast } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // The buttons that raise the toasts, laid across and wrapping where there are more of them
    // than the card is wide
    row: "flex flex-wrap gap-[var(--base-size-8)]",
    // What a toast laid out by hand is dressed in, since it is given none of the dressing the
    // component would have put around it
    custom:
        "flex w-full items-center gap-[var(--base-size-8)] " +
        "rounded-[var(--border-radius-medium)] p-[var(--base-size-12)] " +
        "bg-[var(--overlay-background-color)] shadow-[var(--shadow-floating-small)]",
};

// Every kind of thing a toast can be saying, which settles the icon it carries
const variants = ["default", "success", "error", "warning", "info", "loading"] as const;

// The ones that carry a colour of their own, which rich colours take the whole toast from
const colouredVariants = ["success", "error", "warning", "info"] as const;

// Something that takes a moment to finish, for the toasts that stand for one
const wait = (ms: number) =>
    new Promise((settle) => {
        window.setTimeout(settle, ms);
    });

// What the examples that read off a list have to have in hand before they can be drawn
const variantsSetup = `const variants = ["default", "success", "error", "warning", "info", "loading"];`;

const colouredSetup = `const colouredVariants = ["success", "error", "warning", "info"];`;

// The two pieces a toast is made of: the one place they all come out at, standing wherever the
// page keeps its furniture, and the call that raises one, made from wherever something happened.
// Nothing is handed between them — the toasts are held outside React, so a toast can be raised
// from anywhere at all.
//
// The Toaster in this example is the page's own, and it is the only one on it: a second would
// show every toast a second time
const defaultPreview = (
    <div className={classes.row}>
        <Button onClick={() => toast("Your changes have been saved")}>Show a toast</Button>
        <Button
            onClick={() =>
                toast.success("Your changes have been saved", {
                    description: "Everything on this page is up to date as of just now",
                })
            }
        >
            Show a success
        </Button>
    </div>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<>
    <Button onClick={() => toast("Your changes have been saved")}>Show a toast</Button>
    <Toaster />
</>`;

// What the toast is saying, which settles the icon it carries. They are raised from a row of
// buttons rather than one to an example, since what is being read is the run of them
const variantsPreview = (
    <div className={classes.row}>
        {variants.map((variant) => (
            <Button
                key={variant}
                onClick={() =>
                    variant === "default"
                        ? toast("Your changes have been saved")
                        : toast[variant]("Your changes have been saved")
                }
            >
                {variant}
            </Button>
        ))}
    </div>
);

const variantsCode = `<div className="flex flex-wrap gap-[var(--base-size-8)]">
    {variants.map((variant) => (
        <Button
            key={variant}
            onClick={() =>
                variant === "default"
                    ? toast("Your changes have been saved")
                    : toast[variant]("Your changes have been saved")
            }
        >
            {variant}
        </Button>
    ))}
</div>`;

// A second line, for what the first leaves out
const descriptionPreview = (
    <div className={classes.row}>
        <Button
            onClick={() =>
                toast.success("Your changes have been saved", {
                    description: "Everything on this page is up to date as of just now",
                })
            }
        >
            Show a toast
        </Button>
    </div>
);

const descriptionCode = `toast.success("Your changes have been saved", {
    description: "Everything on this page is up to date as of just now",
});`;

// Something to do about what the toast is saying. Pressing it sees the toast off, unless the
// handler asks for it to stay
const actionPreview = (
    <div className={classes.row}>
        <Button
            onClick={() =>
                toast("The draft has been deleted", {
                    action: {
                        label: "Undo",
                        onClick: () => toast.success("The draft is back"),
                    },
                })
            }
        >
            Delete the draft
        </Button>
        <Button
            onClick={() =>
                toast("Leave without saving?", {
                    action: { label: "Leave" },
                    cancel: { label: "Stay" },
                    duration: Infinity,
                })
            }
        >
            Ask before leaving
        </Button>
    </div>
);

const actionCode = `toast("The draft has been deleted", {
    action: {
        label: "Undo",
        onClick: () => toast.success("The draft is back"),
    },
});

toast("Leave without saving?", {
    action: { label: "Leave" },
    cancel: { label: "Stay" },
    duration: Infinity,
});`;

// A button that sees the toast off, for a reader who would rather not wait it out
const closeButtonPreview = (
    <div className={classes.row}>
        <Button onClick={() => toast("Your changes have been saved", { closeButton: true })}>
            Show a toast
        </Button>
    </div>
);

const closeButtonCode = `toast("Your changes have been saved", { closeButton: true });`;

// The whole toast painted after what it is saying, rather than only its icon
const richColorsPreview = (
    <div className={classes.row}>
        {colouredVariants.map((variant) => (
            <Button
                key={variant}
                onClick={() => toast[variant]("Your changes have been saved", { richColors: true })}
            >
                {variant}
            </Button>
        ))}
    </div>
);

const richColorsCode = `<div className="flex flex-wrap gap-[var(--base-size-8)]">
    {colouredVariants.map((variant) => (
        <Button
            key={variant}
            onClick={() => toast[variant]("Your changes have been saved", { richColors: true })}
        >
            {variant}
        </Button>
    ))}
</div>`;

// How long a toast stands before it goes away by itself
const durationPreview = (
    <div className={classes.row}>
        <Button onClick={() => toast("Gone in a moment")}>The Toaster's own time</Button>
        <Button onClick={() => toast("Gone in ten seconds", { duration: 10000 })}>
            A time of its own
        </Button>
        <Button
            onClick={() =>
                toast("Here until it is dismissed", { duration: Infinity, closeButton: true })
            }
        >
            No time at all
        </Button>
    </div>
);

const durationCode = `toast("Gone in a moment");
toast("Gone in ten seconds", { duration: 10000 });
toast("Here until it is dismissed", { duration: Infinity, closeButton: true });`;

// Several at once, which gather into a pile rather than running the length of the viewport
const stackPreview = (
    <div className={classes.row}>
        <Button
            onClick={() => {
                for (let index = 1; index <= 6; index += 1) {
                    toast(`Message ${index}`);
                }
            }}
        >
            Show six toasts
        </Button>
    </div>
);

const stackCode = `<Button
    onClick={() => {
        for (let index = 1; index <= 6; index += 1) {
            toast(\`Message \${index}\`);
        }
    }}
>
    Show six toasts
</Button>`;

// A toast that stands for a promise: it waits while the promise runs and says how it went
const promisePreview = (
    <div className={classes.row}>
        <Button
            onClick={() =>
                toast.promise(
                    wait(2000).then(() => "the draft"),
                    {
                        loading: "Saving",
                        success: (name) => `Saved ${name}`,
                        error: "Could not save the draft",
                    },
                )
            }
        >
            Save the draft
        </Button>
        <Button
            onClick={() =>
                toast.promise(
                    wait(2000).then(() => Promise.reject(new Error("nope"))),
                    {
                        loading: "Saving",
                        success: "Saved the draft",
                        error: "Could not save the draft",
                    },
                )
            }
        >
            Save and give out
        </Button>
    </div>
);

const promiseCode = `toast.promise(save(draft), {
    loading: "Saving",
    success: (name) => \`Saved \${name}\`,
    error: "Could not save the draft",
});`;

// A toast changed where it stands, by raising it again under the id it already has
const changingPreview = (
    <div className={classes.row}>
        <Button
            onClick={() => {
                toast.loading("Uploading", { id: "docs-upload" });
                window.setTimeout(
                    () => toast.success("Uploaded", { id: "docs-upload", description: "3 files" }),
                    2000,
                );
            }}
        >
            Upload
        </Button>
        <Button onClick={() => toast.dismiss()}>Dismiss them all</Button>
    </div>
);

const changingCode = `toast.loading("Uploading", { id: "upload" });

window.setTimeout(
    () => toast.success("Uploaded", { id: "upload", description: "3 files" }),
    2000,
);

toast.dismiss();`;

// A mark of the caller's own, in place of the one the variant carries
const iconPreview = (
    <div className={classes.row}>
        <Button onClick={() => toast("A new theme is ready", { icon: <SparkleRegular /> })}>
            An icon of its own
        </Button>
        <Button onClick={() => toast.success("Your changes have been saved", { icon: null })}>
            No icon at all
        </Button>
    </div>
);

const iconCode = `toast("A new theme is ready", { icon: <SparkleRegular /> });
toast.success("Your changes have been saved", { icon: null });`;

// A toast laid out by hand, in place of everything the component would lay out of its own
const customPreview = (
    <div className={classes.row}>
        <Button
            onClick={() =>
                toast.custom((item) => (
                    <div className={classes.custom}>
                        <SparkleRegular />
                        <Text>A toast laid out from end to end by hand</Text>
                        <Button size="small" onClick={() => toast.dismiss(item.id)}>
                            Close
                        </Button>
                    </div>
                ))
            }
        >
            Show a toast
        </Button>
    </div>
);

const customCode = `toast.custom((item) => (
    <div className="flex w-full items-center gap-[var(--base-size-8)] rounded-[var(--border-radius-medium)] bg-[var(--overlay-background-color)] p-[var(--base-size-12)] shadow-[var(--shadow-floating-small)]">
        <SparkleRegular />
        <Text>A toast laid out from end to end by hand</Text>
        <Button size="small" onClick={() => toast.dismiss(item.id)}>
            Close
        </Button>
    </div>
));`;

// The toast as it is reached for, drawn and written out one above the other. The two pieces come
// first, then what a toast is saying and what it can carry, then how long it stands and what
// several of them come to, and last the ways one is raised that are not a line of words
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "The two pieces a toast is made of: one Toaster standing wherever the page keeps its furniture, and a call to toast from wherever something happened. Nothing is handed between them, since the toasts are held outside React — which is what lets a toast be raised from a handler, a hook, or a module with no component in sight. A page has one Toaster: a second would show every toast a second time.",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "What the toast is saying",
        description:
            "The six kinds of thing a toast can be. Each carries an icon of its own, which is what tells one from another where rich colours are off — a toast that waits on something carries a spinner and stands until it is told how it went, so it is the one kind that does not go away by itself.",
        setup: variantsSetup,
        preview: variantsPreview,
        code: variantsCode,
    },
    {
        name: "A second line",
        description:
            "What the first line leaves out, set under it in a quieter voice. The first line is what the toast is for, so it is worth keeping to a few words and letting the description carry the rest.",
        preview: descriptionPreview,
        code: descriptionCode,
    },
    {
        name: "Something to do about it",
        description:
            "A button beside the words, and a second one for turning the offer down. Pressing either sees the toast off, unless the handler takes the event to keep it standing. A toast asking a question is worth giving no time at all, since one that answers itself by going away is not a question.",
        preview: actionPreview,
        code: actionCode,
    },
    {
        name: "A close button",
        description:
            "A button that sees the toast off, for a reader who would rather not wait it out. It can be given to a toast on its own or to every toast the Toaster shows, and a toast that cannot be dismissed by hand keeps it out of the way.",
        preview: closeButtonPreview,
        code: closeButtonCode,
    },
    {
        name: "Rich colours",
        description:
            "The whole toast painted after what it is saying rather than only its icon. It is worth reaching for where a toast has to be read at a glance from across the page — and worth leaving alone where toasts are common enough that a wall of colour would be the loudest thing on it.",
        setup: colouredSetup,
        preview: richColorsPreview,
        code: richColorsCode,
    },
    {
        name: "How long it stands",
        description:
            "How long a toast stands before it goes away by itself. The Toaster sets a time for all of them and a toast can take one of its own; Infinity leaves it standing until something dismisses it, which is what a toast carrying a question or an error wants. A toast the reader is resting on is held where it is until they leave it.",
        preview: durationPreview,
        code: durationCode,
    },
    {
        name: "Several at once",
        description:
            "Toasts gather into a pile rather than running the length of the viewport: three stand at a time by default and the rest wait behind them, and the pile opens out as the reader comes to it with a pointer or with the keyboard. While they are on it, every toast in the stack is held where it is rather than counting down.",
        preview: stackPreview,
        code: stackCode,
    },
    {
        name: "A toast that stands for a promise",
        description:
            "One toast for the whole of something that takes a moment: it waits while the promise runs and says how it went once it settles, changing where it stands rather than being replaced by a second toast. The message can be worked out from what the promise settled with, and a rejection is answered here rather than passed on, since what was asked for was the toast.",
        preview: promisePreview,
        code: promiseCode,
    },
    {
        name: "Changing a toast where it stands",
        description:
            "Raising a toast again under the id it already has changes the one standing rather than putting up another beside it. It keeps the place it had in the stack and is given its time over again, which is how a toast that was waiting becomes one that is done.",
        preview: changingPreview,
        code: changingCode,
    },
    {
        name: "A mark of its own",
        description:
            "An icon in place of the one the variant carries, or none at all. Null is the way to say none: leaving it out is how a toast asks for the one its variant would have given it.",
        preview: iconPreview,
        code: iconCode,
    },
    {
        name: "A toast laid out by hand",
        description:
            "Everything the toast would have laid out, given over to the caller. It is handed the toast it stands for, so it can dismiss itself — which it has to be able to do, since none of the buttons the component would have drawn are there.",
        preview: customPreview,
        code: customCode,
    },
];

// The corner or the edge of the viewport the toasts gather at
const position =
    '"top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"';

// A button given either as a label and what to do, or as an element the caller has built
const action = "ToastActionDescriptor | React.ReactNode";

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Everything the toast takes, under the piece that takes it. The place they all come out at comes
// first, since a page has to have one before anything can be raised, then the calls that raise
// them, then what a toast can be told, and last the shape a button is given in
const groups: ComponentPropGroup[] = [
    {
        name: "Toaster",
        props: [
            {
                name: "position",
                type: position,
                default: '"bottom-right"',
                description:
                    "The corner or the edge of the viewport the toasts gather at. It also settles which ways a toast can be swiped away, unless those are named",
            },
            {
                name: "expand",
                type: "boolean",
                default: "false",
                description:
                    "Lays the stack out in full rather than gathering it into a pile. A gathered pile opens out anyway as the reader comes to it, so this is for a page where toasts are read rather than glanced at",
            },
            {
                name: "visibleToasts",
                type: "number",
                default: "3",
                description: "How many toasts stand at once. The rest wait behind them",
            },
            {
                name: "duration",
                type: "number",
                default: "4000",
                description:
                    "How long a toast stands before it goes away by itself, in milliseconds. A toast can take a time of its own instead",
            },
            {
                name: "closeButton",
                type: "boolean",
                default: "false",
                description: "Gives every toast a button that sees it off",
            },
            {
                name: "richColors",
                type: "boolean",
                default: "false",
                description:
                    "Colours every toast after what it is saying, rather than only its icon",
            },
            {
                name: "toastOptions",
                type: "ToastOptions",
                description:
                    "What every toast takes unless it says otherwise, for the settings that have no prop of their own on the Toaster",
            },
            {
                name: "gap",
                type: "number",
                default: "14",
                description: "The room between one toast and the next, in pixels",
            },
            {
                name: "offset",
                type: "number | string",
                default: "24",
                description: "How far the stack stands from the edges of the viewport",
            },
            {
                name: "mobileOffset",
                type: "number | string",
                default: "16",
                description: "The same, on a narrow viewport",
            },
            {
                name: "width",
                type: "number | string",
                default: "356",
                description: "How wide the toasts are drawn",
            },
            {
                name: "hotkey",
                type: "string[]",
                default: '["altKey", "KeyT"]',
                description:
                    "The keys that put focus on the stack, each given either as a property of the keyboard event, such as altKey, or as the code of a key, such as KeyT",
            },
            {
                name: "swipeDirections",
                type: "ToastSwipeDirection[]",
                description:
                    "Which ways a toast can be swiped away. Taken from the position where it is left out, so a stack at the bottom right is swiped right",
            },
            {
                name: "icons",
                type: "ToastIcons",
                description: "Marks standing in for the ones the variants carry of their own",
            },
            {
                name: "containerAriaLabel",
                type: "string",
                default: '"Notifications"',
                description: "Names the region the toasts stand in",
            },
            styling,
        ],
    },
    {
        name: "toast",
        props: [
            {
                name: "toast",
                type: "(title: React.ReactNode, options?: ToastOptions) => string",
                description:
                    "Raises a toast with no colour of its own, and hands back its id, which is what changes or dismisses it afterwards. It is also available as toast.message",
            },
            {
                name: "toast.success",
                type: "(title: React.ReactNode, options?: ToastOptions) => string",
                description: "The same, for something that went as it should",
            },
            {
                name: "toast.error",
                type: "(title: React.ReactNode, options?: ToastOptions) => string",
                description: "The same, for something that did not",
            },
            {
                name: "toast.warning",
                type: "(title: React.ReactNode, options?: ToastOptions) => string",
                description: "The same, for something worth stopping at",
            },
            {
                name: "toast.info",
                type: "(title: React.ReactNode, options?: ToastOptions) => string",
                description: "The same, for something merely worth saying",
            },
            {
                name: "toast.loading",
                type: "(title: React.ReactNode, options?: ToastOptions) => string",
                description:
                    "A toast that waits on something. It is given no time at all unless one is asked for, since it stands until it is told how the thing went",
            },
            {
                name: "toast.promise",
                type: "(input, messages, options?) => string",
                description:
                    "One toast for the whole of a promise: it waits while the promise runs and changes where it stands once it settles. A message can be a function, which is handed what the promise settled with",
            },
            {
                name: "toast.custom",
                type: "(render: (toast: ToastItem) => React.ReactNode, options?) => string",
                description:
                    "A toast the caller lays out themselves, in place of everything the component would lay out. It is handed the toast it stands for, so it can dismiss itself",
            },
            {
                name: "toast.dismiss",
                type: "(id?: string) => string | undefined",
                description:
                    "Sees a toast off by id, or everything standing where it is given none. The toast is animated away before it is taken off the list",
            },
            {
                name: "toast.getToasts",
                type: "() => ToastItem[]",
                description: "Everything standing right now, for a caller who has to look",
            },
        ],
    },
    {
        name: "ToastOptions",
        props: [
            {
                name: "id",
                type: "string",
                description:
                    "Names the toast, so that raising it again under the same id changes the one already standing rather than putting up another beside it. One is worked out where it is left out",
            },
            {
                name: "description",
                type: "React.ReactNode",
                description: "A second line, for what the first leaves out",
            },
            {
                name: "duration",
                type: "number",
                description:
                    "How long this toast stands, in milliseconds. Infinity leaves it standing until something dismisses it",
            },
            {
                name: "icon",
                type: "React.ReactNode",
                description:
                    "A mark in place of the one the variant carries. Null leaves the toast without one; leaving it out keeps the variant's own",
            },
            {
                name: "action",
                type: action,
                description:
                    "A button beside the words. The toast closes once it has been pressed, unless the handler asks for it to stay by taking the event",
            },
            {
                name: "cancel",
                type: action,
                description: "A second button, for turning the offer down",
            },
            {
                name: "closeButton",
                type: "boolean",
                description: "Gives this toast a button that sees it off",
            },
            {
                name: "dismissible",
                type: "boolean",
                default: "true",
                description:
                    "Whether the toast can be seen off by hand. One that cannot ignores a swipe and keeps its close button out of the way",
            },
            {
                name: "richColors",
                type: "boolean",
                description:
                    "Colours this toast after what it is saying, rather than only its icon",
            },
            {
                name: "important",
                type: "boolean",
                description:
                    "Read out at once, rather than when the reader next comes to a pause. It is worth it for something that has to be heard now and worth avoiding for anything else",
            },
            {
                name: "onDismiss",
                type: "(toast: ToastItem) => void",
                description:
                    "Called when the toast is seen off by hand: a close button, a swipe, one of its own buttons, or toast.dismiss",
            },
            {
                name: "onAutoClose",
                type: "(toast: ToastItem) => void",
                description: "Called when the toast went away by itself, its time having run out",
            },
            styling,
        ],
    },
    {
        name: "ToastActionDescriptor",
        props: [
            {
                name: "label",
                type: "React.ReactNode",
                required: true,
                description: "What the button says",
            },
            {
                name: "onClick",
                type: "(event: React.MouseEvent<HTMLButtonElement>) => void",
                description:
                    "What the button does. Taking the event keeps the toast standing, which is what a button that does something the reader stays to watch wants",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the toast is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take.
//
// The Toaster stands here rather than in any one example, since it is the page's own and there is
// only ever one: every example above raises its toasts into this one
const Toast = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Toast
            </Heading>
            <Text as="p" size="large">
                A short message about something that has just happened, standing over the corner of
                the page for a moment and then going away. It is made of two pieces: one Toaster,
                standing wherever the page keeps its furniture, and a call to toast from wherever
                the thing happened. Nothing is handed between them — the toasts are held outside
                React, so one can be raised from a handler, a hook, or a module with no component in
                sight.
            </Text>
            <Text as="p" size="large">
                A page has one Toaster, not one for every place a toast is raised: a second would
                show every toast a second time. Toasts gather into a pile that opens out as the
                reader comes to it, and every one in the stack is held where it is while they are on
                it, so a message is not taken away from under someone reading it.
            </Text>
        </Stack>
        <ComponentExamples component="Toast" examples={examples} />
        <ComponentProps groups={groups} />
        <Toaster />
    </Stack>
);

export default Toast;
