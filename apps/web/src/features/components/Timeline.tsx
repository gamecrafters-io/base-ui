import {
    BranchForkRegular,
    BranchRegular,
    CheckmarkCircleRegular,
    CommentRegular,
    DismissCircleRegular,
} from "@gamecrafters/base-ui-icons";
import {
    Avatar,
    Button,
    Heading,
    Link,
    Stack,
    Text,
    Timeline as TimelineComponent,
} from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";
import type { TimelineBadgeVariant } from "@gamecrafters/base-ui/react";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // The timeline reads the room it is given rather than the width of the window, so it is given
    // a column to read: across the whole of the card it would lay itself out one way and never the
    // other, and what a reader would see is only half of what it does
    column: "w-[36rem]",
    // Little enough room across that the item lays itself out again and the actions drop below
    // what they belong to
    narrow: "w-[22rem]",
    // The avatar stands out in the gutter beside the rail rather than within the item, so the
    // column it stands in has to leave the room for it
    gutter: "w-[36rem] ps-[var(--base-size-80)]",
};

// Where the picture is fetched from. It is the one the library's own stories are drawn with, so
// whoever is shown here and whoever is shown there are the same person
const source = "https://avatars.githubusercontent.com/u/7143434?v=4";

// Every fill a badge comes in. They are named for what has happened rather than for the colour
// they are drawn in, so a timeline reads the same wherever the palette is changed under it
const variants: TimelineBadgeVariant[] = [
    "accent",
    "success",
    "attention",
    "severe",
    "danger",
    "done",
    "open",
    "closed",
    "sponsors",
];

// What the one example showing every fill has in hand before it can be drawn
const variantsSetup = `const variants = [
    "accent",
    "success",
    "attention",
    "severe",
    "danger",
    "done",
    "open",
    "closed",
    "sponsors",
];`;

const sourceSetup = `const source = "https://avatars.githubusercontent.com/u/7143434?v=4";`;

