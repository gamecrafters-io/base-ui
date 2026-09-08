import * as React from "react";
import { DismissRegular } from "@gamecrafters/base-ui-icons";
import { Button, Heading, Stack, Steps as StepsComponent, Text } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // A row of steps shares out whatever room it is given between them, so across the whole of the
    // card the circles would be flung to the edges of the page. It is given a column to share out
    // instead
    row: "w-[36rem]",
    // A column of steps asks for less room across than a row of them does, since the words stand
    // beside each circle rather than being strung out along a line
    column: "w-[20rem]",
};

// What the examples are stepping through. The steps are the caller's rather than anything the list
// is told: what the list is given is how far along the flow has come, and it hands each step where
// it stands from that
const steps = [
    { title: "Create an account", description: "Pick a name and a password" },
    { title: "Add your details", description: "Tell us where to send things" },
    { title: "Start building", description: "Open your first project" },
];

// What every example has to have in hand before it can be drawn. The steps are written once and
// reached for by each of them, since what changes between the examples is how far along the flow
// has come rather than what it is a flow of
const setup = `const steps = [
    { title: "Create an account", description: "Pick a name and a password" },
    { title: "Add your details", description: "Tell us where to send things" },
    { title: "Start building", description: "Open your first project" },
];`;

// The same, and how far along the flow has come, for the one example where that moves
const movingSetup = `${setup}

const [currentStep, setCurrentStep] = React.useState(1);`;

