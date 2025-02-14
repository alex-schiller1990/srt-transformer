
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector(".transform").addEventListener("click", ()=> {
        const source = document.querySelector("#source").value.split("\n");
        const result = document.querySelector("#result");
        result.value = "";
        console.log(source);
        let counter = 1
        for (let i = 0; i < source.length; i++) {
            if (source[i] && source[i].trim()) {
                const line = source[i].split("]");
                if (!(line[1] && line[1].trim())) {
                    continue;
                }
                const startTime = calcMilliseconds(line[0].replace("[", ""),0);
                let endTime;
                if (source[i + 1] && source[i + 1].trim()) {
                    endTime = calcMilliseconds(source[i + 1].split("]")[0].replace("[", ""), 500, "subtract");
                } else {
                    endTime = calcMilliseconds(line[0].replace("[", ""), 2000);
                }
                console.log("time", startTime, endTime);
                result.value += `\n${counter}\n${startTime} --> ${endTime}\n${adjustLine(line[1])}\n`;
                counter++;
            }
        }
    })

    document.querySelector(".download").addEventListener("click", ()=> {
        let text = document.querySelector("#result").value;
        const name = document.querySelector("#name").value.split(".")[0];
        text = text.replace(/\n/g, "\r\n"); // To retain the Line breaks.
        const blob = new Blob([text], { type: "text/plain"});
        let anchor = document.createElement("a");
        anchor.download = (name || "file") + ".srt";
        anchor.href = window.URL.createObjectURL(blob);
        anchor.target ="_blank";
        anchor.style.display = "none"; // just to be safe!
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    })
})


function calcMilliseconds(timestamp, milliseconds, operation) {
    // Parse the input timestamp
    const [minute, secondAndMillis] = timestamp.split(':');
    const [second, hundredths] = secondAndMillis.split('.');

    // Convert to total milliseconds
    let totalMilliseconds =
        parseInt(minute) * 60 * 1000 +
        parseInt(second) * 1000 +
        parseInt(hundredths) * 10;

    if (operation === "subtract") {
        // Subtract the desired milliseconds
        totalMilliseconds -= milliseconds;
    } else {
        totalMilliseconds += milliseconds;
    }

    // Handle underflow (e.g., negative time)
    if (totalMilliseconds < 0) totalMilliseconds = 0;

    // Convert back to the format minute:second.millisecond
    const newMinutes = Math.floor(totalMilliseconds / (60 * 1000));
    const remainingMillis = totalMilliseconds % (60 * 1000);
    const newSeconds = Math.floor(remainingMillis / 1000);
    const newMillis = remainingMillis % 1000;

    // Format with leading zeros for consistency
    return `00:${String(newMinutes).padStart(2, '0')}:${String(newSeconds).padStart(2, '0')},${String(newMillis).padStart(3, '0')}`;
}


function adjustLine (line) {
    let result = line
        .replaceAll("f*ck", "fuck")
        .replaceAll("F*ck", "Fuck")
        .replaceAll("sh*t", "shit")
        .replaceAll("b*tch", "bitch")
        .replaceAll("b**ch", "bitch")
        .replaceAll("a**", "ass")
        .replaceAll("f**k", "fuck")
        .replaceAll("F**k", "Fuck");

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
    }
    else if (result.length >= 86) {
        document.body.append("ACHTUNG: eine Zeile ist länger als 86 Zeichen")
    }

    return result;
}