// The plainest timeline there is: a run of events, each marked with a badge standing over the rail
// and saying what happened beside it. The rail is drawn by each item rather than by the list, so
// one event runs straight into the next however many there are.
//
// The mark inside a badge is a picture of what the words beside it already say, so it is kept from
// a screen reader rather than read out twice.
//
// The column around it is the page's own furniture: the timeline reads the room it is given rather
// than the width of the window, so it is given a column to read. The listing beneath is of the
// timeline alone.
//
// The page and the component it is about are both called Timeline, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Timeline, as an application
// importing it would
const defaultPreview = (
    <Stack className={classes.column}>
        <TimelineComponent>
            <TimelineComponent.Item>
                <TimelineComponent.Badge>
                    <BranchForkRegular aria-hidden="true" />
                </TimelineComponent.Badge>
                <TimelineComponent.Body>Opened this pull request</TimelineComponent.Body>
            </TimelineComponent.Item>
            <TimelineComponent.Item>
                <TimelineComponent.Badge>
                    <BranchRegular aria-hidden="true" />
                </TimelineComponent.Badge>
                <TimelineComponent.Body>Pushed two commits</TimelineComponent.Body>
            </TimelineComponent.Item>
            <TimelineComponent.Item>
                <TimelineComponent.Badge variant="done">
                    <CheckmarkCircleRegular aria-hidden="true" />
                </TimelineComponent.Badge>
                <TimelineComponent.Body>Merged the pull request</TimelineComponent.Body>
            </TimelineComponent.Item>
        </TimelineComponent>
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Timeline>
    <Timeline.Item>
        <Timeline.Badge>
            <BranchForkRegular aria-hidden="true" />
        </Timeline.Badge>
        <Timeline.Body>Opened this pull request</Timeline.Body>
    </Timeline.Item>
    <Timeline.Item>
        <Timeline.Badge>
            <BranchRegular aria-hidden="true" />
        </Timeline.Badge>
        <Timeline.Body>Pushed two commits</Timeline.Body>
    </Timeline.Item>
    <Timeline.Item>
        <Timeline.Badge variant="done">
            <CheckmarkCircleRegular aria-hidden="true" />
        </Timeline.Badge>
        <Timeline.Body>Merged the pull request</Timeline.Body>
    </Timeline.Item>
</Timeline>`;

// The rail brought back to the badges at either end. Left alone it runs the whole height of the
// first and last items, which reads as a timeline carrying on past what it holds; trimmed, it
// begins and ends where the events do. The two are drawn together, since what is worth seeing is
// the line above the first badge and below the last one going away
const clipPreview = (
    <Stack gap="spacious" className={classes.column}>
        <TimelineComponent>
            <TimelineComponent.Item>
                <TimelineComponent.Badge>
                    <BranchForkRegular aria-hidden="true" />
                </TimelineComponent.Badge>
                <TimelineComponent.Body>Opened this pull request</TimelineComponent.Body>
            </TimelineComponent.Item>
            <TimelineComponent.Item>
                <TimelineComponent.Badge>
                    <BranchRegular aria-hidden="true" />
                </TimelineComponent.Badge>
                <TimelineComponent.Body>Pushed two commits</TimelineComponent.Body>
            </TimelineComponent.Item>
        </TimelineComponent>
        <TimelineComponent clipSidebar>
            <TimelineComponent.Item>
                <TimelineComponent.Badge>
                    <BranchForkRegular aria-hidden="true" />
                </TimelineComponent.Badge>
                <TimelineComponent.Body>Opened this pull request</TimelineComponent.Body>
            </TimelineComponent.Item>
            <TimelineComponent.Item>
                <TimelineComponent.Badge>
                    <BranchRegular aria-hidden="true" />
                </TimelineComponent.Badge>
                <TimelineComponent.Body>Pushed two commits</TimelineComponent.Body>
            </TimelineComponent.Item>
        </TimelineComponent>
    </Stack>
);

const clipCode = `<Stack gap="spacious">
    <Timeline>
        <Timeline.Item>
            <Timeline.Badge>
                <BranchForkRegular aria-hidden="true" />
            </Timeline.Badge>
            <Timeline.Body>Opened this pull request</Timeline.Body>
        </Timeline.Item>
        <Timeline.Item>
            <Timeline.Badge>
                <BranchRegular aria-hidden="true" />
            </Timeline.Badge>
            <Timeline.Body>Pushed two commits</Timeline.Body>
        </Timeline.Item>
    </Timeline>
    <Timeline clipSidebar>
        <Timeline.Item>
            <Timeline.Badge>
                <BranchForkRegular aria-hidden="true" />
            </Timeline.Badge>
            <Timeline.Body>Opened this pull request</Timeline.Body>
        </Timeline.Item>
        <Timeline.Item>
            <Timeline.Badge>
                <BranchRegular aria-hidden="true" />
            </Timeline.Badge>
            <Timeline.Body>Pushed two commits</Timeline.Body>
        </Timeline.Item>
    </Timeline>
</Stack>`;

// A line across the rail, cutting one run of events off from the next. It is a list item like the
// others but stands for nothing itself, so it is left out of the list a screen reader is read
const breakPreview = (
    <Stack className={classes.column}>
        <TimelineComponent>
            <TimelineComponent.Item>
                <TimelineComponent.Badge variant="done">
                    <CheckmarkCircleRegular aria-hidden="true" />
                </TimelineComponent.Badge>
                <TimelineComponent.Body>Merged the pull request</TimelineComponent.Body>
            </TimelineComponent.Item>
            <TimelineComponent.Break />
            <TimelineComponent.Item>
                <TimelineComponent.Badge>
                    <BranchRegular aria-hidden="true" />
                </TimelineComponent.Badge>
                <TimelineComponent.Body>Reopened the branch</TimelineComponent.Body>
            </TimelineComponent.Item>
        </TimelineComponent>
    </Stack>
);

const breakCode = `<Timeline>
    <Timeline.Item>
        <Timeline.Badge variant="done">
            <CheckmarkCircleRegular aria-hidden="true" />
        </Timeline.Badge>
        <Timeline.Body>Merged the pull request</Timeline.Body>
    </Timeline.Item>
    <Timeline.Break />
    <Timeline.Item>
        <Timeline.Badge>
            <BranchRegular aria-hidden="true" />
        </Timeline.Badge>
        <Timeline.Body>Reopened the branch</Timeline.Body>
    </Timeline.Item>
</Timeline>`;

// Every fill a badge comes in, each named for the kind of thing that happened rather than for the
// colour it is drawn in. A badge given none of them is drawn back against the page, which is what
// an event carrying no weight of its own is left as
const variantsPreview = (
    <Stack className={classes.column}>
        <TimelineComponent>
            {variants.map((variant) => (
                <TimelineComponent.Item key={variant}>
                    <TimelineComponent.Badge variant={variant}>
                        <CommentRegular aria-hidden="true" />
                    </TimelineComponent.Badge>
                    <TimelineComponent.Body>{variant}</TimelineComponent.Body>
                </TimelineComponent.Item>
            ))}
        </TimelineComponent>
    </Stack>
);

const variantsCode = `<Timeline>
    {variants.map((variant) => (
        <Timeline.Item key={variant}>
            <Timeline.Badge variant={variant}>
                <CommentRegular aria-hidden="true" />
            </Timeline.Badge>
            <Timeline.Body>{variant}</Timeline.Body>
        </Timeline.Item>
    ))}
</Timeline>`;

// What can be done about an event, standing at the end of the item it belongs to. They are held to
// the height of the badge rather than the whole item, so they are read against the event they act
// on rather than floating in the middle of it
const actionsPreview = (
    <Stack className={classes.column}>
        <TimelineComponent>
            <TimelineComponent.Item>
                <TimelineComponent.Badge variant="done">
                    <CheckmarkCircleRegular aria-hidden="true" />
                </TimelineComponent.Badge>
                <TimelineComponent.Body>Merged the pull request</TimelineComponent.Body>
                <TimelineComponent.Actions>
                    <Button size="small">View details</Button>
                    <Button size="small">Revert</Button>
                </TimelineComponent.Actions>
            </TimelineComponent.Item>
            <TimelineComponent.Item>
                <TimelineComponent.Badge variant="danger">
                    <DismissCircleRegular aria-hidden="true" />
                </TimelineComponent.Badge>
                <TimelineComponent.Body>Two checks failed</TimelineComponent.Body>
                <TimelineComponent.Actions>
                    <Button size="small">Compare</Button>
                </TimelineComponent.Actions>
            </TimelineComponent.Item>
        </TimelineComponent>
    </Stack>
);

const actionsCode = `<Timeline>
    <Timeline.Item>
        <Timeline.Badge variant="done">
            <CheckmarkCircleRegular aria-hidden="true" />
        </Timeline.Badge>
        <Timeline.Body>Merged the pull request</Timeline.Body>
        <Timeline.Actions>
            <Button size="small">View details</Button>
            <Button size="small">Revert</Button>
        </Timeline.Actions>
    </Timeline.Item>
    <Timeline.Item>
        <Timeline.Badge variant="danger">
            <DismissCircleRegular aria-hidden="true" />
        </Timeline.Badge>
        <Timeline.Body>Two checks failed</Timeline.Body>
        <Timeline.Actions>
            <Button size="small">Compare</Button>
        </Timeline.Actions>
    </Timeline.Item>
</Timeline>`;

// Who the event belongs to, standing out in the gutter beside the rail rather than within the
// item. It lines up with whatever else on the page is set against a name, and is centred against
// the badge it belongs to.
//
// The column it stands in has to leave the room for it, since the avatar is drawn outside the
// timeline's own bounds rather than within them
const avatarPreview = (
    <Stack className={classes.gutter}>
        <TimelineComponent>
            <TimelineComponent.Item>
                <TimelineComponent.Avatar>
                    <Avatar size={40}>
                        <Avatar.Image src={source} alt="Mona Lisa Octocat" />
                    </Avatar>
                </TimelineComponent.Avatar>
                <TimelineComponent.Badge variant="success">
                    <CheckmarkCircleRegular aria-hidden="true" />
                </TimelineComponent.Badge>
                <TimelineComponent.Body>
                    <Link href="#" muted>
                        monalisa
                    </Link>{" "}
                    approved these changes
                </TimelineComponent.Body>
            </TimelineComponent.Item>
        </TimelineComponent>
    </Stack>
);

const avatarCode = `<Timeline>
    <Timeline.Item>
        <Timeline.Avatar>
            <Avatar size={40}>
                <Avatar.Image src={source} alt="Mona Lisa Octocat" />
            </Avatar>
        </Timeline.Avatar>
        <Timeline.Badge variant="success">
            <CheckmarkCircleRegular aria-hidden="true" />
        </Timeline.Badge>
        <Timeline.Body>
            <Link href="#" muted>
                monalisa
            </Link>{" "}
            approved these changes
        </Timeline.Body>
    </Timeline.Item>
</Timeline>`;

// A run of small events drawn tighter, so that a stretch of commits reads as one block rather than
// as a list of things each worth stopping at. The badge comes down to the height of a line of text
// and gives up its fill, which leaves the rail running behind a mark rather than through a circle
const condensedPreview = (
    <Stack className={classes.column}>
        <TimelineComponent>
            {["Update the README", "Fix the build", "Bump the dependencies"].map((message) => (
                <TimelineComponent.Item key={message} condensed>
                    <TimelineComponent.Badge>
                        <BranchRegular aria-hidden="true" />
                    </TimelineComponent.Badge>
                    <TimelineComponent.Body>
                        <Link href="#" muted>
                            {message}
                        </Link>
                    </TimelineComponent.Body>
                </TimelineComponent.Item>
            ))}
        </TimelineComponent>
    </Stack>
);

const condensedCode = `<Timeline>
    {["Update the README", "Fix the build", "Bump the dependencies"].map((message) => (
        <Timeline.Item key={message} condensed>
            <Timeline.Badge>
                <BranchRegular aria-hidden="true" />
            </Timeline.Badge>
            <Timeline.Body>
                <Link href="#" muted>
                    {message}
                </Link>
            </Timeline.Body>
        </Timeline.Item>
    ))}
</Timeline>`;

// The same item in a column with little room across it. The actions drop below what they belong to
// and lead from the start, and the badge keeps the left column so the rail stays where it is.
//
// It is read off the room the timeline is given rather than off the width of the window, so a
// timeline standing in a side panel lays itself out this way on a wide screen
const narrowPreview = (
    <Stack className={classes.narrow}>
        <TimelineComponent>
            <TimelineComponent.Item>
                <TimelineComponent.Badge variant="done">
                    <CheckmarkCircleRegular aria-hidden="true" />
                </TimelineComponent.Badge>
                <TimelineComponent.Body>Merged the pull request</TimelineComponent.Body>
                <TimelineComponent.Actions>
                    <Button size="small">View details</Button>
                    <Button size="small">Revert</Button>
                </TimelineComponent.Actions>
            </TimelineComponent.Item>
        </TimelineComponent>
    </Stack>
);

const narrowCode = `<Timeline>
    <Timeline.Item>
        <Timeline.Badge variant="done">
            <CheckmarkCircleRegular aria-hidden="true" />
        </Timeline.Badge>
        <Timeline.Body>Merged the pull request</Timeline.Body>
        <Timeline.Actions>
            <Button size="small">View details</Button>
            <Button size="small">Revert</Button>
        </Timeline.Actions>
    </Timeline.Item>
</Timeline>`;

// The timeline as it is reached for, drawn and written out one above the other. The plainest one
// comes first, then what the rail does at its ends and in the middle, then what an item can carry,
// and last the two ways the run itself is drawn tighter
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "A run of events, each marked with a badge standing over the rail and saying what happened beside it. The rail is drawn by each item rather than by the list, so one event runs straight into the next however many there are, and the badge cuts through it with its own border rather than the line being broken for it. The mark inside a badge is a picture of what the words beside it already say, so it is kept from a screen reader rather than read out twice.",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Trimming the rail",
        description:
            "The rail brought back to the badges at either end. Left alone it runs the whole height of the first and last items, which reads as a timeline carrying on past what it holds — right for a run of events with more above and below it, wrong for one that is the whole story. Either end can be trimmed on its own, and true trims both.",
        preview: clipPreview,
        code: clipCode,
    },
    {
        name: "A break across it",
        description:
            "A line cutting one run of events off from the next, for a gap in time or a change of subject that a plain run would read straight through. It is a list item like the others but stands for nothing itself, so it is left out of the list a screen reader is read: what it says is said by the space it makes rather than by anything it holds.",
        preview: breakPreview,
        code: breakCode,
    },
    {
        name: "Badge variants",
        description:
            "Every fill a badge comes in, each named for the kind of thing that happened rather than for the colour it is drawn in. A badge given none of them is drawn back against the page, which is what an event carrying no weight of its own is left as, and the fill is the only thing that changes — the mark inside it is set against whatever it is drawn on.",
        setup: variantsSetup,
        preview: variantsPreview,
        code: variantsCode,
    },
    {
        name: "Actions at the end of an item",
        description:
            "What can be done about an event, standing at the end of the item it belongs to. They are held to the height of the badge rather than of the whole item, so they are read against the event they act on rather than floating in the middle of it.",
        preview: actionsPreview,
        code: actionsCode,
    },
    {
        name: "An avatar in the gutter",
        description:
            "Who the event belongs to, standing out beside the rail rather than within the item, so it lines up with whatever else on the page is set against a name. It is drawn outside the timeline's own bounds, so whatever the timeline stands in has to leave the room for it.",
        setup: sourceSetup,
        preview: avatarPreview,
        code: avatarCode,
    },
    {
        name: "A run of small events",
        description:
            "Drawn tighter, so that a stretch of commits reads as one block rather than as a list of things each worth stopping at. The badge comes down to the height of a line of text and gives up its fill, which leaves the rail running behind a mark rather than through a circle, and each item gives up the room below it — except the last, which takes it back since there is nothing beneath to close the gap.",
        preview: condensedPreview,
        code: condensedCode,
    },
    {
        name: "When there is little room across",
        description:
            "The actions drop below what they belong to and lead from the start, and the badge keeps the left column so the rail stays where it is. It is read off the room the timeline is given rather than off the width of the window, so a timeline standing in a side panel lays itself out this way on a wide screen — which is the only way it could read the same in both places.",
        preview: narrowPreview,
        code: narrowCode,
    },
];

// Which ends of the rail are trimmed back to the first and last badge
const clipSidebar = 'boolean | "start" | "end" | "both"';

// Every fill a badge comes in
const badgeVariant =
    '"accent" | "success" | "attention" | "severe" | "danger" | "done" | "open" | "closed" | "sponsors"';

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the timeline takes, and then the parts an event is drawn from.
//
// What the rail does comes first, since that is the whole of what the list is told, and what an
// item carries follows in the order it is written: the picture beside it, the badge over the rail,
// the words, and what can be done about them
const groups: ComponentPropGroup[] = [
    {
        name: "Timeline",
        props: [
            {
                name: "clipSidebar",
                type: clipSidebar,
                default: "false",
                description:
                    "Which ends of the rail are trimmed back to the first and last badge, so the timeline does not appear to run on past what it holds. True trims both, and either end can be named on its own",
            },
            styling,
            {
                name: "...ol props",
                type: 'Omit<React.ComponentPropsWithoutRef<"ol">, "role">',
                description:
                    "The timeline is an ordered list underneath, so it takes what one takes. The role is the list's own: it is stated rather than left to the element, because Safari takes the list semantics away from a list drawn without markers. It reads the room it is given rather than the width of the window, so it lays itself out the same in a side panel as it does across a page",
            },
        ],
    },
    {
        name: "Timeline.Item",
        props: [
            {
                name: "condensed",
                type: "boolean",
                default: "false",
                description:
                    "Draws the item tighter, for a run of small events such as commits. The badge comes down to the height of a line of text and gives up its fill, and the item gives up the room below it so a run of them reads as one block — except the last of the run, which takes it back since there is nothing beneath to close the gap",
            },
            styling,
            {
                name: "...li props",
                type: 'React.ComponentPropsWithoutRef<"li">',
                description:
                    "It is a list item underneath, so it takes what one takes. Each item draws the length of rail beside itself rather than the timeline drawing one behind them all, so one event runs straight into the next however many there are",
            },
        ],
    },
    {
        name: "Timeline.Badge",
        props: [
            {
                name: "variant",
                type: badgeVariant,
                description:
                    "How the badge is filled, named for the kind of thing that happened rather than for the colour it is drawn in. Left out, it is drawn back against the page, which is what an event carrying no weight of its own is left as",
            },
            styling,
            {
                name: "...div props",
                type: 'React.ComponentPropsWithoutRef<"div">',
                description:
                    "The circle standing over the rail. It cuts the rail with its own border rather than the line being broken for it, and whatever it holds is a picture of what the words beside it already say — so a mark put in it is hidden from a screen reader rather than read out twice",
            },
        ],
    },
    {
        name: "Timeline.Body",
        props: [
            styling,
            {
                name: "...div props",
                type: 'React.ComponentPropsWithoutRef<"div">',
                description:
                    "What happened, set beside the badge. Its first line is lined up with the middle of the badge, so an event that runs to several lines still reads as beginning where its mark does",
            },
        ],
    },
    {
        name: "Timeline.Actions",
        props: [
            styling,
            {
                name: "...div props",
                type: 'React.ComponentPropsWithoutRef<"div">',
                description:
                    "What can be done about the event, standing at the end of the item. They are held to the height of the badge rather than of the whole item, and drop below the body where there is little room across",
            },
        ],
    },
    {
        name: "Timeline.Avatar",
        props: [
            styling,
            {
                name: "...div props",
                type: 'React.ComponentPropsWithoutRef<"div">',
                description:
                    "Who the event belongs to, standing out in the gutter beside the rail and centred against the badge. It is drawn outside the timeline's own bounds, so whatever the timeline stands in has to leave the room for it",
            },
        ],
    },
    {
        name: "Timeline.Break",
        props: [
            styling,
            {
                name: "...li props",
                type: 'Omit<React.ComponentPropsWithoutRef<"li">, "role">',
                description:
                    "A line across the rail, cutting one run of events off from the next. It is a list item like the others but stands for nothing itself, so it is left out of the list a screen reader is read — which is why the role is the break's own rather than the caller's",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the timeline is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const Timeline = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Timeline
            </Heading>
            <Text as="p" size="large">
                A run of events in the order they happened, strung along a rail. Each of them is
                marked with a badge standing over the line and says what happened beside it, and can
                carry who it belongs to and what can be done about it. It is for a history rather
                than a plan — what has been done to a pull request, what a job did as it ran — which
                is what sets it apart from a flow of steps: nothing here is still to come, and
                nothing is being worked on. The rail is drawn by each event rather than by the list,
                so one runs straight into the next however many there are, and it can be trimmed
                back to the first and last of them where the timeline is the whole story rather than
                a stretch of one. It reads the room it is given rather than the width of the window,
                so it lays itself out the same in a side panel as it does across a page.
            </Text>
        </Stack>
        <ComponentExamples component="Timeline" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Timeline;
