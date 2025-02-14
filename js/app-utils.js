export function getMillisecondsFromTimestamp(timestamp) {
    // Parse the input timestamp
    const [minute, secondAndMillis] = timestamp.split(':');
    const [second, hundredths] = secondAndMillis.split('.');

    // Convert to total milliseconds
    return parseInt(minute) * 60 * 1000 +
        parseInt(second) * 1000 +
        parseInt(hundredths) * 10;
}

// Convert to the format minute:second,millisecond
export function getSRTFormatedTimestamp(milliseconds) {
    milliseconds = milliseconds > 0 ? milliseconds : 0;
    const newMinutes = Math.floor(milliseconds / (60 * 1000));
    const remainingMillis = milliseconds % (60 * 1000);
    const newSeconds = Math.floor(remainingMillis / 1000);
    const newMillis = remainingMillis % 1000;

    // Format with leading zeros for consistency
    return `00:${String(newMinutes).padStart(2, '0')}:${String(newSeconds).padStart(2, '0')},${String(newMillis).padStart(3, '0')}`;
}

export function uncensorLine(line) {
    return line
        .replaceAll("f*ck", "fuck")
        .replaceAll("F*ck", "Fuck")
        .replaceAll("sh*t", "shit")
        .replaceAll("b*tch", "bitch")
        .replaceAll("b**ch", "bitch")
        .replaceAll("a**", "ass")
        .replaceAll("f**k", "fuck")
        .replaceAll("F**k", "Fuck");
}

export function addLinebreaksIfNeeded(result) {
    if (result.length > 43 && result.length < 86) {
        if (result.includes(",")) {
            result = result.split(",").join(",\n");
        } else {
            let tmp = "";
            result.split(" ").forEach(e => {
                if (tmp.length > result.length / 2 && !tmp.includes("\n")) {
                    tmp += "\n";
                }
                tmp += e + " ";
            })
            result = tmp;
        }
    } else if (result.length >= 86) {
        document.body.append("ATTENTION: at least one line is longer than 86 characters");
    }
    return result;
}

export function adjustLine (line) {
    let result = uncensorLine(line);

    result = addLinebreaksIfNeeded(result);

    return result;
}