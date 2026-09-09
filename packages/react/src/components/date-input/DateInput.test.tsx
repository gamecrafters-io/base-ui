import * as React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi, type Mock } from "vitest";
import "@testing-library/jest-dom/vitest";
import dayjs from "dayjs";
import { LocaleProvider } from "../../providers/locale";
import { FormControl } from "../form-control";
import { DateInput, useDateInput, useDateInputContext } from ".";
import type { CalendarRange } from "../calendar";
import type {
    DateInputElementProps,
    DateInputPropsForARange,
    DateInputPropsForOneDay,
} from "./DateInput.types";

// The mode settles what the rest of the props carry, so each of the two is rendered through a
// helper that already knows which of them it is
type SingleProps = Partial<
    Omit<DateInputElementProps, keyof DateInputPropsForOneDay> & DateInputPropsForOneDay
>;

type RangeProps = Partial<
    Omit<DateInputElementProps, keyof DateInputPropsForARange> & DateInputPropsForARange
>;

const parts = (
    <>
        <DateInput.Label>Starts on</DateInput.Label>
        <DateInput.Control>
            <DateInput.SegmentGroup />
        </DateInput.Control>
        <DateInput.HiddenInput />
    </>
);

const rangeParts = (
    <>
        <DateInput.Label>Runs from</DateInput.Label>
        <DateInput.Control>
            <DateInput.SegmentGroup index={0} />
            <span aria-hidden="true">–</span>
            <DateInput.SegmentGroup index={1} />
        </DateInput.Control>
        <DateInput.HiddenInput index={0} />
        <DateInput.HiddenInput index={1} />
    </>
);

const renderInput = (props: SingleProps = {}) => render(<DateInput {...props}>{parts}</DateInput>);

const renderRangeInput = (props: RangeProps = {}) =>
    render(
        <DateInput mode="range" {...props}>
            {rangeParts}
        </DateInput>,
    );

const root = () => document.querySelector('[data-component="DateInput"]') as HTMLElement;

const part = (name: string) =>
    document.querySelector(`[data-component="DateInput.${name}"]`) as HTMLElement;

const segments = () => screen.getAllByRole("spinbutton");

const segment = (name: string) => screen.getByRole("spinbutton", { name });

const labels = () => segments().map((element) => element.getAttribute("aria-label"));

const separators = () =>
    Array.from(
        document.querySelectorAll('[data-component="DateInput.Segment"][data-type="literal"]'),
    );

const hiddenInputs = () =>
    Array.from(document.querySelectorAll<HTMLInputElement>('input[type="hidden"]'));

const hiddenInput = () => hiddenInputs()[0];

const press = (element: HTMLElement, key: string) => fireEvent.keyDown(element, { key });

// A part takes one figure at a time, which is what typing into it looks like
const type = (element: HTMLElement, text: string) => {
    for (const character of text) {
        fireEvent.keyDown(element, { key: character });
    }
};

const focus = (element: HTMLElement) => {
    act(() => element.focus());
};

const blur = (element: HTMLElement) => {
    act(() => element.blur());
};

const paste = (element: HTMLElement, text: string) => {
    fireEvent.paste(element, { clipboardData: { getData: () => text } });
};

// The date as the input hands it back, written the one way so that it can be read at a glance
const handedBack = (onChange: Mock, call = 0) => {
    const date = onChange.mock.calls[call][0] as Date | null;

    return date === null ? null : dayjs(date).format("YYYY-MM-DDTHH:mm");
};

// The two ends of the range as the input hands them back, the same way
const rangeHandedBack = (onChange: Mock, call = 0) => {
    const range = onChange.mock.calls[call][0] as CalendarRange;

    return {
        from: range.from && dayjs(range.from).format("YYYY-MM-DD"),
        to: range.to && dayjs(range.to).format("YYYY-MM-DD"),
    };
};

