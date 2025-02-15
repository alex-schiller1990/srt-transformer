import {adjustLine, getMillisecondsFromTimestamp, getSRTFormatedTimestamp} from './app-utils.js'

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector("#file").addEventListener("change", async () => {
        const file = document.querySelector("#file").files[0];
        document.querySelector("#source").innerHTML = await file.text();
    });

    document.querySelector(".transform").addEventListener("click", ()=> {
        const source = document.querySelector("#source").value.split("\n");
        const result = document.querySelector("#result");
        result.value = "";
        let counter = 1
        for (let i = 0; i < source.length; i++) {
            if (source[i] && source[i].trim()) {
                const line = source[i].split("]");
                if (!(line[1] && line[1].trim())) {
                    continue;
                }
                let startMilliseconds = getMillisecondsFromTimestamp(line[0].replace("[", ""));
                const startTime = getSRTFormatedTimestamp(startMilliseconds);
                let endMilliseconds;
                if (source[i + 1] && source[i + 1].trim()) {
                    endMilliseconds = getMillisecondsFromTimestamp(source[i + 1].split("]")[0].replace("[", ""));
                    endMilliseconds = endMilliseconds > 500 ? endMilliseconds - 500 : endMilliseconds;
                } else {
                    //last line
                    endMilliseconds = getMillisecondsFromTimestamp(line[0].replace("[", "")) + 2000;
                }
                const endTime = getSRTFormatedTimestamp(endMilliseconds);

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
