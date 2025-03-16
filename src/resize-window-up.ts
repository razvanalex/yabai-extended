#!/usr/bin/env node

import { runYabaiCommand } from "./helpers/scripts";
import { showFailureToast } from "@raycast/utils";
import { getPreferenceValues } from "@raycast/api";

export default async function Command() {
    const { resizeStep } = getPreferenceValues<Preferences>();
    const resizeValue = parseInt(resizeStep) || 50;

    try {
        const { stderr } = await runYabaiCommand(`-m window --resize top:0:-${resizeValue}`);

        if (stderr) {
            throw new Error(stderr);
        }
    } catch (error) {
        try {
            const { stderr } = await runYabaiCommand(`-m window --resize bottom:0:-${resizeValue}`);

            if (stderr) {
                throw new Error(stderr);
            }
        } catch (error) {
            showFailureToast(error, {
                title: "Failed to resize window.",
            });
        }
    }
}