// The plainest flow there is: a row of steps with the second of them the one being worked on. How
// far along the flow has come is said once, to the list, and each step is handed where it stands
// from that rather than being told one at a time — so moving the flow on is one number changing.
//
// The list is named, since a row of circles and words says nothing on its own about what is being
// stepped through.
//
// The column around it is the page's own furniture: a row shares out whatever room it is given, so
// across the whole of the card the circles would be flung to the edges of the page. The listing
// beneath is of the list alone.
//
// The page and the component it is about are both called Steps, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Steps, as an application
// importing it would
const defaultPreview = (
    <Stack className={classes.row}>
        <StepsComponent currentStep={2} aria-label="Set up your project">
            {steps.map((step) => (
                <StepsComponent.Item key={step.title}>
                    <StepsComponent.Indicator />
                    <StepsComponent.Body>
                        <StepsComponent.Title>{step.title}</StepsComponent.Title>
                    </StepsComponent.Body>
                </StepsComponent.Item>
            ))}
        </StepsComponent>
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Steps currentStep={2} aria-label="Set up your project">
    {steps.map((step) => (
        <Steps.Item key={step.title}>
            <Steps.Indicator />
            <Steps.Body>
                <Steps.Title>{step.title}</Steps.Title>
            </Steps.Body>
        </Steps.Item>
    ))}
</Steps>`;

// The steps run down the page rather than across it, which leaves each of them the room to say more
// than its name. The line joining one to the next runs down through the column the circles stand
// in, so the flow is read as one thread rather than as a stack of rows
const verticalPreview = (
    <Stack className={classes.column}>
        <StepsComponent currentStep={2} orientation="vertical" aria-label="Set up your project">
            {steps.map((step) => (
                <StepsComponent.Item key={step.title}>
                    <StepsComponent.Indicator />
                    <StepsComponent.Body>
                        <StepsComponent.Title>{step.title}</StepsComponent.Title>
                        <StepsComponent.Description>{step.description}</StepsComponent.Description>
                    </StepsComponent.Body>
                </StepsComponent.Item>
            ))}
        </StepsComponent>
    </Stack>
);

const verticalCode = `<Steps currentStep={2} orientation="vertical" aria-label="Set up your project">
    {steps.map((step) => (
        <Steps.Item key={step.title}>
            <Steps.Indicator />
            <Steps.Body>
                <Steps.Title>{step.title}</Steps.Title>
                <Steps.Description>{step.description}</Steps.Description>
            </Steps.Body>
        </Steps.Item>
    ))}
</Steps>`;

// The two sizes the list comes in, drawn together since a size is read against the other rather
// than on its own. Everything a step is drawn from follows the size the list stands at, so the
// circle, the line out of it and the room between them all come down together
const sizesPreview = (
    <Stack gap="spacious" className={classes.row}>
        <StepsComponent currentStep={2} size="small" aria-label="Set up your project, small">
            {steps.map((step) => (
                <StepsComponent.Item key={step.title}>
                    <StepsComponent.Indicator />
                    <StepsComponent.Body>
                        <StepsComponent.Title>{step.title}</StepsComponent.Title>
                    </StepsComponent.Body>
                </StepsComponent.Item>
            ))}
        </StepsComponent>
        <StepsComponent currentStep={2} aria-label="Set up your project, medium">
            {steps.map((step) => (
                <StepsComponent.Item key={step.title}>
                    <StepsComponent.Indicator />
                    <StepsComponent.Body>
                        <StepsComponent.Title>{step.title}</StepsComponent.Title>
                    </StepsComponent.Body>
                </StepsComponent.Item>
            ))}
        </StepsComponent>
    </Stack>
);

const sizesCode = `<Stack gap="spacious">
    <Steps currentStep={2} size="small" aria-label="Set up your project, small">
        {steps.map((step) => (
            <Steps.Item key={step.title}>
                <Steps.Indicator />
                <Steps.Body>
                    <Steps.Title>{step.title}</Steps.Title>
                </Steps.Body>
            </Steps.Item>
        ))}
    </Steps>
    <Steps currentStep={2} aria-label="Set up your project, medium">
        {steps.map((step) => (
            <Steps.Item key={step.title}>
                <Steps.Indicator />
                <Steps.Body>
                    <Steps.Title>{step.title}</Steps.Title>
                </Steps.Body>
            </Steps.Item>
        ))}
    </Steps>
</Stack>`;

// The two ends of the count, drawn together. Nought leaves every step still to come, since there is
// no step nought for the flow to be standing on; a number past the last of them leaves the whole
// flow done, with nothing left being worked on
const boundsPreview = (
    <Stack gap="spacious" className={classes.row}>
        <StepsComponent currentStep={0} aria-label="Set up your project, not started">
            {steps.map((step) => (
                <StepsComponent.Item key={step.title}>
                    <StepsComponent.Indicator />
                    <StepsComponent.Body>
                        <StepsComponent.Title>{step.title}</StepsComponent.Title>
                    </StepsComponent.Body>
                </StepsComponent.Item>
            ))}
        </StepsComponent>
        <StepsComponent currentStep={steps.length + 1} aria-label="Set up your project, finished">
            {steps.map((step) => (
                <StepsComponent.Item key={step.title}>
                    <StepsComponent.Indicator />
                    <StepsComponent.Body>
                        <StepsComponent.Title>{step.title}</StepsComponent.Title>
                    </StepsComponent.Body>
                </StepsComponent.Item>
            ))}
        </StepsComponent>
    </Stack>
);

const boundsCode = `<Stack gap="spacious">
    <Steps currentStep={0} aria-label="Set up your project, not started">
        {steps.map((step) => (
            <Steps.Item key={step.title}>
                <Steps.Indicator />
                <Steps.Body>
                    <Steps.Title>{step.title}</Steps.Title>
                </Steps.Body>
            </Steps.Item>
        ))}
    </Steps>
    <Steps currentStep={steps.length + 1} aria-label="Set up your project, finished">
        {steps.map((step) => (
            <Steps.Item key={step.title}>
                <Steps.Indicator />
                <Steps.Body>
                    <Steps.Title>{step.title}</Steps.Title>
                </Steps.Body>
            </Steps.Item>
        ))}
    </Steps>
</Stack>`;

// A step standing somewhere the count cannot say. The flow has reached the third step, so counting
// alone would have the second one done; it was skipped instead, and says so in its own right — in
// the state it carries, in the mark drawn in place of the number, and in the words a screen reader
// is given for it
const toldPreview = (
    <Stack className={classes.column}>
        <StepsComponent currentStep={3} orientation="vertical" aria-label="Publish your release">
            <StepsComponent.Item>
                <StepsComponent.Indicator />
                <StepsComponent.Body>
                    <StepsComponent.Title>Build the release</StepsComponent.Title>
                </StepsComponent.Body>
            </StepsComponent.Item>
            <StepsComponent.Item status="incomplete" statusLabel="Skipped">
                <StepsComponent.Indicator>
                    <DismissRegular />
                </StepsComponent.Indicator>
                <StepsComponent.Body>
                    <StepsComponent.Title>Run the smoke tests</StepsComponent.Title>
                    <StepsComponent.Description>
                        Skipped for this release
                    </StepsComponent.Description>
                </StepsComponent.Body>
            </StepsComponent.Item>
            <StepsComponent.Item>
                <StepsComponent.Indicator />
                <StepsComponent.Body>
                    <StepsComponent.Title>Publish to the registry</StepsComponent.Title>
                </StepsComponent.Body>
            </StepsComponent.Item>
        </StepsComponent>
    </Stack>
);

const toldCode = `<Steps currentStep={3} orientation="vertical" aria-label="Publish your release">
    <Steps.Item>
        <Steps.Indicator />
        <Steps.Body>
            <Steps.Title>Build the release</Steps.Title>
        </Steps.Body>
    </Steps.Item>
    <Steps.Item status="incomplete" statusLabel="Skipped">
        <Steps.Indicator>
            <DismissRegular />
        </Steps.Indicator>
        <Steps.Body>
            <Steps.Title>Run the smoke tests</Steps.Title>
            <Steps.Description>Skipped for this release</Steps.Description>
        </Steps.Body>
    </Steps.Item>
    <Steps.Item>
        <Steps.Indicator />
        <Steps.Body>
            <Steps.Title>Publish to the registry</Steps.Title>
        </Steps.Body>
    </Steps.Item>
</Steps>`;

// The flow moved on by whatever is driving it. How far it has come is the caller's, since the list
// only draws it: the buttons below say what moving on comes to, and the list is handed the answer.
//
// The state is the caller's, which makes this a component of its own rather than an element the
// page holds ready
const MovingPreview = () => {
    const [currentStep, setCurrentStep] = React.useState(1);

    return (
        <Stack gap="normal" className={classes.row}>
            <StepsComponent currentStep={currentStep} aria-label="Set up your project">
                {steps.map((step) => (
                    <StepsComponent.Item key={step.title}>
                        <StepsComponent.Indicator />
                        <StepsComponent.Body>
                            <StepsComponent.Title>{step.title}</StepsComponent.Title>
                        </StepsComponent.Body>
                    </StepsComponent.Item>
                ))}
            </StepsComponent>
            <Stack direction="horizontal" gap="condensed">
                <Button
                    disabled={currentStep <= 1}
                    onClick={() => setCurrentStep((step) => step - 1)}
                >
                    Back
                </Button>
                <Button
                    variant="primary"
                    disabled={currentStep > steps.length}
                    onClick={() => setCurrentStep((step) => step + 1)}
                >
                    {currentStep === steps.length ? "Finish" : "Next"}
                </Button>
            </Stack>
        </Stack>
    );
};

const movingCode = `<Stack gap="normal">
    <Steps currentStep={currentStep} aria-label="Set up your project">
        {steps.map((step) => (
            <Steps.Item key={step.title}>
                <Steps.Indicator />
                <Steps.Body>
                    <Steps.Title>{step.title}</Steps.Title>
                </Steps.Body>
            </Steps.Item>
        ))}
    </Steps>
    <Stack direction="horizontal" gap="condensed">
        <Button disabled={currentStep <= 1} onClick={() => setCurrentStep((step) => step - 1)}>
            Back
        </Button>
        <Button
            variant="primary"
            disabled={currentStep > steps.length}
            onClick={() => setCurrentStep((step) => step + 1)}
        >
            {currentStep === steps.length ? "Finish" : "Next"}
        </Button>
    </Stack>
</Stack>`;

// The list as it is reached for, drawn and written out one above the other. The plainest one comes
// first, then which way the steps run and how large they are drawn, then what the count comes to at
// either end of it, then a step that stands outside the count, and last the flow being moved on
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "A row of steps with the second of them the one being worked on. How far along the flow has come is said once, to the list, and each step is handed where it stands from that — the ones before it are done, the one it has reached is being worked on, and the rest are still to come — so moving the flow on is one number changing rather than every step being told again. The one being worked on is ringed rather than filled, which leaves the one filled circle in the row as the last one the flow finished.",
        setup,
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Down a column",
        description:
            "Which way the steps run, and so which way the line between them is drawn. A column leaves each step the room to say more than its name, so it is where a description belongs; a row strung with them would come out narrow and ragged. The line runs down through the column the circles stand in and is held off both ends, so the flow is read as one thread rather than as a stack of rows.",
        setup,
        preview: verticalPreview,
        code: verticalCode,
    },
    {
        name: "Sizes",
        description:
            "The two the list comes in. Small is for a flow standing beside the work rather than above it. Everything a step is drawn from follows the size the list stands at — the circle, the line out of it, the room between them and the words beside them — so nothing has to be sized a second time.",
        setup,
        preview: sizesPreview,
        code: sizesCode,
    },
    {
        name: "Before it has started, and after it has finished",
        description:
            "The two ends of the count. Nought leaves every step still to come, since there is no step nought for the flow to be standing on, and a number past the last of them leaves the whole flow done with nothing left being worked on. Both are worth drawing: a flow that has not been started yet reads as a list of what is coming, and one that is finished reads as a receipt.",
        setup,
        preview: boundsPreview,
        code: boundsCode,
    },
    {
        name: "A step told where it stands",
        description:
            "A step standing somewhere the count cannot say. The flow has reached the third step, so counting alone would have the second one done; it was skipped instead, and says so in its own right. What it is told is kept whatever the count says, the mark inside the circle is drawn in place of the number, and the words a screen reader is given for it are said in place of the ones it would have had — since “Not completed” and “Skipped” are not the same thing to somebody who cannot see that the circle is crossed rather than empty. The steps are written out one by one here rather than mapped, since what is worth seeing is the one of them that differs.",
        preview: toldPreview,
        code: toldCode,
    },
    {
        name: "Moving through the flow",
        description:
            "How far along the flow has come is the caller's: the list only draws it. The buttons below say what moving on comes to, and the list is handed the answer, so the same list serves a flow driven by a form being filled in, by a job finishing somewhere else, or by a reader pressing Next.",
        setup: movingSetup,
        preview: <MovingPreview />,
        code: movingCode,
    },
];

// How far along a step is
const status = '"complete" | "current" | "incomplete"';

// Which way the steps run, and so which way the line between them is drawn
const orientation = '"horizontal" | "vertical"';

// How large the steps are drawn
const size = '"small" | "medium"';

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the list takes, and then the parts a step is drawn from.
//
// How far along the flow has come comes first, since that is the whole of what the list is told,
// and how it is drawn follows
const groups: ComponentPropGroup[] = [
    {
        name: "Steps",
        props: [
            {
                name: "currentStep",
                type: "number",
                default: "1",
                description:
                    "Which step the flow has reached, counted from one so that it names the number the step is drawn with. Every step before it is done, and every step after it is still to come. Nought leaves the whole flow still to come, and a number past the last step leaves the whole of it done",
            },
            {
                name: "orientation",
                type: orientation,
                default: '"horizontal"',
                description:
                    "Which way the steps run, and so which way the line between them is drawn. A row shares out whatever room it is given between the steps; a column leaves each of them the room to say more than its name",
            },
            {
                name: "size",
                type: size,
                default: '"medium"',
                description:
                    "How large the steps are drawn. Everything a step is drawn from follows it — the circle, the line out of it and the room between them — so nothing has to be sized a second time",
            },
            styling,
            {
                name: "...ol props",
                type: 'Omit<React.ComponentPropsWithoutRef<"ol">, "role">',
                description:
                    "The list is an ordered list underneath, so it takes what one takes — aria-label above all, since a row of circles and words says nothing on its own about what is being stepped through. The role is the list's own: it is stated rather than left to the element, because Safari takes the list semantics away from a list drawn without markers",
            },
        ],
    },
    {
        name: "Steps.Item",
        props: [
            {
                name: "status",
                type: status,
                description:
                    "Says where the step stands in its own right, rather than leaving it to be worked out from the step the flow has reached. What it is told is kept whatever the count says, which is what a step that was skipped, or one already done out of order, is given",
            },
            {
                name: "statusLabel",
                type: "string",
                default: '"Completed" or "Not completed"',
                description:
                    "What a screen reader hears for the state the step is in. The circle beside the words is drawn rather than said, so without this a step that is done and one still to come would read alike. The step being worked on says so through aria-current instead, so it is given nothing here. An empty string leaves the state unsaid",
            },
            styling,
            {
                name: "...li props",
                type: 'React.ComponentPropsWithoutRef<"li">',
                description:
                    "It is a list item underneath, so it takes what one takes. The step being worked on is marked as the one the reader is on, and every step draws the line leading out of itself rather than the list drawing them all, so one step runs straight into the next however many there are",
            },
        ],
    },
    {
        name: "Steps.Indicator",
        props: [
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "Drawn inside the circle in place of what it would hold: the number the step stands at while it is still to come or being worked on, and a checkmark once it is done. Whatever it ends up holding is a picture of what the step already says in words of its own, so it is kept from a screen reader rather than read out twice. The circle keeps its size whatever it is given, so a number, a checkmark and a mark of the caller's own are all drawn alike down the list",
            },
            styling,
            {
                name: "...span props",
                type: 'React.ComponentPropsWithoutRef<"span">',
                description: "It is a span underneath, so it takes what one takes",
            },
        ],
    },
    {
        name: "Steps.Body",
        props: [
            styling,
            {
                name: "...div props",
                type: 'React.ComponentPropsWithoutRef<"div">',
                description:
                    "The words beside the circle. They stack, so a step saying more than its name has room for the rest of it",
            },
        ],
    },
    {
        name: "Steps.Title",
        props: [
            styling,
            {
                name: "...span props",
                type: 'React.ComponentPropsWithoutRef<"span">',
                description:
                    "What the step is called. How it is drawn follows the state the step around it is in, so the one being worked on stands out from the ones that are done and the ones still to come, and a step still to come is drawn back rather than out",
            },
        ],
    },
    {
        name: "Steps.Description",
        props: [
            styling,
            {
                name: "...span props",
                type: 'React.ComponentPropsWithoutRef<"span">',
                description:
                    "Secondary text saying more about a step than its title does. It belongs to a column, where there is room across for it to be read",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the list is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const Steps = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Steps
            </Heading>
            <Text as="p" size="large">
                The way through a flow of several steps, read as a row or a column of them. It says
                what there is to do, in what order, and how much of it is behind the reader — which
                is what makes a long form or a set-up worth starting. How far along the flow has
                come is said once, to the list, and every step is handed where it stands from that,
                so moving on is one number changing rather than every step being told again. A step
                that stands somewhere the count cannot say — one that was skipped, or one already
                done out of order — can still be told where it stands and keeps what it was told. It
                draws the flow rather than driving it: nothing here is pressed, and how far along
                the flow has come is the caller&apos;s.
            </Text>
        </Stack>
        <ComponentExamples component="Steps" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Steps;