describe("DateInput", () => {
    it("tags the input and its parts with data-component attributes", () => {
        renderInput();

        for (const name of [
            "DateInput",
            "DateInput.Label",
            "DateInput.Control",
            "DateInput.SegmentGroup",
            "DateInput.Segment",
            "DateInput.HiddenInput",
        ]) {
            expect(document.querySelector(`[data-component="${name}"]`)).not.toBeNull();
        }
    });

    it("lays the date out a part at a time, in the order the locale writes them", () => {
        renderInput();
        expect(labels()).toEqual(["Month", "Day", "Year"]);
    });

    it("names the parts as a group by the label over them", () => {
        renderInput();
        expect(screen.getByRole("group", { name: "Starts on" })).toBe(part("SegmentGroup"));
    });

    it("carries a name given to the input as a whole down to the parts", () => {
        render(<DateInput aria-label="Ends on">{parts}</DateInput>);
        expect(screen.getByRole("group", { name: "Ends on" })).toBeInTheDocument();
    });

    it("stands the placeholders in the empty parts", () => {
        renderInput();

        expect(segment("Month")).toHaveTextContent("mm");
        expect(segment("Day")).toHaveTextContent("dd");
        expect(segment("Year")).toHaveTextContent("yyyy");
        expect(segment("Month")).toHaveAttribute("data-placeholder-shown", "true");
        expect(segment("Month")).not.toHaveAttribute("aria-valuenow");
        expect(segment("Month")).toHaveAttribute("aria-valuetext", "mm");
    });

    it("writes out the date it was given", () => {
        renderInput({ defaultValue: "2024-06-15" });

        expect(segment("Month")).toHaveTextContent("6");
        expect(segment("Month")).toHaveAttribute("aria-valuenow", "6");
        expect(segment("Day")).toHaveAttribute("aria-valuenow", "15");
        expect(segment("Year")).toHaveAttribute("aria-valuenow", "2024");
        expect(segment("Year")).not.toHaveAttribute("data-placeholder-shown");
    });

    it("writes the month and the day with two figures where it is asked to", () => {
        renderInput({ defaultValue: "2024-06-05", leadingZeros: true });

        expect(segment("Month")).toHaveTextContent("06");
        expect(segment("Day")).toHaveTextContent("05");
    });

    it("draws the separators the locale writes, out of the way of a screen reader", () => {
        renderInput();

        expect(separators().map((element) => element.textContent)).toEqual(["/", "/"]);
        separators().forEach((element) => expect(element).toHaveAttribute("aria-hidden", "true"));
    });

    it("carries the ends each part is held between", () => {
        renderInput();

        expect(segment("Month")).toHaveAttribute("aria-valuemin", "1");
        expect(segment("Month")).toHaveAttribute("aria-valuemax", "12");
        expect(segment("Day")).toHaveAttribute("aria-valuemax", "31");
        expect(segment("Year")).toHaveAttribute("aria-valuemax", "9999");
    });

    it("makes every part a tab stop that brings up a number keyboard", () => {
        renderInput();

        segments().forEach((element) => {
            expect(element).toHaveAttribute("tabindex", "0");
            expect(element).toHaveAttribute("contenteditable", "true");
            expect(element).toHaveAttribute("inputmode", "numeric");
        });
    });

    describe("typing a date", () => {
        it("takes a figure into the part it was typed into", () => {
            renderInput();

            press(segment("Month"), "1");

            expect(segment("Month")).toHaveAttribute("aria-valuenow", "1");
            expect(segment("Month")).not.toHaveAttribute("data-placeholder-shown");
        });

        it("moves on to the next part once one is full", () => {
            renderInput();

            press(segment("Month"), "3");

            expect(segment("Day")).toHaveFocus();
        });

        it("waits for a second figure where the first could be either", () => {
            renderInput();

            press(segment("Month"), "1");
            expect(segment("Day")).not.toHaveFocus();

            press(segment("Month"), "2");
            expect(segment("Month")).toHaveAttribute("aria-valuenow", "12");
            expect(segment("Day")).toHaveFocus();
        });

        it("hands back the date once every part of it has been typed", () => {
            const onChange = vi.fn();
            renderInput({ onChange });

            type(segment("Month"), "6");
            type(segment("Day"), "15");
            expect(onChange).not.toHaveBeenCalled();

            type(segment("Year"), "2024");

            expect(onChange).toHaveBeenCalledTimes(1);
            expect(handedBack(onChange)).toBe("2024-06-15T00:00");
        });

        it("marks a part as typed into while the figures for it are being gathered", () => {
            renderInput();

            type(segment("Month"), "6");
            type(segment("Day"), "15");
            expect(segment("Year")).not.toHaveAttribute("data-entered");

            type(segment("Year"), "202");
            expect(segment("Year")).toHaveAttribute("data-entered");
        });

        it("marks a part as filled once those figures have filled it up", () => {
            renderInput();

            type(segment("Month"), "6");
            type(segment("Day"), "15");
            type(segment("Year"), "2024");

            expect(segment("Year")).toHaveTextContent("2024");
            expect(segment("Year")).toHaveAttribute("data-filled");
            expect(segment("Year")).not.toHaveAttribute("data-entered");
        });

        it("leaves a part merely arrived at unmarked, however full it is", () => {
            renderInput({ defaultValue: "2024-06-15" });

            focus(segment("Year"));

            expect(segment("Year")).toHaveTextContent("2024");
            expect(segment("Year")).not.toHaveAttribute("data-entered");
            expect(segment("Year")).not.toHaveAttribute("data-filled");
        });

        it("leaves the last part where it stands once it is full", () => {
            const onChange = vi.fn();
            renderInput({ onChange });

            type(segment("Month"), "6");
            type(segment("Day"), "15");
            type(segment("Year"), "2024");

            type(segment("Year"), "999");

            expect(segment("Year")).toHaveAttribute("aria-valuenow", "2024");
            expect(onChange).toHaveBeenCalledTimes(1);
        });

        it("takes the last part afresh once the reader has taken hold of it again", () => {
            renderInput();

            type(segment("Month"), "6");
            type(segment("Day"), "15");
            type(segment("Year"), "2024");

            fireEvent.pointerDown(segment("Year"));
            type(segment("Year"), "1999");

            expect(segment("Year")).toHaveAttribute("aria-valuenow", "1999");
        });

        it("turns away anything that is not a figure", () => {
            renderInput();

            press(segment("Month"), "a");

            expect(segment("Month")).toHaveTextContent("mm");
        });

        it("writes the date into the hidden input for the form", () => {
            renderInput({ name: "starts-on", defaultValue: "2024-06-15" });

            expect(hiddenInput()).toHaveAttribute("name", "starts-on");
            expect(hiddenInput()).toHaveValue("2024-06-15");
        });

        it("writes it out whichever way it was asked to", () => {
            renderInput({ defaultValue: "2024-06-15", format: "DD/MM/YYYY" });
            expect(hiddenInput()).toHaveValue("15/06/2024");
        });
    });

    describe("moving a part with the keyboard", () => {
        it("steps a part up and down with the arrow keys", () => {
            renderInput({ defaultValue: "2024-06-15" });

            press(segment("Month"), "ArrowUp");
            expect(segment("Month")).toHaveAttribute("aria-valuenow", "7");

            press(segment("Month"), "ArrowDown");
            press(segment("Month"), "ArrowDown");
            expect(segment("Month")).toHaveAttribute("aria-valuenow", "5");
        });

        it("comes round to the other end", () => {
            renderInput({ defaultValue: "2024-12-15" });

            press(segment("Month"), "ArrowUp");

            expect(segment("Month")).toHaveAttribute("aria-valuenow", "1");
        });

        it("lands on the placeholder's own value first where a part is empty", () => {
            renderInput({ placeholderValue: "2020-03-09" });

            press(segment("Month"), "ArrowUp");
            expect(segment("Month")).toHaveAttribute("aria-valuenow", "3");

            press(segment("Month"), "ArrowUp");
            expect(segment("Month")).toHaveAttribute("aria-valuenow", "4");
        });

        it("moves a page at a time", () => {
            renderInput({ defaultValue: "2024-06-15" });

            press(segment("Day"), "PageUp");
            expect(segment("Day")).toHaveAttribute("aria-valuenow", "22");

            press(segment("Year"), "PageDown");
            expect(segment("Year")).toHaveAttribute("aria-valuenow", "2020");
        });

        it("goes to either end with Home and End", () => {
            renderInput({ defaultValue: "2024-07-15" });

            press(segment("Day"), "End");
            expect(segment("Day")).toHaveAttribute("aria-valuenow", "31");

            press(segment("Day"), "Home");
            expect(segment("Day")).toHaveAttribute("aria-valuenow", "1");
        });

        it("holds the day to the month it lands in", () => {
            renderInput({ defaultValue: "2024-06-15" });

            press(segment("Day"), "End");

            expect(segment("Day")).toHaveAttribute("aria-valuenow", "30");
        });

        it("hands the date back once a step has completed it", () => {
            const onChange = vi.fn();
            renderInput({ defaultValue: "2024-06-15", onChange });

            press(segment("Day"), "ArrowUp");

            expect(handedBack(onChange)).toBe("2024-06-16T00:00");
        });

        it("moves between the parts with the arrow keys", () => {
            renderInput();

            press(segment("Month"), "ArrowRight");
            expect(segment("Day")).toHaveFocus();

            press(segment("Day"), "ArrowLeft");
            expect(segment("Month")).toHaveFocus();
        });

        it("stays on the last part rather than running off the end", () => {
            renderInput();

            focus(segment("Year"));
            press(segment("Year"), "ArrowRight");

            expect(segment("Year")).toHaveFocus();
        });

        it("moves the other way round in a page read right to left", () => {
            render(
                <LocaleProvider locale="ar-EG">
                    <DateInput>{parts}</DateInput>
                </LocaleProvider>,
            );

            press(segment("Day"), "ArrowLeft");

            expect(segment("Month")).toHaveFocus();
        });
    });

    describe("taking a date out again", () => {
        it("empties a part with Backspace", () => {
            renderInput({ defaultValue: "2024-06-15" });

            press(segment("Month"), "Backspace");

            expect(segment("Month")).toHaveTextContent("mm");
            expect(segment("Month")).not.toHaveAttribute("aria-valuenow");
        });

        it("takes one figure at a time off a part typed with several", () => {
            renderInput({ defaultValue: "2024-06-15" });

            press(segment("Year"), "Backspace");

            expect(segment("Year")).toHaveAttribute("aria-valuenow", "202");
        });

        it("hands the reader back to the part before where the one they are on is empty", () => {
            renderInput();

            press(segment("Day"), "Backspace");

            expect(segment("Month")).toHaveFocus();
        });

        it("hands back nothing once every part has been taken out", () => {
            const onChange = vi.fn();
            renderInput({ defaultValue: "2024-06-15", onChange });

            press(segment("Month"), "Delete");
            press(segment("Day"), "Delete");
            for (let figure = 0; figure < 4; figure++) {
                press(segment("Year"), "Backspace");
            }

            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange).toHaveBeenCalledWith(null);
            expect(hiddenInput()).toHaveValue("");
        });

        it("empties the whole date from a control of the caller's own", () => {
            const onChange = vi.fn();
            const Clear = () => {
                const { clearValue } = useDateInputContext();

                return (
                    <button type="button" onClick={clearValue}>
                        Clear
                    </button>
                );
            };

            render(
                <DateInput defaultValue="2024-06-15" onChange={onChange}>
                    {parts}
                    <Clear />
                </DateInput>,
            );

            fireEvent.click(screen.getByRole("button", { name: "Clear" }));

            expect(onChange).toHaveBeenCalledWith(null);
            expect(segment("Month")).toHaveTextContent("mm");
        });
    });

    describe("leaving the input", () => {
        it("reports the reader arriving and leaving, but not moving between the parts", () => {
            const onFocusChange = vi.fn();
            renderInput({ onFocusChange });

            focus(segment("Month"));
            expect(onFocusChange).toHaveBeenLastCalledWith(true);

            focus(segment("Day"));
            expect(onFocusChange).toHaveBeenCalledTimes(1);

            blur(segment("Day"));
            expect(onFocusChange).toHaveBeenLastCalledWith(false);
        });

        it("takes a date typed in full but still being typed into", () => {
            const onChange = vi.fn();
            renderInput({ defaultValue: "2024-06-15", onChange });

            focus(segment("Month"));
            press(segment("Month"), "1");
            expect(onChange).not.toHaveBeenCalled();

            blur(segment("Month"));

            expect(handedBack(onChange)).toBe("2024-01-15T00:00");
        });

        it("brings a date outside the ends it was given back within them", () => {
            const onChange = vi.fn();
            renderInput({
                defaultValue: "2024-06-15",
                min: "2024-06-10",
                max: "2024-06-20",
                onChange,
            });

            focus(segment("Day"));
            type(segment("Day"), "25");
            blur(segment("Year"));

            expect(handedBack(onChange, onChange.mock.calls.length - 1)).toBe("2024-06-20T00:00");
            expect(hiddenInput()).toHaveValue("2024-06-20");
        });

        it("brings the date it starts with within them as well", () => {
            renderInput({ defaultValue: "2024-06-25", max: "2024-06-20" });
            expect(hiddenInput()).toHaveValue("2024-06-20");
        });

        it("takes the half of the day from the placeholder where only that is missing", () => {
            const onChange = vi.fn();
            renderInput({
                granularity: "minute",
                defaultValue: "2024-06-15T10:30",
                placeholderValue: "2024-06-15T13:00",
                onChange,
            });

            focus(segment("AM/PM"));
            press(segment("AM/PM"), "Backspace");
            expect(segment("AM/PM")).toHaveAttribute("data-placeholder-shown", "true");
            expect(onChange).not.toHaveBeenCalled();

            blur(segment("AM/PM"));

            expect(segment("AM/PM")).toHaveTextContent("PM");
            expect(segment("AM/PM")).not.toHaveAttribute("data-placeholder-shown");
            expect(handedBack(onChange)).toBe("2024-06-15T22:30");
        });

        it("puts an hour typed before AM or PM in the placeholder's half of the day", () => {
            const onChange = vi.fn();
            renderInput({ granularity: "minute", placeholderValue: "2024-06-15T13:00", onChange });

            type(segment("Month"), "6");
            type(segment("Day"), "15");
            type(segment("Year"), "2024");
            type(segment("Hour"), "10");
            expect(segment("AM/PM")).toHaveTextContent("PM");
            expect(onChange).not.toHaveBeenCalled();

            type(segment("Minute"), "30");

            expect(handedBack(onChange)).toBe("2024-06-15T22:30");
        });
    });

    describe("a date-time", () => {
        it("adds the time after the date, down to the part it was asked for", () => {
            renderInput({ granularity: "second" });
            expect(labels()).toEqual(["Month", "Day", "Year", "Hour", "Minute", "Second", "AM/PM"]);
        });

        it("counts the hours to twenty-four where it is asked to", () => {
            renderInput({ granularity: "minute", hourCycle: 24 });

            expect(screen.queryByRole("spinbutton", { name: "AM/PM" })).toBeNull();
            expect(segment("Hour")).toHaveAttribute("aria-valuemax", "23");
        });

        it("shows the hour the way the cycle counts it", () => {
            renderInput({ granularity: "minute", defaultValue: "2024-06-15T14:05" });

            expect(segment("Hour")).toHaveAttribute("aria-valuenow", "2");
            expect(segment("Minute")).toHaveTextContent("05");
            expect(segment("AM/PM")).toHaveTextContent("PM");
        });

        it("takes a letter for the half of the day", () => {
            renderInput({ granularity: "minute", defaultValue: "2024-06-15T10:30" });

            press(segment("AM/PM"), "p");

            expect(segment("AM/PM")).toHaveTextContent("PM");
            expect(hiddenInput()).toHaveValue("2024-06-15T22:30");
        });

        it("writes the time into the hidden input the way a native input does", () => {
            renderInput({ granularity: "second", defaultValue: "2024-06-15T10:30:45" });
            expect(hiddenInput()).toHaveValue("2024-06-15T10:30:45");
        });
    });

    describe("a stretch of time", () => {
        it("lays out two dates side by side and submits both", () => {
            renderRangeInput({
                name: "runs",
                defaultValue: { from: "2024-06-10", to: "2024-06-14" },
            });

            expect(screen.getAllByRole("group")).toHaveLength(2);
            expect(hiddenInputs().map((element) => element.getAttribute("name"))).toEqual([
                "runs[0]",
                "runs[1]",
            ]);
            expect(hiddenInputs().map((element) => element.value)).toEqual([
                "2024-06-10",
                "2024-06-14",
            ]);
        });

        it("hands back both ends as they are typed", () => {
            const onChange = vi.fn();
            renderRangeInput({ onChange });

            const [fromMonth, fromDay, fromYear, toMonth, toDay, toYear] = segments();

            type(fromMonth, "6");
            type(fromDay, "10");
            type(fromYear, "2024");
            expect(rangeHandedBack(onChange, 0)).toEqual({ from: "2024-06-10", to: null });

            type(toMonth, "6");
            type(toDay, "14");
            type(toYear, "2024");
            expect(rangeHandedBack(onChange, 1)).toEqual({ from: "2024-06-10", to: "2024-06-14" });
        });

        it("runs from the end of one date to the start of the other", () => {
            renderRangeInput();

            const [, , fromYear, toMonth] = segments();

            press(fromYear, "ArrowRight");
            expect(toMonth).toHaveFocus();

            press(toMonth, "ArrowLeft");
            expect(fromYear).toHaveFocus();
        });
    });

    describe("a date arriving whole", () => {
        it("takes a date pasted in", () => {
            const onChange = vi.fn();
            renderInput({ onChange });

            paste(segment("Month"), "2024-06-15");

            expect(handedBack(onChange)).toBe("2024-06-15T00:00");
            expect(segment("Day")).toHaveAttribute("aria-valuenow", "15");
        });

        it("leaves anything that does not read as a date alone", () => {
            const onChange = vi.fn();
            renderInput({ onChange });

            paste(segment("Month"), "next tuesday");

            expect(onChange).not.toHaveBeenCalled();
        });
    });

    describe("laid out for the locale", () => {
        it("follows the locale the input stands in", () => {
            render(
                <LocaleProvider locale="de-DE">
                    <DateInput>{parts}</DateInput>
                </LocaleProvider>,
            );

            expect(labels()).toEqual(["Day", "Month", "Year"]);
            expect(segment("Day")).toHaveTextContent("tt");
            expect(segment("Year")).toHaveTextContent("jjjj");
            expect(separators().map((element) => element.textContent)).toEqual([".", "."]);
        });

        it("takes a locale of its own", () => {
            renderInput({ locale: "fr-FR" });

            expect(labels()).toEqual(["Day", "Month", "Year"]);
            expect(segment("Day")).toHaveTextContent("jj");
        });

        it("names the parts the way the caller asks", () => {
            renderInput({ segmentLabels: { month: "Mois" } });
            expect(screen.getByRole("spinbutton", { name: "Mois" })).toBeInTheDocument();
        });
    });

    describe("where the caller keeps hold of the date", () => {
        it("shows the date it is given", () => {
            renderInput({ value: "2024-06-15", onChange: () => {} });
            expect(segment("Month")).toHaveAttribute("aria-valuenow", "6");
        });

        it("reports what was typed without taking it itself", () => {
            const onChange = vi.fn();
            renderInput({ value: "2024-06-15", onChange });

            press(segment("Month"), "ArrowUp");

            expect(handedBack(onChange)).toBe("2024-07-15T00:00");
            expect(hiddenInput()).toHaveValue("2024-06-15");
        });

        it("follows the caller where they are holding the date", () => {
            const { rerender } = render(
                <DateInput value="2024-06-15" onChange={() => {}}>
                    {parts}
                </DateInput>,
            );
            expect(segment("Month")).toHaveAttribute("aria-valuenow", "6");

            rerender(
                <DateInput value="2024-09-01" onChange={() => {}}>
                    {parts}
                </DateInput>,
            );

            expect(segment("Month")).toHaveAttribute("aria-valuenow", "9");
            expect(segment("Day")).toHaveAttribute("aria-valuenow", "1");
        });
    });

    describe("turned off and read only", () => {
        it("takes the parts out of the tab order and says so on every part", () => {
            renderInput({ disabled: true });

            segments().forEach((element) => {
                expect(element).not.toHaveAttribute("tabindex");
                expect(element).toHaveAttribute("aria-disabled", "true");
                expect(element).toHaveAttribute("data-disabled", "true");
            });
            expect(root()).toHaveAttribute("data-disabled", "true");
            expect(part("Control")).toHaveClass("input-disabled");
            expect(hiddenInput()).toBeDisabled();
        });

        it("leaves a read-only date where it stands while still moving between the parts", () => {
            const onChange = vi.fn();
            renderInput({ readOnly: true, defaultValue: "2024-06-15", onChange });

            press(segment("Month"), "ArrowUp");
            press(segment("Month"), "3");

            expect(segment("Month")).toHaveAttribute("aria-valuenow", "6");
            expect(segment("Month")).toHaveAttribute("aria-readonly", "true");
            expect(onChange).not.toHaveBeenCalled();
            expect(root()).toHaveAttribute("data-readonly", "true");

            press(segment("Month"), "ArrowRight");
            expect(segment("Day")).toHaveFocus();
        });
    });

    it("marks itself invalid", () => {
        renderInput({ invalid: true });

        segments().forEach((element) => expect(element).toHaveAttribute("aria-invalid", "true"));
        expect(root()).toHaveAttribute("data-invalid", "true");
        expect(part("Control")).toHaveClass("input-error");
    });

    it("marks a date that has been ruled out as invalid", () => {
        const isSaturday = (date: Date) => date.getDay() === 6;

        const { unmount } = renderInput({
            defaultValue: "2024-06-15",
            isDateUnavailable: isSaturday,
        });
        expect(root()).toHaveAttribute("data-invalid", "true");
        unmount();

        renderInput({ defaultValue: "2024-06-17", isDateUnavailable: isSaturday });
        expect(root()).not.toHaveAttribute("data-invalid");
    });

    it("says nothing about the states it is not in", () => {
        renderInput();

        for (const state of ["data-disabled", "data-readonly", "data-required", "data-invalid"]) {
            expect(root()).not.toHaveAttribute(state);
            expect(part("Control")).not.toHaveAttribute(state);
        }
    });

    it("marks itself required", () => {
        renderInput({ required: true });

        // A hidden input is nothing the matcher reads as required, so the attribute is read
        // off it instead
        expect(hiddenInput()).toHaveAttribute("required");
        expect(root()).toHaveAttribute("data-required", "true");
    });

    it("carries its name and form to the hidden input", () => {
        renderInput({ name: "starts-on", form: "booking" });

        expect(hiddenInput()).toHaveAttribute("name", "starts-on");
        expect(hiddenInput()).toHaveAttribute("form", "booking");
    });

    describe("in a form control", () => {
        it("is wired into the field around it", () => {
            render(
                <FormControl disabled>
                    <FormControl.Label>Match day</FormControl.Label>
                    <DateInput>
                        <DateInput.Control>
                            <DateInput.SegmentGroup />
                        </DateInput.Control>
                        <DateInput.HiddenInput />
                    </DateInput>
                    <FormControl.Caption>The day of the match</FormControl.Caption>
                    <FormControl.Validation variant="error">Pick a day</FormControl.Validation>
                </FormControl>,
            );

            const group = screen.getByRole("group", { name: "Match day" });

            expect(group).toHaveAttribute(
                "aria-describedby",
                `${screen.getByText("Pick a day").id} ${screen.getByText("The day of the match").id}`,
            );
            expect(hiddenInput()).toBeDisabled();
            expect(root()).toHaveAttribute("data-disabled", "true");
        });

        it("lets what the input says of itself stand", () => {
            render(
                <FormControl disabled>
                    <DateInput disabled={false}>{parts}</DateInput>
                </FormControl>,
            );

            expect(hiddenInput()).not.toBeDisabled();
        });
    });

    describe("drawn from a hook", () => {
        it("is set from wherever the hook is read, as well as from itself", () => {
            const Held = () => {
                const dateInput = useDateInput();

                return (
                    <>
                        <DateInput.RootProvider value={dateInput}>{parts}</DateInput.RootProvider>
                        <button type="button" onClick={() => dateInput.setValue(["2024-06-15"])}>
                            Set
                        </button>
                        <output>{dateInput.valueAsString[0]}</output>
                    </>
                );
            };

            render(<Held />);

            fireEvent.click(screen.getByRole("button", { name: "Set" }));

            expect(segment("Month")).toHaveAttribute("aria-valuenow", "6");
            expect(screen.getByRole("status")).toHaveTextContent("2024-06-15");
        });
    });

    it("names its parts from an id of the caller's own", () => {
        renderInput({ id: "starts" });

        expect(root()).toHaveAttribute("id", "starts");
        expect(part("Label")).toHaveAttribute("id", "starts-label");
        expect(part("Control")).toHaveAttribute("id", "starts-control");
        expect(part("SegmentGroup")).toHaveAttribute("id", "starts-segment-group-0");
        expect(hiddenInput()).toHaveAttribute("id", "starts-hidden-input-0");
    });

    it("takes a name for any one part in place of the one worked out for it", () => {
        renderInput({ ids: { hiddenInput: (index) => `custom-${index}` } });
        expect(hiddenInput()).toHaveAttribute("id", "custom-0");
    });

    it("puts the reader on the first part when the label is pressed", () => {
        renderInput();

        fireEvent.click(part("Label"));

        expect(segment("Month")).toHaveFocus();
    });

    it("puts the reader on the first part when the field is pressed beside them", () => {
        renderInput();

        fireEvent.click(part("Control"));

        expect(segment("Month")).toHaveFocus();
    });

    it("lets the caller draw the segments themselves", () => {
        const onKeyDown = vi.fn();

        render(
            <DateInput>
                <DateInput.Control>
                    <DateInput.SegmentGroup>
                        {(drawn) =>
                            drawn.map((item, index) => (
                                <DateInput.Segment
                                    key={index}
                                    segment={item}
                                    className="mine"
                                    onKeyDown={onKeyDown}
                                />
                            ))
                        }
                    </DateInput.SegmentGroup>
                </DateInput.Control>
            </DateInput>,
        );

        expect(labels()).toEqual(["Month", "Day", "Year"]);
        segments().forEach((element) => expect(element).toHaveClass("date-input-segment", "mine"));

        press(segment("Month"), "3");

        expect(onKeyDown).toHaveBeenCalledTimes(1);
        expect(segment("Month")).toHaveAttribute("aria-valuenow", "3");
    });

    it("forwards a ref to the root and to the hidden input", () => {
        const rootRef = React.createRef<HTMLDivElement>();
        const inputRef = React.createRef<HTMLInputElement>();

        render(
            <DateInput ref={rootRef}>
                <DateInput.Control>
                    <DateInput.SegmentGroup />
                </DateInput.Control>
                <DateInput.HiddenInput ref={inputRef} />
            </DateInput>,
        );

        expect(rootRef.current).toBe(root());
        expect(inputRef.current).toBe(hiddenInput());
    });

    it("merges a custom className onto each part", () => {
        render(
            <DateInput className="root">
                <DateInput.Label className="label">Starts on</DateInput.Label>
                <DateInput.Control className="control">
                    <DateInput.SegmentGroup className="group" />
                </DateInput.Control>
                <DateInput.HiddenInput className="input" />
            </DateInput>,
        );

        expect(root()).toHaveClass("date-input", "root");
        expect(part("Label")).toHaveClass("date-input-label", "label");
        expect(part("Control")).toHaveClass("input", "date-input-control", "control");
        expect(part("SegmentGroup")).toHaveClass("date-input-segment-group", "group");
        expect(hiddenInput()).toHaveClass("date-input-hidden-input", "input");
    });
});
