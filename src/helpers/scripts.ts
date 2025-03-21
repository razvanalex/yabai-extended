// source: https://github.com/raycast/extensions/blob/96b0b92636a71353d2368f891f4b0ec0b2c7476d/extensions/yabai/src/helpers/scripts.ts
import { getPreferenceValues, showToast, Toast } from "@raycast/api";
import { execaCommand } from "execa";
import { userInfo, cpus } from "os";
import fs from "fs";

const userEnv = `env USER=${userInfo().username}`;

export const runYabaiCommand = async (command: string, opt?: { shell?: boolean }) => {
    const preferences = getPreferenceValues<Preferences>();
    let yabaiPath: string;
    if (preferences.yabaiPath && preferences.yabaiPath.length > 0) {
        yabaiPath = preferences.yabaiPath;
    } else {
        yabaiPath = cpus()[0].model.includes("Apple") ? "/opt/homebrew/bin/yabai" : "/usr/local/bin/yabai";
    }

    if (!fs.existsSync(yabaiPath)) {
        await showToast(Toast.Style.Failure, "Yabai executable not found", `Is yabai installed at ${yabaiPath}?`);
        return { stdout: "", stderr: "Yabai executable not found" };
    }

    return await execaCommand([userEnv, yabaiPath, command].join(" "), opt);
};
