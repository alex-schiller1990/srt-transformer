import {adjustLine, getMillisecondsFromTimestamp, getSRTFormatedTimestamp} from './app-utils.js'

function getFormattedEndTime(i, parsedLines, timestamp) {
    let endMilliseconds;
    if (i + 1 < parsedLines.length) {
        endMilliseconds = parsedLines[i + 1].timestamp;
        endMilliseconds = endMilliseconds > 500 ? endMilliseconds - 500 : endMilliseconds;
    } else {
        //last line
        endMilliseconds = timestamp + 2000;
    }
    return getSRTFormatedTimestamp(endMilliseconds);
}

function getParsedLines(linesToParse) {
    let result =  "";
    if (linesToParse.length > 0) {
        let counter = 1;
        const maxCharsPerLine = +document.querySelector("#max-chars-line-break").value;
        linesToParse = linesToParse.filter(line => !isNaN(line.timestamp)).sort((a, b) => a.timestamp - b.timestamp);
        const shouldUncensor = document.querySelector("#uncensor").checked;

        for (let i = 0; i < linesToParse.length; i++) {
            const {timestamp, content} = linesToParse[i];
            if (!(content && content.trim())) {
                continue;
            }
            const startTime = getSRTFormatedTimestamp(timestamp);
            const endTime = getFormattedEndTime(i, linesToParse, timestamp);

            result += `\n${counter}\n${startTime} --> ${endTime}\n${adjustLine(content, maxCharsPerLine, shouldUncensor)}\n`;
            counter++;
        }
    }
    return result;
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector("#file").addEventListener("change", async () => {
        const file = document.querySelector("#file").files[0];
        document.querySelector("#source").innerHTML = await file.text();
    });

    document.querySelector(".transform").addEventListener("click", ()=> {
        const source = document.querySelector("#source").value.split("\n");
        let linesToParse = [];

        for (let i = 0; i < source.length; i++) {
            if (source[i] && source[i].trim() && source[i].includes("]")) {
                const line = source[i].split("]");
                const content = line[line.length-1];
                for (let j = 0; j < line.length-1; j++) {
                    linesToParse.push({
                        timestamp: getMillisecondsFromTimestamp(line[j].replace("[", "")),
                        content: content,
                    });
                }
            }
        }

        const result = document.querySelector("#result");
        result.value = getParsedLines(linesToParse);
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
