import * as React from "react";
import { ImageRegular } from "@gamecrafters/base-ui-icons";
import {
    FileUpload as FileUploadComponent,
    Heading,
    Stack,
    Text,
} from "@gamecrafters/base-ui/react";
import type { FileUploadRejection, FileUploadRejectionReason } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // The zone fills whatever holds it, so the examples give it something to fill. Left to run the
    // width of the page it would be read as a band across the card rather than as a control
    container: "w-[var(--overlay-width-medium)] max-w-full",
};

// What a reader is told about a file that was turned away, a line to each of the three reasons a
// control has for turning one away. It is written once and read out into the example, since the
// control reports the reason rather than the sentence
const reasons: Record<FileUploadRejectionReason, string> = {
    type: "is not a type this control takes",
    size: "is larger than the 1 MB this control takes",
    count: "was left out, since only one file is taken at a time",
};

// What the examples have to have in hand before they can be drawn. Each is written once and reached
// for by the examples that need it
const containerSetup = `const container = "w-[var(--overlay-width-medium)] max-w-full";`;

const reasonsSetup = `const reasons = {
    type: "is not a type this control takes",
    size: "is larger than the 1 MB this control takes",
    count: "was left out, since only one file is taken at a time",
};`;

// The plainest control there is: a mark, what to do with it, and a line saying what it takes.
// Nothing is said with a prop, so it comes to the middle of the scale and takes one file of any
// type.
//
// The three parts inside the zone are handed over rather than named with props, so a caller who
// wants none of them writes none of them, and what is written is what is drawn.
//
// The page and the component it is about are both called FileUpload, so the component is brought in
// under a name saying which of the two it is. The listing beneath says FileUpload, as an
// application importing it would
const defaultPreview = (
    <div className={classes.container}>
        <FileUploadComponent>
            <FileUploadComponent.Icon />
            <FileUploadComponent.Label>
                Drag and drop files here, or browse
            </FileUploadComponent.Label>
            <FileUploadComponent.Description>
                Any file type, up to 25 MB each
            </FileUploadComponent.Description>
        </FileUploadComponent>
    </div>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<div className={container}>
    <FileUpload>
        <FileUpload.Icon />
        <FileUpload.Label>Drag and drop files here, or browse</FileUpload.Label>
        <FileUpload.Description>Any file type, up to 25 MB each</FileUpload.Description>
    </FileUpload>
</div>`;

// Which step of the scale the control stands at. The three are drawn together rather than one to an
// example, since a size is read against the others rather than on its own, and each is named above
// the control it drew. The name stands outside the zone rather than in place of its label, since
// the label is what the control is called and a control named "small" is a control with no name
const sizesPreview = (
    <Stack gap="normal" className={classes.container}>
        <Stack gap="condensed">
            <Text size="small">small</Text>
            <FileUploadComponent size="small">
                <FileUploadComponent.Icon />
                <FileUploadComponent.Label>
                    Drag and drop files here, or browse
                </FileUploadComponent.Label>
                <FileUploadComponent.Description>
                    Any file type, up to 25 MB each
                </FileUploadComponent.Description>
            </FileUploadComponent>
        </Stack>
        <Stack gap="condensed">
            <Text size="small">medium</Text>
            <FileUploadComponent size="medium">
                <FileUploadComponent.Icon />
                <FileUploadComponent.Label>
                    Drag and drop files here, or browse
                </FileUploadComponent.Label>
                <FileUploadComponent.Description>
                    Any file type, up to 25 MB each
                </FileUploadComponent.Description>
            </FileUploadComponent>
        </Stack>
        <Stack gap="condensed">
            <Text size="small">large</Text>
            <FileUploadComponent size="large">
                <FileUploadComponent.Icon />
                <FileUploadComponent.Label>
                    Drag and drop files here, or browse
                </FileUploadComponent.Label>
                <FileUploadComponent.Description>
                    Any file type, up to 25 MB each
                </FileUploadComponent.Description>
            </FileUploadComponent>
        </Stack>
    </Stack>
);

// The stacks are part of what is being shown rather than the page's own furniture, since what the
// example is about is the three read one under the other with their names beside them
const sizesCode = `<Stack gap="normal" className={container}>
    <Stack gap="condensed">
        <Text size="small">small</Text>
        <FileUpload size="small">
            <FileUpload.Icon />
            <FileUpload.Label>Drag and drop files here, or browse</FileUpload.Label>
            <FileUpload.Description>Any file type, up to 25 MB each</FileUpload.Description>
        </FileUpload>
    </Stack>
    <Stack gap="condensed">
        <Text size="small">medium</Text>
        <FileUpload size="medium">
            <FileUpload.Icon />
            <FileUpload.Label>Drag and drop files here, or browse</FileUpload.Label>
            <FileUpload.Description>Any file type, up to 25 MB each</FileUpload.Description>
        </FileUpload>
    </Stack>
    <Stack gap="condensed">
        <Text size="small">large</Text>
        <FileUpload size="large">
            <FileUpload.Icon />
            <FileUpload.Label>Drag and drop files here, or browse</FileUpload.Label>
            <FileUpload.Description>Any file type, up to 25 MB each</FileUpload.Description>
        </FileUpload>
    </Stack>
</Stack>`;

// Which types the control takes. The attribute settles what the picker offers and says nothing at
// all about what is dropped, so the same types are applied to a drop by hand, and a reader who lets
// go of the wrong file is told rather than left wondering why nothing happened.
//
// The mark over the label is swapped for one saying what is wanted, since a control that takes one
// kind of file can say so before it is read
const withAcceptPreview = (
    <div className={classes.container}>
        <FileUploadComponent accept="image/*" multiple>
            <FileUploadComponent.Icon icon={ImageRegular} />
            <FileUploadComponent.Label>
                Drag and drop images here, or browse
            </FileUploadComponent.Label>
            <FileUploadComponent.Description>PNG, JPG or GIF</FileUploadComponent.Description>
        </FileUploadComponent>
    </div>
);

const withAcceptCode = `<div className={container}>
    <FileUpload accept="image/*" multiple>
        <FileUpload.Icon icon={ImageRegular} />
        <FileUpload.Label>Drag and drop images here, or browse</FileUpload.Label>
        <FileUpload.Description>PNG, JPG or GIF</FileUpload.Description>
    </FileUpload>
</div>`;

// A control that takes one file at a time, which is what it does unless it is told otherwise. The
// first file is kept and the rest are turned away rather than dropped quietly, so a reader who let
// go of a folder is told why only one of it arrived
const singleFilePreview = (
    <div className={classes.container}>
        <FileUploadComponent accept=".pdf">
            <FileUploadComponent.Icon />
            <FileUploadComponent.Label>
                Drag and drop a document here, or browse
            </FileUploadComponent.Label>
            <FileUploadComponent.Description>One PDF at a time</FileUploadComponent.Description>
        </FileUploadComponent>
    </div>
);

const singleFileCode = `<div className={container}>
    <FileUpload accept=".pdf">
        <FileUpload.Icon />
        <FileUpload.Label>Drag and drop a document here, or browse</FileUpload.Label>
        <FileUpload.Description>One PDF at a time</FileUpload.Description>
    </FileUpload>
</div>`;

// The files that arrived, each at a different point along the way. The list stands below the zone
// rather than inside it, since the zone is a label and anything pressed within it opens the picker.
//
// A file still on its way is marked by the bar under its name and one that has arrived or gone
// wrong by a mark at the end of the row, so no row is saying the same thing twice
const withFileListPreview = (
    <div className={classes.container}>
        <FileUploadComponent multiple>
            <FileUploadComponent.Icon />
            <FileUploadComponent.Label>
                Drag and drop files here, or browse
            </FileUploadComponent.Label>
            <FileUploadComponent.Description>
                Any file type, up to 25 MB each
            </FileUploadComponent.Description>
            <FileUploadComponent.List>
                <FileUploadComponent.Item
                    name="waiting-its-turn.zip"
                    fileSize={4_194_304}
                    onRemove={() => {}}
                />
                <FileUploadComponent.Item
                    name="on-its-way.mp4"
                    fileSize={18_874_368}
                    status="uploading"
                    progress={62}
                    onRemove={() => {}}
                />
                <FileUploadComponent.Item
                    name="arrived.pdf"
                    fileSize={248_320}
                    status="success"
                    onRemove={() => {}}
                />
                <FileUploadComponent.Item
                    name="went-wrong.psd"
                    fileSize={73_400_320}
                    status="error"
                    description="Larger than the 25 MB this control takes"
                    onRemove={() => {}}
                />
            </FileUploadComponent.List>
        </FileUploadComponent>
    </div>
);

const withFileListCode = `<div className={container}>
    <FileUpload multiple>
        <FileUpload.Icon />
        <FileUpload.Label>Drag and drop files here, or browse</FileUpload.Label>
        <FileUpload.Description>Any file type, up to 25 MB each</FileUpload.Description>
        <FileUpload.List>
            <FileUpload.Item name="waiting-its-turn.zip" fileSize={4_194_304} onRemove={() => {}} />
            <FileUpload.Item
                name="on-its-way.mp4"
                fileSize={18_874_368}
                status="uploading"
                progress={62}
                onRemove={() => {}}
            />
            <FileUpload.Item
                name="arrived.pdf"
                fileSize={248_320}
                status="success"
                onRemove={() => {}}
            />
            <FileUpload.Item
                name="went-wrong.psd"
                fileSize={73_400_320}
                status="error"
                description="Larger than the 25 MB this control takes"
                onRemove={() => {}}
            />
        </FileUpload.List>
    </FileUpload>
</div>`;

// The control drawn as a field that has been answered wrongly, and as one that has been answered.
// The two are drawn together, since what either of them says is said by the colour of the border
// against the other. The border is what carries it, so the reason is left to the line under the
// label to say in words
const validationStatusPreview = (
    <Stack gap="normal" className={classes.container}>
        <FileUploadComponent validationStatus="error">
            <FileUploadComponent.Icon />
            <FileUploadComponent.Label>
                Drag and drop a file here, or browse
            </FileUploadComponent.Label>
            <FileUploadComponent.Description>
                A file is needed before this form can be sent
            </FileUploadComponent.Description>
        </FileUploadComponent>
        <FileUploadComponent validationStatus="success">
            <FileUploadComponent.Icon />
            <FileUploadComponent.Label>
                Drag and drop a file here, or browse
            </FileUploadComponent.Label>
            <FileUploadComponent.Description>
                Your file has been accepted
            </FileUploadComponent.Description>
        </FileUploadComponent>
    </Stack>
);

const validationStatusCode = `<Stack gap="normal" className={container}>
    <FileUpload validationStatus="error">
        <FileUpload.Icon />
        <FileUpload.Label>Drag and drop a file here, or browse</FileUpload.Label>
        <FileUpload.Description>
            A file is needed before this form can be sent
        </FileUpload.Description>
    </FileUpload>
    <FileUpload validationStatus="success">
        <FileUpload.Icon />
        <FileUpload.Label>Drag and drop a file here, or browse</FileUpload.Label>
        <FileUpload.Description>Your file has been accepted</FileUpload.Description>
    </FileUpload>
</Stack>`;

// The control with the answer taken out of it: the picker will not open, a drop lands on nothing
// and the zone no longer answers the pointer. What the label says is written for it, since a
// control that cannot be used should say why rather than go on asking
const disabledPreview = (
    <div className={classes.container}>
        <FileUploadComponent disabled>
            <FileUploadComponent.Icon />
            <FileUploadComponent.Label>Uploading is turned off</FileUploadComponent.Label>
            <FileUploadComponent.Description>
                Ask an administrator to turn it back on
            </FileUploadComponent.Description>
        </FileUploadComponent>
    </div>
);

const disabledCode = `<div className={container}>
    <FileUpload disabled>
        <FileUpload.Icon />
        <FileUpload.Label>Uploading is turned off</FileUpload.Label>
        <FileUpload.Description>Ask an administrator to turn it back on</FileUpload.Description>
    </FileUpload>
</div>`;

// The files kept by the caller rather than by the control. The control reports what it took and
// leaves it there, since what happens to a file after it arrives — where it is sent, how far it has
// got, whether it can be taken back out — is the application's rather than the control's.
//
// What the list is drawn from is the caller's array, so taking a row out is a matter of dropping
// the file from it rather than of telling the control anything
const HoldingTheFilesPreview = () => {
    const [files, setFiles] = React.useState<File[]>([]);

    const remove = (name: string) => {
        setFiles((current) => current.filter((file) => file.name !== name));
    };

    return (
        <div className={classes.container}>
            <FileUploadComponent
                multiple
                onSelect={(selected) => setFiles((current) => [...current, ...selected])}
            >
                <FileUploadComponent.Icon />
                <FileUploadComponent.Label>
                    Drag and drop files here, or browse
                </FileUploadComponent.Label>
                <FileUploadComponent.Description>
                    {files.length === 0
                        ? "Nothing chosen yet"
                        : `${files.length} ${files.length === 1 ? "file" : "files"} chosen`}
                </FileUploadComponent.Description>
                <FileUploadComponent.List>
                    {files.map((file) => (
                        <FileUploadComponent.Item
                            key={file.name}
                            name={file.name}
                            fileSize={file.size}
                            status="success"
                            onRemove={() => remove(file.name)}
                        />
                    ))}
                </FileUploadComponent.List>
            </FileUploadComponent>
        </div>
    );
};

const holdingTheFilesSetup = `${containerSetup}

const [files, setFiles] = React.useState([]);

const remove = (name) => {
    setFiles((current) => current.filter((file) => file.name !== name));
};`;

const holdingTheFilesCode = `<div className={container}>
    <FileUpload multiple onSelect={(selected) => setFiles((current) => [...current, ...selected])}>
        <FileUpload.Icon />
        <FileUpload.Label>Drag and drop files here, or browse</FileUpload.Label>
        <FileUpload.Description>
            {files.length === 0
                ? "Nothing chosen yet"
                : \`\${files.length} \${files.length === 1 ? "file" : "files"} chosen\`}
        </FileUpload.Description>
        <FileUpload.List>
            {files.map((file) => (
                <FileUpload.Item
                    key={file.name}
                    name={file.name}
                    fileSize={file.size}
                    status="success"
                    onRemove={() => remove(file.name)}
                />
            ))}
        </FileUpload.List>
    </FileUpload>
</div>`;

// The files the control would not take, and why. They are reported apart from the ones it took, so
// neither callback is ever called with nothing, and each rejection carries the file itself along
// with the reason, so what is said about it can name it.
//
// The reason arrives as one of three words rather than as a sentence, since what a reader should be
// told about a file that was turned away depends on what the control was asked to take
const TurningFilesAwayPreview = () => {
    const [rejections, setRejections] = React.useState<FileUploadRejection[]>([]);

    return (
        <Stack gap="condensed" className={classes.container}>
            <FileUploadComponent
                accept="image/*"
                maxSize={1_048_576}
                multiple
                onReject={setRejections}
            >
                <FileUploadComponent.Icon icon={ImageRegular} />
                <FileUploadComponent.Label>
                    Drag and drop images here, or browse
                </FileUploadComponent.Label>
                <FileUploadComponent.Description>
                    PNG, JPG or GIF, up to 1 MB each
                </FileUploadComponent.Description>
            </FileUploadComponent>
            {rejections.map(({ file, reason }) => (
                <Text key={file.name} size="small">
                    {file.name} {reasons[reason]}
                </Text>
            ))}
        </Stack>
    );
};

const turningFilesAwaySetup = `${containerSetup}

${reasonsSetup}

const [rejections, setRejections] = React.useState([]);`;

const turningFilesAwayCode = `<Stack gap="condensed" className={container}>
    <FileUpload accept="image/*" maxSize={1_048_576} multiple onReject={setRejections}>
        <FileUpload.Icon icon={ImageRegular} />
        <FileUpload.Label>Drag and drop images here, or browse</FileUpload.Label>
        <FileUpload.Description>PNG, JPG or GIF, up to 1 MB each</FileUpload.Description>
    </FileUpload>
    {rejections.map(({ file, reason }) => (
        <Text key={file.name} size="small">
            {file.name} {reasons[reason]}
        </Text>
    ))}
</Stack>`;

// The control as it is reached for, drawn and written out one above the other. The plainest one
// comes first, then the scale it is drawn on, then what it will and will not take, then what it
// shows of what arrived, then how it is drawn once it has been answered, and last what the caller
// is left holding
const examples: ComponentExample[] = [
    {
        name: "Default",
        setup: containerSetup,
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Sizes",
        description:
            "Which step of the control scale the zone stands at: how much room it keeps, and how big the mark and the type inside it are. The size is written on the whole control rather than on the zone, so the list of files below it is sized by it too.",
        setup: containerSetup,
        preview: sizesPreview,
        code: sizesCode,
    },
    {
        name: "Taking one type only",
        description:
            "Which types the control takes. The attribute settles what the picker offers and says nothing at all about what is dropped, so the same types are applied to a drop by hand and a reader who lets go of the wrong file is told rather than left wondering why nothing happened.",
        setup: containerSetup,
        preview: withAcceptPreview,
        code: withAcceptCode,
    },
    {
        name: "Taking one file at a time",
        description:
            "What a control does unless it is told to take more: the first file is kept and the rest are turned away rather than dropped quietly, so a reader who let go of a folder is told why only one of it arrived.",
        setup: containerSetup,
        preview: singleFilePreview,
        code: singleFileCode,
    },
    {
        name: "With a list of files",
        description:
            "The files that arrived, each at a different point along the way. The list stands below the zone rather than inside it, since the zone is a label and anything pressed within it would otherwise open the picker. A file still on its way is marked by the bar under its name and one that has arrived or gone wrong by a mark at the end of the row, so no row says the same thing twice.",
        setup: containerSetup,
        preview: withFileListPreview,
        code: withFileListCode,
    },
    {
        name: "Validation status",
        description:
            "The control drawn as a field that has been answered wrongly, and as one that has been answered. The border is what carries it, and colour alone is not read by everyone, so the reason is left to the line under the label to say in words.",
        setup: containerSetup,
        preview: validationStatusPreview,
        code: validationStatusCode,
    },
    {
        name: "Disabled",
        description:
            "The control with the answer taken out of it: the picker will not open, a drop lands on nothing and the zone no longer answers the pointer. What the label says is written for it, since a control that cannot be used should say why rather than go on asking.",
        setup: containerSetup,
        preview: disabledPreview,
        code: disabledCode,
    },
    {
        name: "Holding the files",
        description:
            "The files kept by the caller rather than by the control. What happens to a file after it arrives — where it is sent, how far it has got, whether it can be taken back out — is the application's rather than the control's, so the control reports what it took and leaves it there. Taking a row out is a matter of dropping the file from the array the list is drawn from.",
        setup: holdingTheFilesSetup,
        preview: <HoldingTheFilesPreview />,
        code: holdingTheFilesCode,
    },
    {
        name: "Turning files away",
        description:
            "The files the control would not take, and why. They are reported apart from the ones it took, so neither callback is ever called with nothing, and each rejection carries the file itself along with the reason, so what is said about it can name it. The reason arrives as one of three words rather than as a sentence, since what a reader should be told depends on what the control was asked to take.",
        setup: turningFilesAwaySetup,
        preview: <TurningFilesAwayPreview />,
        code: turningFilesAwayCode,
    },
];

// Which step of the control scale the zone stands at. It stands as the values themselves rather
// than as the name they are collected under, since one of them is what a caller actually hands over
const size = '"small" | "medium" | "large"';

// How the control is drawn once it has been answered
const validationStatus = '"error" | "success"';

// How far a file in the list has got
const itemStatus = '"pending" | "uploading" | "success" | "error"';

// Where the files came from, so a caller can tell a drop apart from a trip through the picker
const source = "FileUploadSource";

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the control and its parts take, under the one that takes it. The scale comes first,
// then what the control will take, then how it is drawn, then what it reports.
//
// None of the parts is drawn as anything but the element it has to be — the zone a label, the list
// a list, a file a row of it — so none of them takes an element to be drawn as
const groups: ComponentPropGroup[] = [
    {
        name: "FileUpload",
        props: [
            {
                name: "size",
                type: size,
                default: '"medium"',
                options: ["small", "medium", "large"],
                description:
                    "Which step of the control scale the zone stands at: how much room it keeps, and how big the mark and the type inside it are. It is written on the whole control rather than on the zone, so the list of files below it is sized by it too",
            },
            {
                name: "accept",
                type: "string",
                description:
                    "Which types the picker offers, written the way the attribute is: a suffix, a whole type, or a type and a subtype, separated by commas. The attribute says nothing about what is dropped, so the same types are applied to a drop as well, and anything else is turned away",
            },
            {
                name: "multiple",
                type: "boolean",
                default: "false",
                description:
                    "Takes more than one file at a time. A control left without it keeps the first file it is handed and turns the rest away rather than dropping them quietly",
            },
            {
                name: "maxSize",
                type: "number",
                description:
                    "The most a single file may weigh, in bytes. It is measured against each file on its own rather than against what arrived together, so a file over it is turned away and the rest are still taken",
            },
            {
                name: "validationStatus",
                type: validationStatus,
                options: ["error", "success"],
                description:
                    "Draws the zone as a field that has been answered wrongly, or as one that has been answered. The invalid one is read as invalid as well as drawn as it, so it is heard as well as seen",
            },
            {
                name: "disabled",
                type: "boolean",
                default: "false",
                description:
                    "Stops the control being used: the picker will not open, a drop lands on nothing and the zone no longer answers the pointer",
            },
            {
                name: "required",
                type: "boolean",
                default: "false",
                description:
                    "Makes a file needed before the form the control stands in can be sent",
            },
            {
                name: "name",
                type: "string",
                description:
                    "What the control is posted under. A dropped file is written into the control as well as reported, so a form posts one the same way it posts a picked one",
            },
            {
                name: "onSelect",
                type: `(files: File[], source: ${source}) => void`,
                description:
                    "Called with the files the control took, and with whether they were picked or dropped. Files it turned away go to onReject instead, so neither is ever called with nothing",
            },
            {
                name: "onReject",
                type: `(rejections: FileUploadRejection[], source: ${source}) => void`,
                description:
                    "Called with the files the control would not take, each carrying the file itself and one of type, size or count saying why",
            },
            styling,
        ],
    },
    {
        name: "FileUpload.Icon",
        props: [
            {
                name: "icon",
                type: "React.ElementType",
                default: "ArrowUploadRegular",
                description:
                    "The mark standing over the label. It is sized and coloured by the control rather than by what it arrived as, and unless it is named with an aria-label it says nothing the label has not, so it is kept out of the accessibility tree",
            },
            styling,
        ],
    },
    {
        name: "FileUpload.Label",
        props: [styling],
    },
    {
        name: "FileUpload.Description",
        props: [styling],
    },
    {
        name: "FileUpload.List",
        props: [styling],
    },
    {
        name: "FileUpload.Item",
        props: [
            {
                name: "name",
                type: "string",
                required: true,
                description:
                    "What the file is called. It is the one part of the row with no length of its own, so it is what gives when the row runs out of room",
            },
            {
                name: "fileSize",
                type: "number",
                description:
                    "What the file weighs in bytes, written out beside the name in the units a file system would report it in. Left out, nothing stands there",
            },
            {
                name: "status",
                type: itemStatus,
                default: '"pending"',
                options: ["pending", "uploading", "success", "error"],
                description:
                    "How far the file has got. One still on its way is marked by the bar under its name and one that has arrived or gone wrong by a mark at the end of the row, so no row says the same thing twice, and one that has not started says nothing at all",
            },
            {
                name: "progress",
                type: "number",
                description:
                    "How far the upload has got, from 0 to 100. It is drawn only while the file is on its way, and a file on its way without one is drawn as a bar that has not been told where it is",
            },
            {
                name: "description",
                type: "React.ReactNode",
                description:
                    "A line below the name: what went wrong, or anything else worth saying about the file. On a file that has gone wrong it is drawn in the colour errors are drawn in elsewhere",
            },
            {
                name: "icon",
                type: "React.ElementType",
                default: "DocumentRegular",
                description:
                    "The mark at the start of the row, for a list whose files are all of one kind and worth telling apart at a glance",
            },
            {
                name: "onRemove",
                type: "(event: React.MouseEvent<HTMLButtonElement>) => void",
                description:
                    "Draws a button that takes the file back out of the list, and is called when it is pressed. Left out, no button is drawn, which is what a list that is only reporting wants",
            },
            {
                name: "removeLabel",
                type: "string",
                default: '"Remove {name}"',
                description:
                    "What the button that takes the file out is called. Every row in a list carries one, so each is named for its own file rather than left as another Remove among several",
            },
            styling,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the control is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const FileUpload = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                FileUpload
            </Heading>
            <Text as="p" size="large">
                A place to drop files on, or to open a file picker from. The native control does the
                picking, the naming and the keyboard, and the zone drawn around it is what makes a
                drop land somewhere; what is dropped is written back into the control, so a form
                posts a dropped file the same way it posts a picked one. It takes one file of any
                type unless it is told otherwise, and the types it is told to take are applied to a
                drop as well as to the picker, which the attribute on its own says nothing about.
                What arrives is reported rather than kept, since where a file is sent and how far it
                has got are the application&apos;s to know, and the list below the zone is where the
                caller shows them.
            </Text>
        </Stack>
        <ComponentExamples component="FileUpload" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default FileUpload;
