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


function getLineTillSpace(line, maxCharacters) {
    let result = "";
    let lineSplit = line.split(" ");
    for (const word of lineSplit) {
        if (result.length > line.length / 2 || `${result} ${word}`.length > maxCharacters) {
            break;
        }
        result += word + " ";
    }
    return result;
}

export function addLinebreaksIfNeeded(line, maxCharacters) {
    maxCharacters = maxCharacters || 43;
    let result = "";
    while (line.length > maxCharacters) {
        if (line.indexOf(",") > maxCharacters / 2 && line.indexOf(",") < maxCharacters) {
            result += line.substring(0, line.indexOf(",") +1) + "\n";
            line = line.substring(line.indexOf(",") +1).trim();
        } else if (line.includes(" ")){
            let tmp = getLineTillSpace(line, maxCharacters);
            line = line.substring(tmp.length);
            result += tmp.trim() + "\n";
        }
        else {
            result += line.substring(0, maxCharacters - 1) + "-\n";
            line = line.substring(maxCharacters - 1);
        }
    }

    return result + line;
}

export function adjustLine (line, maxCharacters, shouldUncensor) {
    let result = line;
    if (shouldUncensor) {
        result = uncensorLine(result);
    }

    result = addLinebreaksIfNeeded(result, maxCharacters);

    return result;
}