// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { TagData } from "../editor/tagData";
import { ByteData } from "./byteData";

/**
 * @description Clears the data inspector back to its default state
 */
export function clearDataInspector(): void {
	// This function only gets called when these elements exist so these casts are safe
	(document.getElementById("binary8") as HTMLInputElement).value = "";
	(document.getElementById("binary8") as HTMLInputElement).disabled = true;
	for (let i = 0; i < 4; i++) {
		const numBits = (i + 1) * 8;
		(document.getElementById(`int${numBits}`) as HTMLInputElement).disabled = true;
		(document.getElementById(`int${numBits}`) as HTMLInputElement).value = "";

		(document.getElementById(`uint${numBits}`) as HTMLInputElement).disabled = true;
		(document.getElementById(`uint${numBits}`) as HTMLInputElement).value = "";
	}
	(document.getElementById("int64") as HTMLInputElement).value = "";
	(document.getElementById("int64") as HTMLInputElement).disabled = true;
	(document.getElementById("uint64") as HTMLInputElement).value = "";
	(document.getElementById("uint64") as HTMLInputElement).disabled = true;
	(document.getElementById("utf8") as HTMLInputElement).value = "";
	(document.getElementById("utf8") as HTMLInputElement).disabled = true;
	(document.getElementById("utf16") as HTMLInputElement).value = "";
	(document.getElementById("utf16") as HTMLInputElement).disabled = true;
	(document.getElementById("float32") as HTMLInputElement).value = "";
	(document.getElementById("float32") as HTMLInputElement).disabled = true;
	(document.getElementById("float64") as HTMLInputElement).value = "";
	(document.getElementById("float64") as HTMLInputElement).disabled = true;
}

/**
 * @description Giving a ByteData object and what endianness, populates the data inspector
 * @param {ByteData} byte_obj The ByteData object to represent on the data inspector
 * @param {boolean} littleEndian Wether the data inspector is in littleEndian or bigEndian mode
 */
export function populateDataInspector(byte_obj: ByteData, littleEndian: boolean, tags: TagData[]): void {
	(document.getElementById("binary8") as HTMLInputElement).value = byte_obj.toBinary();
	(document.getElementById("binary8") as HTMLInputElement).disabled = false;
	for (let i = 0; i < 4; i++) {
		const numBits = (i + 1) * 8;
		const signed = byte_obj.byteConverter(numBits, true, littleEndian);
		const unsigned = byte_obj.byteConverter(numBits, false, littleEndian);

		(document.getElementById(`int${numBits}`) as HTMLInputElement).value = isNaN(Number(signed)) ? "End of File" : signed.toString();
		(document.getElementById(`int${numBits}`) as HTMLInputElement).disabled = false;
		(document.getElementById(`uint${numBits}`) as HTMLInputElement).value = isNaN(Number(unsigned)) ? "End of File" : unsigned.toString();
		(document.getElementById(`uint${numBits}`) as HTMLInputElement).disabled = false;
		if (numBits === 32) {
			// The boolean for signed doesn't matter for floats so this could also be 32, false, littleEndian, true
			const float32 = byte_obj.byteConverter(32, true, littleEndian, true);
			(document.getElementById("float32") as HTMLInputElement).value = isNaN(Number(float32)) ? "End of File" : float32.toString();
			(document.getElementById("float32") as HTMLInputElement).disabled = false;
		}
	}
	const signed64 = byte_obj.byteConverter(64, true, littleEndian);
	const unsigned64 = byte_obj.byteConverter(64, false, littleEndian);
	(document.getElementById("int64") as HTMLInputElement).value = isNaN(Number(signed64)) ? "End of File" : signed64.toString();
	(document.getElementById("int64") as HTMLInputElement).disabled = false;
	(document.getElementById("uint64") as HTMLInputElement).value = isNaN(Number(unsigned64)) ? "End of File" : unsigned64.toString();
	(document.getElementById("uint64") as HTMLInputElement).disabled = false;
	(document.getElementById("utf8") as HTMLInputElement).value = byte_obj.toUTF8(littleEndian);
	(document.getElementById("utf8") as HTMLInputElement).disabled = false;
	(document.getElementById("utf16") as HTMLInputElement).value = byte_obj.toUTF16(littleEndian);
	(document.getElementById("utf16") as HTMLInputElement).disabled = false;
	const float64 = byte_obj.byteConverter(64, true, littleEndian, true);
	(document.getElementById("float64") as HTMLInputElement).value = isNaN(Number(float64)) ? "End of File" : float64.toString();
	(document.getElementById("float64") as HTMLInputElement).disabled = false;
	(document.getElementById("offset") as HTMLInputElement).value = byte_obj.getOffset().toString();
	(document.getElementById("offset") as HTMLInputElement).disabled = false;
	(document.getElementById("selectedTagCaption") as HTMLInputElement).value = "None";
	for(const tag of tags) {
		if(byte_obj.getOffset() >= tag.from &&
			byte_obj.getOffset() <= tag.to) {
			(document.getElementById("selectedTagCaption") as HTMLInputElement).value = tag.caption;
		}
	}
	(document.getElementById("offset") as HTMLInputElement).disabled = false;
}

// This is bound to the on change event for the select which decides to render big or little endian
/**
 * @description Handles when the user changes the dropdown for whether they want little or big endianness
 * @param byte_obj The bytedata object representing the selected bytes
 */
export function changeEndianness(byte_obj: ByteData, tags: TagData[]): void {
	const littleEndian = (document.getElementById("endianness") as HTMLInputElement).value === "little";
	populateDataInspector(byte_obj, littleEndian, tags);
}